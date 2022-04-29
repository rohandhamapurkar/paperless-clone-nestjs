import {
  Controller,
  Inject,
  Post,
  UseGuards,
  Logger,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from 'src/auth/decorators/user.decorator';
import { UserPayloadDto } from 'src/auth/dto/user-payload.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { v4 } from 'uuid';
import { JOB_SERVICE_MESSAGE_PATTERNS } from './constants';
import { GetJobsChangelogDto } from './dto/get-job-changelog.dto';
import { GetJobsDto } from './dto/get-jobs.dto';
const logger = new Logger('JobsController');
@UseGuards(JwtAuthGuard)
@Controller('jobs')
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
  submitJobToQueue(@User() user: UserPayloadDto) {
    this.rmqClient
      .send(JOB_SERVICE_MESSAGE_PATTERNS.CREATE_JOB, {
        userId: user._id,
        templateId: '626a3b9c9c4fe5978b3685c5',
        uuid: v4(),
        dataConfig: [
          // {
          //   type: 'staticText',
          //   text: 'Lorem Ipsum',
          //   position: {
          //     top: 169.97391035548657,
          //     left: 144.50310779804147,
          //     scaleX: 7.520137007208113,
          //     scaleY: 7.520137007208113,
          //     angle: 0,
          //   },
          //   style: {
          //     color: '#000',
          //     fontFamily: 'Arial, Helvetica, sans-serif',
          //     fontSize: 40,
          //     fontWeight: 'normal',
          //     fontStyle: 'normal',
          //     underline: false,
          //     horizontalAlignment: 'left',
          //   },
          // },
          {
            type: 'fromDataset',
            datasetId: '626a61465b8d652bf913f957',
            dataField: 'field2',
            position: {
              top: 169.97391035548657,
              left: 144.50310779804147,
              scaleX: 7.520137007208113,
              scaleY: 7.520137007208113,
              angle: 0,
            },
            style: {
              color: '#000',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: 40,
              fontWeight: 'normal',
              fontStyle: 'normal',
              underline: false,
              horizontalAlignment: 'left',
            },
          },
        ],
      })
      .subscribe({
        next: (v) => logger.log(v),
        error: (e) => logger.error(e),
        complete: () => logger.log('complete'),
      });
  }

  /**
   * Gets the list of user initiated jobs from the job microservice
   */
  @Get()
  getJobs(@Query() query: GetJobsDto, @User() user: UserPayloadDto) {
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
    @User() user: UserPayloadDto,
  ) {
    return this.tcpClient.send(JOB_SERVICE_MESSAGE_PATTERNS.GET_JOB_CHANGELOG, {
      jobId: param.id,
      userId: user._id,
    });
  }
}
