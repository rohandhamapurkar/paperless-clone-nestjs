import {
  Controller,
  Inject,
  Post,
  UseGuards,
  Get,
  Query,
  Param,
  Body,
  Logger,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { validate } from 'class-validator';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { UserTokenDto } from 'src/auth/dto/user-token-payload.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { JOB_SERVICE_MESSAGE_PATTERNS } from './constants';
import { SubmitJobDto } from './dto/submit-job.dto';
import { JobsService } from './jobs.service';
const logger = new Logger('JobsController');

@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    @Inject('AwsSqsClientProxy') private awsSqsClient: ClientProxy,
  ) {}
  /**
   * Submits the job definition from UI to job microservice
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async submitJobToQueue(
    @Body() body: { payload: string },
    @RequestUser() user: UserTokenDto,
  ) {
    const parsedPayload = JSON.parse(body.payload);
    const dto = new SubmitJobDto();
    dto.dataConfig = parsedPayload.dataConfig;
    dto.templateId = parsedPayload.templateId;
    const errors = await validate(dto);
    if (errors.length != 0)
      throw new BadRequestException('Invalid job definition');
    const job = await this.jobsService.assertJob({
      parsedEventBody: { ...parsedPayload, userId: user._id },
    });
    this.awsSqsClient
      .emit(JOB_SERVICE_MESSAGE_PATTERNS.CREATE_JOB, {
        jobId: job._id,
      })
      .subscribe({
        next: function () {
          // logger.debug('next');
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
    return this.jobsService.findAll({
      ...query,
      userId: user._id,
    });
  }

  /**
   * Gets the job changelog for a given job
   */
  @Get('job-changelog/:id')
  getJobChangelog(
    @Param() param: { id: string },
    @RequestUser() user: UserTokenDto,
  ) {
    return this.jobsService.getChangelog({
      id: param.id,
      userId: user._id,
    });
  }
}
