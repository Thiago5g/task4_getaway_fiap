import { Test } from '@nestjs/testing';
import { PaymentsWebhookService } from './payments-webhook.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentWebhookEvent } from '../entity/payment-webhook-event.entity';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';

class RepoMock {
  findOne = jest.fn();
  save = jest.fn();
}

describe('PaymentsWebhookService', () => {
  let service: PaymentsWebhookService;
  let repo: RepoMock;
  let http: { patch: jest.Mock };

  beforeEach(async () => {
    repo = new RepoMock();
    http = { patch: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        PaymentsWebhookService,
        { provide: getRepositoryToken(PaymentWebhookEvent), useValue: repo },
        { provide: HttpService, useValue: http },
      ],
    }).compile();

    service = moduleRef.get(PaymentsWebhookService);
  });

  it('salva e encaminha evento PAGO incluindo preco', async () => {
    repo.findOne.mockResolvedValue(null);
    repo.save.mockResolvedValue({});
    http.patch.mockReturnValue(of({ data: {} }));

    const dto: any = {
      eventId: 'evt-paid-1',
      paymentCode: '1',
      status: 'PAGO',
      preco: 12345,
      currency: 'BRL',
    };

    const res = await service.handle(dto);
    expect(res.message).toBe('Status atualizado com sucesso');
    expect(repo.save).toHaveBeenCalledWith({
      eventoId: dto.eventId,
      dados: dto,
    });
    expect(http.patch).toHaveBeenCalled();
    const forwarded = http.patch.mock.calls[0][1];
    expect(forwarded.preco).toBe(12345);
    expect(forwarded.statusPagamento).toBe('PAGO');
  });

  it('retorna duplicate quando evento já existe', async () => {
    repo.findOne.mockResolvedValue({ id: 'existing' });
    const res = await service.handle({
      eventId: 'dup',
      paymentCode: 'p',
      status: 'PAGO',
      preco: 1,
      currency: 'BRL',
    } as any);
    expect(res.duplicate).toBe(true);
    expect(repo.save).not.toHaveBeenCalled();
    expect(http.patch).not.toHaveBeenCalled();
  });

  it('não lança erro quando forward falha', async () => {
    repo.findOne.mockResolvedValue(null);
    repo.save.mockResolvedValue({});
    http.patch.mockReturnValue(throwError(() => new Error('fail')));
    const res = await service.handle({
      eventId: 'evt-err',
      paymentCode: '5',
      status: 'PENDENTE',
      preco: 10,
      currency: 'BRL',
    } as any);
    expect(res.message).toBe('Status atualizado com sucesso');
  });

  it('encaminha CANCELADO sem preco', async () => {
    repo.findOne.mockResolvedValue(null);
    repo.save.mockResolvedValue({});
    http.patch.mockReturnValue(of({ data: {} }));
    const dto: any = {
      eventId: 'evt-cancel-1',
      paymentCode: '3',
      status: 'CANCELADO',
      currency: 'BRL',
    };
    const res = await service.handle(dto);
    expect(res.message).toBe('Status atualizado com sucesso');
    const forwarded = http.patch.mock.calls[0][1];
    expect(forwarded.preco).toBeUndefined();
    expect(forwarded.statusPagamento).toBe('CANCELADO');
  });
});
