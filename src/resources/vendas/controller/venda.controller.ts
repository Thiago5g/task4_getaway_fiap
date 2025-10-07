import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { VendaService } from '../service/venda.service';
import { CreateVendaDto } from '../dto/create-venda.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Vendas')
@Controller('vendas')
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}

  @Post()
  @ApiOperation({ summary: 'Realizar uma venda delegando ao microserviço' })
  @ApiBody({ type: CreateVendaDto })
  vender(@Body() body: CreateVendaDto): Promise<any> {
    const { cpf, placa, preco } = body;
    return this.vendaService.realizarVenda(cpf, placa, preco);
  }

  @Get()
  @ApiOperation({ summary: 'Listar vendas (microserviço) enriquecidas' })
  listar(): Promise<any[]> {
    return this.vendaService.listarVendas();
  }

  @Get('placa/:placa')
  @ApiOperation({ summary: 'Obter venda por placa do veículo' })
  @ApiParam({ name: 'placa', example: 'ABC1D23' })
  obterPorPlaca(@Param('placa') placa: string): Promise<any> {
    return this.vendaService.obterVendaPorPlaca(placa);
  }
}
