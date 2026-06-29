import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { JobQueueService } from './job-queue.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Admin - Job Queue')
@ApiBearerAuth()
@Controller('admin/queues')
@Roles(Role.ADMIN)
export class JobQueueController {
  constructor(private readonly jobQueueService: JobQueueService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get status of all job queues' })
  async getAllQueuesStatus() {
    const statuses = await this.jobQueueService.getAllQueuesStatus();
    return { success: true, data: statuses };
  }

  @Get(':queueName/status')
  @ApiOperation({ summary: 'Get status of a specific queue' })
  @ApiParam({ name: 'queueName', description: 'Name of the queue' })
  async getQueueStatus(@Param('queueName') queueName: string) {
    const status = await this.jobQueueService.getQueueStatus(queueName);
    return { success: true, data: status };
  }

  @Get(':queueName/failed')
  @ApiOperation({ summary: 'Get failed jobs in a queue (DLQ view)' })
  @ApiParam({ name: 'queueName', description: 'Name of the queue' })
  async getFailedJobs(
    @Param('queueName') queueName: string,
    @Query('start') start = 0,
    @Query('end') end = 20,
  ) {
    const jobs = await this.jobQueueService.getFailedJobs(
      queueName,
      Number(start),
      Number(end),
    );
    return {
      success: true,
      data: jobs.map((job) => ({
        id: job.id,
        name: job.name,
        data: job.data,
        attemptsMade: job.attemptsMade,
        failedReason: job.failedReason,
        timestamp: job.timestamp,
      })),
    };
  }

  @Post(':queueName/retry/:jobId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retry a failed job' })
  async retryJob(
    @Param('queueName') queueName: string,
    @Param('jobId') jobId: string,
  ) {
    const result = await this.jobQueueService.retryFailedJob(queueName, jobId);
    return { success: true, data: result };
  }
}
