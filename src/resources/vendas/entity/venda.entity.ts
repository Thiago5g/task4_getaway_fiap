import { Cliente } from 'src/resources/clientes/entity/cliente.entity';
import { Veiculo } from 'src/resources/veiculos/entity/veiculo.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'vendas' })
export class Venda {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'cliente_id' })
  @ApiProperty({ example: 1 })
  clienteId: number;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  @ApiProperty({ type: () => Cliente })
  cliente: Cliente;

  @Column({ name: 'veiculo_id' })
  @ApiProperty({ example: 42 })
  veiculoId: number;

  @ManyToOne(() => Veiculo, { eager: true })
  @JoinColumn({ name: 'veiculo_id' })
  @ApiProperty({ type: () => Veiculo })
  veiculo: Veiculo;

  @Column({ type: 'numeric', name: 'preco', nullable: false })
  @ApiProperty({ example: 75000.0 })
  preco: number;

  @CreateDateColumn({ name: 'data_venda' })
  @ApiProperty({ example: '2025-06-22T14:33:05.000Z' })
  dataVenda: Date;
}
