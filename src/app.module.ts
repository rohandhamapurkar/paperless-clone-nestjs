import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { DatasetsModule } from './datasets/datasets.module';
import { CommonModule } from './common/common.module';
import { TemplatesModule } from './templates/templates.module';
import { JobsModule } from './jobs/jobs.module';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),

    MongooseModule.forRootAsync({
      connectionName: 'paperless-db',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forRootAsync({
      connectionName: 'datasets-db',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI_DATASETS'),
      }),
      inject: [ConfigService],
    }),

    CommonModule,
    AuthModule,
    DatasetsModule,
    TemplatesModule,
    JobsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
