import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Risk Manager API')
    .setDescription('API for managing trading operations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  await app.listen(PORT);
  // Log amigável de inicialização
  // eslint-disable-next-line no-console
  console.log(
    `🚀 API rodando na porta ${PORT} - Swagger: http://localhost:${PORT}/api/docs`,
  );
}
bootstrap();
