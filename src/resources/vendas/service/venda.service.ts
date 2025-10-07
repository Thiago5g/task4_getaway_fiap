import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../../clientes/entity/cliente.entity';
import { VeiculoStatus, Veiculo } from '../../veiculos/entity/veiculo.entity';
import { VendaMicroserviceClient } from './venda-microservice.client';

@Injectable()
export class VendaService {
  constructor(
    @InjectRepository(Cliente) private clienteRepo: Repository<Cliente>,
    @InjectRepository(Veiculo) private veiculoRepo: Repository<Veiculo>,
    private externalClient: VendaMicroserviceClient,
  ) {}

  async realizarVenda(cpf: string, placa: string, preco: number): Promise<any> {
    const cliente = await this.clienteRepo.findOneBy({ cpf });
    if (!cliente) throw new NotFoundException('Cliente não encontrado');
    const veiculo = await this.veiculoRepo.findOne({ where: { placa } });
    if (!veiculo) throw new NotFoundException('Veículo não encontrado');
    if (veiculo.status === VeiculoStatus.VENDIDO)
      throw new BadRequestException('Veículo já foi vendido');

    const external = await this.externalClient.registrarVenda({
      clienteId: cliente.id,
      veiculoId: veiculo.id,
      preco,
    });

    veiculo.status = VeiculoStatus.VENDIDO;
    await this.veiculoRepo.save(veiculo);

    return {
      message: 'Venda efetuada com sucesso via microserviço.',
      preco,
      cliente: { id: cliente.id, cpf: cliente.cpf },
      veiculo: {
        id: veiculo.id,
        placa: (veiculo as any).placa,
        status: veiculo.status,
      },
      external,
    };
  }

  async listarVendas(): Promise<any[]> {
    const vendas = await this.externalClient.listVendas();
    if (!Array.isArray(vendas)) return [];
    // Enriquecer cada venda com veículo e cliente (assume que venda tem veiculoId/clienteId)
    const enriched = await Promise.all(
      vendas.map(async (v: any) => {
        const veiculo = v.veiculoId
          ? await this.veiculoRepo.findOne({ where: { id: v.veiculoId } })
          : null;
        const cliente = v.clienteId
          ? await this.clienteRepo.findOne({ where: { id: v.clienteId } })
          : null;
        return { ...v, veiculo, cliente };
      }),
    );
    return enriched;
  }

  async obterVendaPorPlaca(placa: string): Promise<any> {
    const veiculo = await this.veiculoRepo.findOne({ where: { placa } });
    if (!veiculo) throw new NotFoundException('Veículo não encontrado');
    const venda = await this.externalClient.getVendaPorVeiculo(veiculo.id);
    if (!venda)
      throw new NotFoundException('Venda não encontrada para veículo');
    const cliente = venda.clienteId
      ? await this.clienteRepo.findOne({ where: { id: venda.clienteId } })
      : null;
    return { ...venda, veiculo, cliente };
  }
}
