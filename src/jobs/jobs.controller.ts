import {
  Controller,
  Inject,
  Post,
  UseGuards,
  // Logger,
  Get,
  Query,
  Param,
  Body,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { UserTokenDto } from 'src/auth/dto/user-token-payload.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { v4 } from 'uuid';
import { JOB_SERVICE_MESSAGE_PATTERNS } from './constants';
import { GetJobsChangelogDto } from './dto/get-job-changelog.dto';
import { SubmitJobDto } from './dto/submit-job.dto';
const logger = new Logger('JobsController');

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('jobs')
@Permissions('crud:jobs')
export class JobsController {
  constructor(
    // Tcp client instance for communication with job microservice
    @Inject('JOB_SERVICE_TCP') private tcpClient: ClientProxy,
    // RabbitMQ client instance for communication with job microservice
    @Inject('JOB_SERVICE_RMQ') private rmqClient: ClientProxy,
  ) {}

  /**
   * Submits the job definition from UI to job microservice
   */
  @Post()
  submitJobToQueue(
    @Body() body: SubmitJobDto,
    @RequestUser() user: UserTokenDto,
  ) {
    this.rmqClient
      .send(JOB_SERVICE_MESSAGE_PATTERNS.CREATE_JOB, {
        userId: user._id,
        uuid: v4(),
        ...body,
      })
      .subscribe({
        next: function () {
          logger.debug('next');
        },
        error: function (err) {
          logger.error(err);
        },
        complete: function () {
          logger.debug('Job Inserted in queue');
        },
      });
    return 'Job submitted successfully';
  }

  /**
   * Gets the list of user initiated jobs from the job microservice
   */
  @Get()
  getJobs(@Query() query: PaginationDto, @RequestUser() user: UserTokenDto) {
    return this.tcpClient.send(JOB_SERVICE_MESSAGE_PATTERNS.GET_JOBS, {
      ...query,
      userId: user._id,
    });
  }

  /**
   * Gets the job changelog for a given job
   */
  @Get('job-changelog/:id')
  getJobChangelog(
    @Param() param: GetJobsChangelogDto,
    @RequestUser() user: UserTokenDto,
  ) {
    return this.tcpClient.send(JOB_SERVICE_MESSAGE_PATTERNS.GET_JOB_CHANGELOG, {
      jobId: param.id,
      userId: user._id,
    });
  }
}
