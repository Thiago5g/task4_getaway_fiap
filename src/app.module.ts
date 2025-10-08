import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './resources/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from './resources/auth/jwt-passport/jwt-strategy';
import { JwtAuthGuard } from './resources/auth/jwt-passport/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { ClienteModule } from './resources/clientes/cliente.module';
import { VeiculoModule } from './resources/veiculos/veiculo.module';
import { VendaModule } from './resources/vendas/venda.module';
import { UsuarioModule } from './resources/usuarios/usuario.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      // synchronize: true,
    }),
    AuthModule,
    ClienteModule,
    VeiculoModule,
    VendaModule,
    UsuarioModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
