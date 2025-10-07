import { Injectable, Logger, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface ExternalVendaPayload {
  clienteId: number;
  veiculoId: number;
  preco: number;
}

interface ExternalVendaResponse {
  success: boolean;
  data?: any;
  message?: string;
}

@Injectable()
export class VendaMicroserviceClient {
  private readonly logger = new Logger(VendaMicroserviceClient.name);
  private readonly baseUrl: string;

  constructor(private readonly http: HttpService) {
    this.baseUrl = process.env.SALES_MS_URL || 'http://localhost:3001';
  }

  async registrarVenda(
    payload: ExternalVendaPayload,
  ): Promise<ExternalVendaResponse> {
    try {
      const url = `${this.baseUrl}/vendas`;
      const { data } = await firstValueFrom(
        this.http.post<ExternalVendaResponse>(url, payload),
      );
      return data;
    } catch (error: any) {
      this.logger.error(
        `Erro ao comunicar microserviço de vendas: ${error.message}`,
      );
      if (error.response) {
        throw new HttpException(
          error.response.data?.message || 'Erro no microserviço de vendas',
          error.response.status || 502,
        );
      }
      throw new HttpException(
        'Falha ao conectar ao microserviço de vendas',
        502,
      );
    }
  }

  async listVendas(): Promise<any[]> {
    try {
      const url = `${this.baseUrl}/vendas`;
      const { data } = await firstValueFrom(this.http.get<any[]>(url));
      return data;
    } catch (error: any) {
      this.logger.error(`Erro ao listar vendas: ${error.message}`);
      throw new HttpException('Falha ao listar vendas', 502);
    }
  }

  async getVendaPorVeiculo(veiculoId: number): Promise<any | null> {
    try {
      const url = `${this.baseUrl}/vendas/veiculo/${veiculoId}`;
      const { data } = await firstValueFrom(this.http.get<any>(url));
      return data;
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      this.logger.error(
        `Erro ao obter venda do veículo ${veiculoId}: ${error.message}`,
      );
      throw new HttpException('Falha ao obter venda', 502);
    }
  }
}
