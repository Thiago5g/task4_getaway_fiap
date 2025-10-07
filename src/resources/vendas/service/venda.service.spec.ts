import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendaService } from './venda.service';
import { Cliente } from '../../clientes/entity/cliente.entity';
import { Veiculo, VeiculoStatus } from '../../veiculos/entity/veiculo.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { VendaMicroserviceClient } from './venda-microservice.client';

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>> & {
  findOne?: jest.Mock;
  findOneBy?: jest.Mock;
  save?: jest.Mock;
};

const mockRepo = () => ({
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
});

const mockMicroClient = () => ({
  registrarVenda: jest.fn().mockResolvedValue({ success: true }),
  listVendas: jest.fn(),
  getVendaPorVeiculo: jest.fn(),
});

describe('VendaService', () => {
  let service: VendaService;
  let clienteRepo: MockRepo<Cliente>;
  let veiculoRepo: MockRepo<Veiculo>;
  let microClient: ReturnType<typeof mockMicroClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        VendaService,
        { provide: getRepositoryToken(Cliente), useFactory: mockRepo },
        { provide: getRepositoryToken(Veiculo), useFactory: mockRepo },
        { provide: VendaMicroserviceClient, useFactory: mockMicroClient },
      ],
    }).compile();

    service = moduleRef.get(VendaService);
    clienteRepo = moduleRef.get(getRepositoryToken(Cliente));
    veiculoRepo = moduleRef.get(getRepositoryToken(Veiculo));
    microClient = moduleRef.get(VendaMicroserviceClient);
  });

  const buildCliente = () => ({ id: 1, cpf: '123', nome: 'Test' }) as Cliente;
  const buildVeiculo = (status: VeiculoStatus = VeiculoStatus.DISPONIVEL) =>
    ({
      id: 10,
      placa: 'ABC1D23',
      status,
    }) as unknown as Veiculo;

  it('realiza venda com sucesso', async () => {
    clienteRepo.findOneBy!.mockResolvedValue(buildCliente());
    veiculoRepo.findOne!.mockResolvedValue(buildVeiculo());

    const result = await service.realizarVenda('123', 'ABC1D23', 50000);
    expect(result.message).toContain('sucesso');
    expect(microClient.registrarVenda).toHaveBeenCalledWith({
      clienteId: 1,
      veiculoId: 10,
      preco: 50000,
    });
    expect(veiculoRepo.save).toHaveBeenCalled();
  });

  it('erro cliente não encontrado', async () => {
    clienteRepo.findOneBy!.mockResolvedValue(null);
    await expect(
      service.realizarVenda('123', 'ABC1D23', 50000),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('erro veiculo não encontrado', async () => {
    clienteRepo.findOneBy!.mockResolvedValue(buildCliente());
    veiculoRepo.findOne!.mockResolvedValue(null);
    await expect(
      service.realizarVenda('123', 'ABC1D23', 50000),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('erro veiculo já vendido', async () => {
    clienteRepo.findOneBy!.mockResolvedValue(buildCliente());
    veiculoRepo.findOne!.mockResolvedValue(buildVeiculo(VeiculoStatus.VENDIDO));
    await expect(
      service.realizarVenda('123', 'ABC1D23', 50000),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  describe('listarVendas', () => {
    it('retorna array enriquecido', async () => {
      microClient.listVendas.mockResolvedValue([
        { id: 1, veiculoId: 10, clienteId: 1, preco: 1000 },
      ]);
      veiculoRepo.findOne!.mockResolvedValue(buildVeiculo());
      clienteRepo.findOne!.mockResolvedValue(buildCliente());
      const res = await service.listarVendas();
      expect(res).toHaveLength(1);
      expect(res[0].veiculo).toBeDefined();
      expect(res[0].cliente).toBeDefined();
    });

    it('retorna vazio se microserviço não retorna array', async () => {
      microClient.listVendas.mockResolvedValue(null);
      const res = await service.listarVendas();
      expect(res).toEqual([]);
    });
  });

  describe('obterVendaPorPlaca', () => {
    it('sucesso', async () => {
      veiculoRepo.findOne!.mockResolvedValue(buildVeiculo());
      microClient.getVendaPorVeiculo.mockResolvedValue({
        id: 55,
        veiculoId: 10,
        clienteId: 1,
        preco: 2000,
      });
      clienteRepo.findOne!.mockResolvedValue(buildCliente());
      const res = await service.obterVendaPorPlaca('ABC1D23');
      expect(res.id).toBe(55);
      expect(res.veiculo.id).toBe(10);
      expect(res.cliente.id).toBe(1);
    });

    it('veiculo não encontrado', async () => {
      veiculoRepo.findOne!.mockResolvedValue(null);
      await expect(
        service.obterVendaPorPlaca('ZZZ9999'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('venda não encontrada', async () => {
      veiculoRepo.findOne!.mockResolvedValue(buildVeiculo());
      microClient.getVendaPorVeiculo.mockResolvedValue(null);
      await expect(
        service.obterVendaPorPlaca('ABC1D23'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
