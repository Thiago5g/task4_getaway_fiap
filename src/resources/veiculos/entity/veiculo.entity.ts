// entity/veiculo.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum VeiculoStatus {
  DISPONIVEL = 'DISPONIVEL',
  VENDIDO = 'VENDIDO',
}

@Entity('veiculos')
export class Veiculo {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  marca: string;

  @Column()
  @ApiProperty()
  modelo: string;

  @Column({ nullable: true, unique: true })
  @ApiProperty({ example: 'ABC1D23', description: 'Placa do veículo' })
  placa: string;

  @Column()
  @ApiProperty()
  ano: number;

  @Column()
  @ApiProperty()
  cor: string;

  @Column('numeric')
  @ApiProperty()
  preco: number;

  @Column({ type: 'enum', enum: VeiculoStatus })
  @ApiProperty({ enum: VeiculoStatus })
  status: VeiculoStatus;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: Date;
}
