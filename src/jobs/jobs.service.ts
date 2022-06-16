import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { GetJobsChangelogDto } from './dto/get-job-changelog.dto';
import { GetJobsDto } from './dto/get-jobs.dto';
import { JobChangelog } from './entities/job-changelog.entity';
import { Job } from './entities/job.entity';
const logger = new Logger('JobsService');

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private readonly jobRepository: mongoose.Model<Job>,
    @InjectModel(JobChangelog.name)
    private readonly jobChangelogRepository: mongoose.Model<JobChangelog>,

    @InjectConnection('paperless-db')
    private readonly paperlessDbConnection: mongoose.Connection,
    @InjectConnection('datasets-db')
    private readonly datasetsDbConnection: mongoose.Connection,
  ) {}

  /**
   * Gets all jobs for a user from db
   */
  async findAll({ pageNo, pageSize, userId }: GetJobsDto) {
    const jobs = await this.jobRepository.find(
      { userId: userId },
      { dataConfig: 0, templateId: 0 },
      {
        skip: (+pageNo - 1) * +pageSize,
        limit: +pageSize,
        sort: { createdOn: -1 },
      },
    );

    const count = await this.jobRepository.countDocuments({ userId });
    return {
      data: jobs,
      fetchCount: count,
      totalCount: count,
    };
  }

  /**
   * Gets all changelog rows for a user job
   */
  async getChangelog({ id, userId }: GetJobsChangelogDto) {
    return this.jobChangelogRepository.find(
      {
        jobId: new mongoose.Types.ObjectId(id),
        userId: userId,
      },
      {},
      { sort: { createdOn: -1 } },
    );
  }
}
