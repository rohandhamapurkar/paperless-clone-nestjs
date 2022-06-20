import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { v4 } from 'uuid';
import { GetJobsChangelogDto } from './dto/get-job-changelog.dto';
import { GetJobsDto } from './dto/get-jobs.dto';
import { JobChangelog, JOB_STATUS } from './entities/job-changelog.entity';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private readonly jobRepository: mongoose.Model<Job>,
    @InjectModel(JobChangelog.name)
    private readonly jobChangelogRepository: mongoose.Model<JobChangelog>,
  ) {}

  /**
   * Asserts and returns the user job document in the jobs collection
   */
  async assertJob(data: { parsedEventBody: any }) {
    try {
      const doc = new this.jobRepository({
        userId: data.parsedEventBody.userId,
        templateId: new mongoose.Types.ObjectId(
          data.parsedEventBody.templateId,
        ),
        uuid: v4(),
        receiptHandle: null,
        dataConfig: data.parsedEventBody.dataConfig,
        retryCount: 0,
        createdOn: new Date(),
      });
      const job = await doc.save();
      await this.recordJobChangelog({
        userId: job.userId,
        jobId: job._id,
        status: JOB_STATUS.ASSERTING_JOB,
        message: 'Job entry created in the database',
      });
      return job;
    } catch (err) {
      throw new ServiceUnavailableException(err);
    }
  }

  /**
   * Adds an document to the jobs changelog collection
   */
  private recordJobChangelog({
    userId,
    jobId,
    status,
    message,
  }: {
    userId: string;
    jobId: mongoose.Types.ObjectId;
    message: string;
    status: JOB_STATUS;
  }) {
    const doc = new this.jobChangelogRepository({
      userId,
      jobId,
      status,
      message,
      createdOn: new Date(),
    });
    return doc.save();
  }

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
