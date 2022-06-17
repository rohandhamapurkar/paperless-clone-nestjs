import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsController } from './jobs.controller';
import { Job, JobSchema } from './entities/job.entity';
import {
  JobChangelog,
  JobChangelogSchema,
} from './entities/job-changelog.entity';
import { JobsService } from './jobs.service';
import AwsSqsProducer from 'src/transport-clients/aws-sqs-producer';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Job.name, schema: JobSchema },
        { name: JobChangelog.name, schema: JobChangelogSchema },
      ],
      'paperless-db',
    ),
    ClientsModule.registerAsync([
      {
        name: 'AwsSqsClientProxy',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return {
            name: 'AwsSqsClientProxy',
            customClass: AwsSqsProducer,
            options: {
              queueUrl: configService.get<string>('AWS_SQS_QUEUE_URL'),
              secretAccessKey: configService.get<string>(
                'AWS_SECRET_ACCESS_KEY',
              ),
              accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
              region: configService.get<string>('AWS_REGION'),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
