import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors({
    origin: ['http://localhost:8080', 'https://plc-api-server.herokuapp.com/'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.listen(configService.get<string>('PORT'));
  appContext.close();
}
bootstrap();
