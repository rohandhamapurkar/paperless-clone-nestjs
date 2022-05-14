import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import http from 'http';
import https from 'https';
import { AppModule } from './app.module';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const httpsOptions = {
    key: Buffer.from(
      configService.get<string>('SSL_PRIVATE_KEY'),
      'base64',
    ).toString('ascii'),
    cert: Buffer.from(
      configService.get<string>('SSL_CERTIFICATE'),
      'base64',
    ).toString('ascii'),
  };
  // const app = await NestFactory.create(AppModule);

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new WrapResponseInterceptor());
  app.enableCors({
    origin: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.init();
  // app.listen(configService.get<string>('PORT'));

  http.createServer(server).listen(configService.get<string>('PORT'));
  https.createServer(httpsOptions, server).listen(443);
  appContext.close();
}
bootstrap();
