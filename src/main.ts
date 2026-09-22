import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // "Content-Disposition" precisa ser exposto explicitamente: por padrão o CORS não deixa o
  // JS do front (origem diferente, :5173 x :4000) ler esse cabeçalho, só o navegador o usa
  // internamente — sem isso, o nome do arquivo de downloads (ex.: a Memória de Cálculo) nunca chega ao front.
  app.enableCors({ exposedHeaders: ['Content-Disposition'] });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('GesImo Gateway API')
    .setDescription('API Gateway para o sistema GesImo')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
