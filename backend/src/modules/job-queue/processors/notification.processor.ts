import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../job-queue.constants';
import { NotificationJobData } from '../job-queue.service';

@Processor(QUEUE_NAMES.NOTIFICATIONS)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  async process(job: Job<NotificationJobData>): Promise<any> {
    this.logger.debug(
      `Processing notification job ${job.id} (attempt ${job.attemptsMade + 1})`,
    );

    const { userId, type, title, message, metadata } = job.data;

    this.logger.log(
      `Notification dispatched: user=${userId} type=${type} title="${title}"`,
    );

    return { processed: true, userId, type };
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<NotificationJobData>, error: Error) {
    this.logger.error(
      `Notification job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`,
    );

    if (job.attemptsMade >= (job.opts.attempts ?? 3)) {
      this.logger.error(
        `Notification job ${job.id} moved to DLQ — user=${job.data.userId} type=${job.data.type}`,
      );
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<NotificationJobData>) {
    this.logger.debug(`Notification job ${job.id} completed`);
  }
}
