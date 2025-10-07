import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VeiculoStatus } from '../entity/veiculo.entity';

export class CreateVeiculoDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  marca: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  @IsNotEmpty()
  modelo: string;

  @ApiProperty({ example: 2020 })
  @IsNumber()
  ano: number;

  @ApiProperty({ example: 'Branco' })
  @IsString()
  @IsNotEmpty()
  cor: string;

  @ApiProperty({ example: 95000.0 })
  @IsNumber()
  preco: number;

  @ApiProperty({ enum: VeiculoStatus, required: false })
  @IsEnum(VeiculoStatus)
  status?: VeiculoStatus;
}
