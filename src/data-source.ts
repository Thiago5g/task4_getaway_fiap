import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Cliente } from './resources/clientes/entity/cliente.entity';
import { Veiculo } from './resources/veiculos/entity/veiculo.entity';
import { Usuario } from './resources/usuarios/entity/usuario.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgresql://postgres.ywupywmiuoqwzoupjzew:Egs61512416@aws-0-us-east-2.pooler.supabase.com:5432/postgres',
  entities: [Cliente, Usuario, Veiculo],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: false,
});

export default AppDataSource;
