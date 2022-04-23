import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JobsController } from './jobs.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'JOB_SERVICE_RMQ',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('AMQP_CONN_URI')],
            queue: configService.get<string>('AMQP_QUEUE_NAME'),
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'JOB_SERVICE_TCP',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          name: 'JOB_SERVICE_TCP',
          transport: Transport.TCP,
          options: {
            port: configService.get<number>('JOB_SERVICE_TCP_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [JobsController],
})
export class JobsModule {}
