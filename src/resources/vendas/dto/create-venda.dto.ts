import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendaDto {
  @ApiProperty({ example: '12345678900', description: 'CPF do cliente' })
  @IsString()
  cpf: string;

  @ApiProperty({ example: 'ABC1D23', description: 'Placa do veículo' })
  @IsString()
  placa: string;

  @ApiProperty({ example: 75000.5, description: 'Preço negociado da venda' })
  @IsNumber()
  preco: number;
}
