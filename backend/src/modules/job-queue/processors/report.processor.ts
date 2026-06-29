import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../job-queue.constants';
import { ReportJobData } from '../job-queue.service';

@Processor(QUEUE_NAMES.REPORTS)
export class ReportProcessor extends WorkerHost {
  private readonly logger = new Logger(ReportProcessor.name);

  async process(job: Job<ReportJobData>): Promise<any> {
    this.logger.debug(
      `Processing report job ${job.id} (attempt ${job.attemptsMade + 1})`,
    );

    const { reportType, userId, params } = job.data;

    this.logger.log(`Report generated: type=${reportType} user=${userId}`);

    return { processed: true, reportType, userId };
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<ReportJobData>, error: Error) {
    this.logger.error(
      `Report job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<ReportJobData>) {
    this.logger.debug(`Report job ${job.id} completed`);
  }
}
