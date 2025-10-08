import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncomingPaymentWebhookDto } from '../dto/incoming-payment-webhook.dto';
import { PaymentWebhookEvent } from '../entity/payment-webhook-event.entity';

@Injectable()
export class PaymentsWebhookService {
  private readonly logger = new Logger(PaymentsWebhookService.name);
  private salesServiceUrl =
    process.env.SALES_SERVICE_URL || 'http://localhost:3001';

  constructor(
    @InjectRepository(PaymentWebhookEvent)
    private readonly repo: Repository<PaymentWebhookEvent>,
    private readonly http: HttpService,
  ) {}

  async handle(dto: IncomingPaymentWebhookDto) {
    const existing = await this.repo.findOne({
      where: { eventoId: dto.eventId },
    });
    if (existing) {
      this.logger.debug(`Duplicate event ${dto.eventId} ignored`);
      return { received: true, duplicate: true };
    }

    await this.repo.save({ eventoId: dto.eventId, dados: dto });

    try {
      const forwardPayload: any = { ...dto };
      // Mapear status PT -> EN se microserviço ainda espera inglês (ajuste se necessário)
      const statusMap: Record<string, string> = {
        PAGO: 'PAID',
        CANCELADO: 'CANCELED',
        FALHOU: 'FAILED',
        PENDENTE: 'PENDING',
      };
      forwardPayload.status = statusMap[dto.status] || dto.status;

      // Incluir preco apenas quando pago e informado
      if (dto.status === 'PAGO' && typeof dto.preco === 'number') {
        forwardPayload.preco = dto.preco;
      }
      // Se cancelado, remover preco se existir (não necessário para cancelamento)
      if (dto.status === 'CANCELADO') {
        delete forwardPayload.preco;
      }
      await this.http
        .put(`${this.salesServiceUrl}/internal/payments/sync`, forwardPayload, {
          timeout: 5000,
        })
        .toPromise();
      this.logger.log(
        `Forwarded payment event ${dto.eventId} status=${dto.status} (mapped=${forwardPayload.status}) -> sales service`,
      );
    } catch (err: any) {
      this.logger.error(
        `Failed forwarding event ${dto.eventId}: ${err?.message || err}`,
      );
      // TODO: enqueue retry (BullMQ) if required
    }
    return { received: true };
  }
}
