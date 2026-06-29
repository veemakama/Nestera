import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Dispute,
  DisputeMessage,
  DisputeStatus,
  DisputeTimeline,
} from './entities/dispute.entity';
import { MedicalClaim } from '../claims/entities/medical-claim.entity';
import {
  CreateDisputeDto,
  UpdateDisputeDto,
  AddDisputeMessageDto,
} from './dto/dispute.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import { AuditLogService } from '../../common/services/audit-log.service';
import {
  AuditAction,
  AuditResourceType,
} from '../../common/entities/audit-log.entity';

const ALLOWED_TRANSITIONS: Record<DisputeStatus, DisputeStatus[]> = {
  [DisputeStatus.OPEN]: [
    DisputeStatus.IN_PROGRESS,
    DisputeStatus.UNDER_REVIEW,
    DisputeStatus.CLOSED,
  ],
  [DisputeStatus.IN_PROGRESS]: [
    DisputeStatus.UNDER_REVIEW,
    DisputeStatus.RESOLVED,
    DisputeStatus.CLOSED,
  ],
  [DisputeStatus.UNDER_REVIEW]: [
    DisputeStatus.RESOLVED,
    DisputeStatus.ESCALATED,
    DisputeStatus.CLOSED,
  ],
  [DisputeStatus.RESOLVED]: [DisputeStatus.CLOSED, DisputeStatus.OPEN],
  [DisputeStatus.CLOSED]: [],
  [DisputeStatus.ESCALATED]: [
    DisputeStatus.UNDER_REVIEW,
    DisputeStatus.RESOLVED,
    DisputeStatus.CLOSED,
  ],
};

@Injectable()
export class DisputesService {
  private assertValidTransition(
    current: DisputeStatus,
    next: DisputeStatus,
    action: string,
  ): void {
    const allowed = ALLOWED_TRANSITIONS[current];
    if (!allowed.includes(next)) {
      throw new BadRequestException(
        `Cannot ${action}: transition from ${current} to ${next} is not allowed`,
      );
    }
  }

