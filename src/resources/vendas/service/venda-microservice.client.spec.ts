import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { VendaMicroserviceClient } from './venda-microservice.client';
import { HttpException } from '@nestjs/common';

describe('VendaMicroserviceClient', () => {
  let client: VendaMicroserviceClient;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        VendaMicroserviceClient,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    client = moduleRef.get(VendaMicroserviceClient);
    httpService = moduleRef.get(HttpService);
  });

  const payload = { clienteId: 1, veiculoId: 2, preco: 1000 };

  it('retorna dados em caso de sucesso', async () => {
    (httpService.post as jest.Mock).mockReturnValue(
      of({ data: { success: true, data: { id: 99 } } }),
    );
    const res = await client.registrarVenda(payload);
    expect(res.success).toBe(true);
    expect(httpService.post).toHaveBeenCalled();
  });

  it('lança HttpException com response (erro do microserviço)', async () => {
    (httpService.post as jest.Mock).mockReturnValue(
      throwError(() => ({
        message: 'fail',
        response: { status: 400, data: { message: 'Erro externo' } },
      })),
    );
    await expect(client.registrarVenda(payload)).rejects.toBeInstanceOf(
      HttpException,
    );
  });

  it('lança HttpException sem response (erro de conexão)', async () => {
    (httpService.post as jest.Mock).mockReturnValue(
      throwError(() => ({ message: 'ECONNREFUSED' })),
    );
    await expect(client.registrarVenda(payload)).rejects.toBeInstanceOf(
      HttpException,
    );
  });

  describe('listVendas', () => {
    it('sucesso retorna array', async () => {
      (httpService.get as jest.Mock).mockReturnValue(of({ data: [{ id: 1 }] }));
      const res = await client.listVendas();
      expect(res).toEqual([{ id: 1 }]);
    });

    it('erro lança HttpException', async () => {
      (httpService.get as jest.Mock).mockReturnValue(
        throwError(() => ({ message: 'boom' })),
      );
      await expect(client.listVendas()).rejects.toBeInstanceOf(HttpException);
    });
  });

  describe('getVendaPorVeiculo', () => {
    it('sucesso retorna venda', async () => {
      (httpService.get as jest.Mock).mockReturnValue(
        of({ data: { id: 77, veiculoId: 2 } }),
      );
      const res = await client.getVendaPorVeiculo(2);
      expect(res?.id).toBe(77);
    });

    it('retorna null para 404', async () => {
      (httpService.get as jest.Mock).mockReturnValue(
        throwError(() => ({ response: { status: 404 }, message: 'not' })),
      );
      const res = await client.getVendaPorVeiculo(2);
      expect(res).toBeNull();
    });

    it('erro diferente de 404 lança HttpException', async () => {
      (httpService.get as jest.Mock).mockReturnValue(
        throwError(() => ({ message: 'falhou' })),
      );
      await expect(client.getVendaPorVeiculo(2)).rejects.toBeInstanceOf(
        HttpException,
      );
    });
  });
});
