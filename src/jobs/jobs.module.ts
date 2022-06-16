import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsController } from './jobs.controller';
import { Job, JobSchema } from './entities/job.entity';
import {
  JobChangelog,
  JobChangelogSchema,
} from './entities/job-changelog.entity';
import { JobsService } from './jobs.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Job.name, schema: JobSchema },
        { name: JobChangelog.name, schema: JobChangelogSchema },
      ],
      'paperless-db',
    ),
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