  constructor(
    @InjectRepository(Dispute)
    private readonly disputeRepository: Repository<Dispute>,
    @InjectRepository(DisputeMessage)
    private readonly messageRepository: Repository<DisputeMessage>,
    @InjectRepository(MedicalClaim)
    private readonly claimRepository: Repository<MedicalClaim>,
    @InjectRepository(DisputeTimeline)
    private readonly timelineRepository: Repository<DisputeTimeline>,
    private readonly notificationsService: NotificationsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async createDispute(
    createDisputeDto: CreateDisputeDto,
    correlationId?: string,
    requestId?: string,
  ): Promise<Dispute> {
    const claim = await this.claimRepository.findOneBy({
      id: createDisputeDto.claimId,
    });
    if (!claim) {
      throw new BadRequestException('Invalid claim ID. Claim does not exist.');
    }

    const dispute = this.disputeRepository.create({
      ...createDisputeDto,
      status: DisputeStatus.OPEN,
    });
    const savedDispute = await this.disputeRepository.save(dispute);

    // Add timeline entry
    await this.timelineRepository.save(
      this.timelineRepository.create({
        disputeId: savedDispute.id,
        action: 'CREATED',
        performedBy: savedDispute.disputedBy,
        description: 'Dispute created',
      }),
    );

    await this.auditLogService.log({
      action: AuditAction.CREATE,
      resourceType: AuditResourceType.DISPUTE,
      actor: savedDispute.disputedBy || 'unknown',
      correlationId,
      requestId,
      resourceId: savedDispute.id,
      description: `User submitted dispute for claim ${createDisputeDto.claimId}`,
      newValue: {
        claimId: createDisputeDto.claimId,
        reason: createDisputeDto.reason,
      },
      success: true,
    });

    return savedDispute;
  }

  async findAll(): Promise<Dispute[]> {
    return await this.disputeRepository.find({
      relations: ['claim', 'messages', 'timeline'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Dispute> {
    const dispute = await this.disputeRepository.findOne({
      where: { id },
      relations: ['claim', 'messages', 'timeline'],
    });
    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }
    return dispute;
  }

  async updateDispute(
    id: string,
    updateDisputeDto: UpdateDisputeDto,
  ): Promise<Dispute> {
    const dispute = await this.findOne(id);
    Object.assign(dispute, updateDisputeDto);
    return await this.disputeRepository.save(dispute);
  }

  async addMessage(
    id: string,
    addMessageDto: AddDisputeMessageDto,
  ): Promise<DisputeMessage> {
    const dispute = await this.findOne(id);

    const message = this.messageRepository.create({
      disputeId: dispute.id,
      ...addMessageDto,
    });
    const savedMessage = await this.messageRepository.save(message);

    // Add timeline entry
    await this.timelineRepository.save(
      this.timelineRepository.create({
        disputeId: dispute.id,
        action: 'MESSAGE_ADDED',
        performedBy: addMessageDto.author,
        description: addMessageDto.message,
      }),
    );

    return savedMessage;
  }

  async startInvestigation(
    id: string,
    actor: string,
    correlationId?: string,
    requestId?: string,
  ): Promise<Dispute> {
    const dispute = await this.findOne(id);
    const previousState = { status: dispute.status };

    this.assertValidTransition(
      dispute.status,
      DisputeStatus.UNDER_REVIEW,
      'start investigation',
    );
    dispute.status = DisputeStatus.UNDER_REVIEW;
    dispute.assignedTo = actor;
    dispute.assignedAt = new Date();

    const updatedDispute = await this.disputeRepository.save(dispute);

    await this.timelineRepository.save(
      this.timelineRepository.create({
        disputeId: id,
        action: 'INVESTIGATION_STARTED',
        performedBy: actor,
        description: 'Investigation started',
        previousState,
        newState: { status: dispute.status },
      }),
    );

    await this.auditLogService.log({
      action: AuditAction.UPDATE,
      resourceType: AuditResourceType.DISPUTE,
      actor,
      correlationId,
      requestId,
      resourceId: id,
      description: `Investigation started on dispute ${id}`,
      previousValue: previousState,
      newValue: { status: DisputeStatus.UNDER_REVIEW, assignedTo: actor },
      success: true,
    });

    return updatedDispute;
  }

  async resolveDispute(
    id: string,
    actor: string,
    resolution: string,
    correlationId?: string,
    requestId?: string,
  ): Promise<Dispute> {
    const dispute = await this.findOne(id);
    const previousState = { status: dispute.status };

    this.assertValidTransition(
      dispute.status,
      DisputeStatus.RESOLVED,
      'resolve dispute',
    );
    dispute.status = DisputeStatus.RESOLVED;
    dispute.resolvedAt = new Date();
    dispute.resolvedBy = actor;
    dispute.resolution = resolution;

    const updatedDispute = await this.disputeRepository.save(dispute);

    await this.timelineRepository.save(
      this.timelineRepository.create({
        disputeId: id,
        action: 'DISPUTE_RESOLVED',
        performedBy: actor,
        description: `Resolved: ${resolution}`,
        previousState,
        newState: { status: dispute.status },
      }),
    );

    await this.auditLogService.log({
      action: AuditAction.RESOLVE,
      resourceType: AuditResourceType.DISPUTE,
      actor,
      correlationId,
      requestId,
      resourceId: id,
      description: `Dispute ${id} resolved: ${resolution}`,
      previousValue: previousState,
      newValue: {
        status: DisputeStatus.RESOLVED,
        resolution,
        resolvedBy: actor,
      },
      success: true,
    });

    return updatedDispute;
  }

  async closeDispute(
    id: string,
    actor: string,
    correlationId?: string,
    requestId?: string,
  ): Promise<Dispute> {
    const dispute = await this.findOne(id);
    const previousState = { status: dispute.status };

    this.assertValidTransition(
      dispute.status,
      DisputeStatus.CLOSED,
      'close dispute',
    );
    dispute.status = DisputeStatus.CLOSED;

    const updatedDispute = await this.disputeRepository.save(dispute);

    await this.timelineRepository.save(
      this.timelineRepository.create({
        disputeId: id,
        action: 'DISPUTE_CLOSED',
        performedBy: actor,
        description: 'Dispute closed',
        previousState,
        newState: { status: dispute.status },
      }),
    );

    await this.auditLogService.log({
      action: AuditAction.UPDATE,
      resourceType: AuditResourceType.DISPUTE,
      actor,
      correlationId,
      requestId,
      resourceId: id,
      description: `Dispute ${id} closed`,
      previousValue: previousState,
      newValue: { status: DisputeStatus.CLOSED },
      success: true,
    });

    return updatedDispute;
  }

  async escalateDispute(
    id: string,
    actor: string,
    correlationId?: string,
    requestId?: string,
  ): Promise<Dispute> {
    const dispute = await this.findOne(id);
    const previousState = { status: dispute.status };

    this.assertValidTransition(
      dispute.status,
      DisputeStatus.ESCALATED,
      'escalate dispute',
    );
    dispute.status = DisputeStatus.ESCALATED;
    dispute.escalatedTo = actor;
    dispute.escalatedAt = new Date();

    const updatedDispute = await this.disputeRepository.save(dispute);

    await this.timelineRepository.save(
      this.timelineRepository.create({
        disputeId: id,
        action: 'DISPUTE_ESCALATED',
        performedBy: actor,
        description: 'Dispute escalated',
        previousState,
        newState: { status: dispute.status },
      }),
    );

    await this.auditLogService.log({
      action: AuditAction.ESCALATE,
      resourceType: AuditResourceType.DISPUTE,
      actor,
      correlationId,
      requestId,
      resourceId: id,
      description: `Dispute ${id} escalated to ${actor}`,
      previousValue: previousState,
      newValue: { status: DisputeStatus.ESCALATED, escalatedTo: actor },
      success: true,
    });

    return updatedDispute;
  }

  async reopenDispute(
    id: string,
    actor: string,
    reason: string,
  ): Promise<Dispute> {
    const dispute = await this.findOne(id);
    const previousState = { status: dispute.status };

    this.assertValidTransition(
      dispute.status,
      DisputeStatus.OPEN,
      'reopen dispute',
    );

    dispute.status = DisputeStatus.OPEN;
    (dispute as any).resolvedAt = null;
    (dispute as any).resolvedBy = null;
    (dispute as any).resolution = null;

    const updatedDispute = await this.disputeRepository.save(dispute);

    await this.timelineRepository.save(
      this.timelineRepository.create({
        disputeId: id,
        action: 'DISPUTE_REOPENED',
        performedBy: actor,
        description: `Reopened: ${reason}`,
        previousState,
        newState: { status: dispute.status },
      }),
    );

    return updatedDispute;
  }
}
