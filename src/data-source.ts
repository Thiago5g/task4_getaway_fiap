import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Cliente } from './resources/clientes/entity/cliente.entity';
import { Veiculo } from './resources/veiculos/entity/veiculo.entity';
import { Usuario } from './resources/usuarios/entity/usuario.entity';
import { PaymentWebhookEvent } from './resources/payments-webhook/entity/payment-webhook-event.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Cliente, Usuario, Veiculo, PaymentWebhookEvent],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: false,
});
