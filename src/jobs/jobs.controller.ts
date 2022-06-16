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
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { UserTokenDto } from 'src/auth/dto/user-token-payload.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { v4 } from 'uuid';
import { JOB_SERVICE_MESSAGE_PATTERNS } from './constants';
import { GetJobsChangelogDto } from './dto/get-job-changelog.dto';
import { SubmitJobDto } from './dto/submit-job.dto';
import { JobsService } from './jobs.service';
const logger = new Logger('JobsController');

@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}
  /**
   * Submits the job definition from UI to job microservice
   */
  @Post()
  submitJobToQueue(
    @Body() body: SubmitJobDto,
    @RequestUser() user: UserTokenDto,
  ) {
    // this.rmqClient
    //   .send(JOB_SERVICE_MESSAGE_PATTERNS.CREATE_JOB, {
    //     userId: user._id,
    //     uuid: v4(),
    //     ...body,
    //   })
    //   .subscribe({
    //     next: function () {
    //       logger.debug('next');
    //     },
    //     error: function (err) {
    //       logger.error(err);
    //     },
    //     complete: function () {
    //       logger.debug('Job Inserted in queue');
    //     },
    //   });
    // return 'Job submitted successfully';
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
    @Param() param: GetJobsChangelogDto,
    @RequestUser() user: UserTokenDto,
  ) {
    return this.jobsService.getChangelog({
      id: param.id,
      userId: user._id,
    });
  }
}
