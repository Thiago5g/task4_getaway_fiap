import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { IncomingPaymentWebhookDto } from '../dto/incoming-payment-webhook.dto';
import { PaymentWebhookEvent } from '../entity/payment-webhook-event.entity';

type StatusPagamento = 'PENDENTE' | 'PAGO' | 'CANCELADO' | 'FALHOU';

@Injectable()
export class PaymentsWebhookService {
  private readonly logger = new Logger(PaymentsWebhookService.name);
  private readonly salesServiceUrl =
    process.env.SALES_SERVICE_URL || 'http://localhost:3001';

  constructor(
    @InjectRepository(PaymentWebhookEvent)
    private readonly repo: Repository<PaymentWebhookEvent>,
    private readonly http: HttpService,
  ) {}

  async handle(dto: IncomingPaymentWebhookDto) {
    // 1. Idempotência: já processado?
    const existing = await this.repo.findOne({
      where: { eventoId: dto.eventId },
    });
    if (existing) {
      this.logger.debug(`Duplicate event ${dto.eventId} ignored`);
      return { received: true, duplicate: true };
    }

    await this.repo.save({ eventoId: dto.eventId, dados: dto });

    // 2. Normalizar status externo (caso venha em lower / outro formato)

    if (!dto.status) {
      this.logger.warn(
        `Evento ${dto.eventId} com status desconhecido: ${dto.status}`,
      );
      return { received: true, unsupportedStatus: dto.status };
    }

    const codigoPagamento = dto.paymentCode;
    // 3. Construir payload conforme o controller do microserviço de vendas
    const payload: {
      statusPagamento: StatusPagamento;
      preco?: number;
      codigoPagamento: string;
    } = {
      statusPagamento: dto.status,
      codigoPagamento,
      preco: dto.preco,
    };

    if (
      dto.status === 'PAGO' &&
      typeof dto.preco === 'number' &&
      dto.preco >= 0
    ) {
      payload.preco = dto.preco;
    }

    const endpoint = `${this.salesServiceUrl}/vendas/pagamento`;

    try {
      const response = await firstValueFrom(
        this.http.patch(endpoint, payload, {
          timeout: 5000,
        }),
      );
      this.logger.log(
        `Forwarded payment event ${dto.eventId} codigoPagamento=${codigoPagamento} status=${dto.status} -> sales service (status ${response.status})`,
      );
      return {
        forwarded: true,
        salesResponse: response.data,
      };
    } catch (err: any) {
      this.logger.error(
        `Failed forwarding event ${dto.eventId} codigoPagamento=${codigoPagamento}: ${
          err?.message || err
        }`,
      );
      // Futuro: reenfileirar para retry
      return {
        forwarded: false,
        error: 'Falha ao atualizar pagamento no serviço de vendas',
      };
    }
  }
}
