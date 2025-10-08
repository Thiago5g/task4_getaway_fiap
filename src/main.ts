// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Habilita req.rawBody e mantém o body JSON normal funcionando
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors({ origin: '*' });

  const config = new DocumentBuilder()
    .setTitle('Risk Manager API')
    .setDescription('API for managing trading operations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = Number(process.env.PORT) || 3000;
  await app.listen(PORT);
  console.log(
    `🚀 API rodando na porta ${PORT} - Swagger: http://localhost:${PORT}/api/docs`,
  );
}
bootstrap();
