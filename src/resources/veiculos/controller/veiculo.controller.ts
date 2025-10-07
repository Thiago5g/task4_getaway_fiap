// controller/veiculo.controller.ts
import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { VeiculoService } from '../service/veiculo.service';
import { CreateVeiculoDto } from '../dto/create-veiculo.dto';
import { UpdateVeiculoDto } from '../dto/update-veiculo.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Veículos')
@Controller('veiculos')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo veículo' })
  @ApiBody({ type: CreateVeiculoDto })
  criar(@Body() body: CreateVeiculoDto) {
    return this.veiculoService.criarVeiculo(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Editar um veículo existente' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateVeiculoDto })
  editar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateVeiculoDto,
  ) {
    return this.veiculoService.editarVeiculo(id, body);
  }

  @Get('disponiveis')
  @ApiOperation({ summary: 'Listar veículos disponíveis' })
  listarDisponiveis() {
    return this.veiculoService.listarDisponiveis();
  }

  @Get('vendidos')
  @ApiOperation({ summary: 'Listar veículos vendidos' })
  listarVendidos() {
    return this.veiculoService.listarVendidos();
  }

  @Get('todos')
  @ApiOperation({ summary: 'Listar todos os veículos' })
  listarTodos() {
    return this.veiculoService.listarTodos();
  }
}
