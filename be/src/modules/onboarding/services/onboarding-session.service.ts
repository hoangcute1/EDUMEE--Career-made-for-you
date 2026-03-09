import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import {
  OnboardingSession,
  OnboardingSessionDocument,
  OnboardingStatus,
  OnboardingStep,
} from '../schemas/onboarding-session.schema';

@Injectable()
export class OnboardingSessionService {
  constructor(
    @InjectModel(OnboardingSession.name)
    private onboardingSessionModel: Model<OnboardingSessionDocument>,
  ) {}

  async create(createDto: any): Promise<OnboardingSessionDocument> {
    const session = new this.onboardingSessionModel(createDto);
    return session.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: FilterQuery<OnboardingSessionDocument> = {},
  ): Promise<{ data: OnboardingSessionDocument[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.onboardingSessionModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.onboardingSessionModel.countDocuments(filters).exec(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<OnboardingSessionDocument> {
    const session = await this.onboardingSessionModel.findById(id).exec();
    if (!session) {
      throw new NotFoundException(`Onboarding session with ID ${id} not found`);
    }
    return session;
  }

  async findByUser(userId: string): Promise<OnboardingSessionDocument | null> {
    return this.onboardingSessionModel.findOne({ userId }).exec();
  }

  async findActive(): Promise<OnboardingSessionDocument[]> {
    return this.onboardingSessionModel.find({ status: 'in_progress' }).exec();
  }

  async findCompleted(): Promise<OnboardingSessionDocument[]> {
    return this.onboardingSessionModel.find({ status: 'completed' }).exec();
  }

  async updateProgress(
    id: string,
    currentStep: string,
    progressData: Record<string, unknown>,
  ): Promise<OnboardingSessionDocument> {
    return this.update(id, {
      currentStep,
      ...progressData,
    });
  }

  async completeStep(
    id: string,
    step: string,
    stepData: unknown,
  ): Promise<OnboardingSessionDocument> {
    const session = await this.findOne(id);

    const stepProgress = session.stepProgress || [];
    const stepIndex = stepProgress.findIndex(
      (stepItem) => stepItem.stepId === (step as OnboardingStep),
    );

    if (stepIndex >= 0) {
      stepProgress[stepIndex].status = 'completed';
      stepProgress[stepIndex].completedAt = new Date();
      stepProgress[stepIndex].stepData = stepData;
    }

    return this.update(id, {
      stepProgress,
    });
  }

  async completeOnboarding(id: string): Promise<OnboardingSessionDocument> {
    return this.update(id, {
      status: OnboardingStatus.COMPLETED,
      completedAt: new Date(),
    });
  }

  async update(
    id: string,
    updateDto: Record<string, unknown>,
  ): Promise<OnboardingSessionDocument> {
    const session = await this.onboardingSessionModel
      .findByIdAndUpdate(id, updateDto as Partial<OnboardingSession>, { new: true })
      .exec();
    if (!session) {
      throw new NotFoundException(`Onboarding session with ID ${id} not found`);
    }
    return session;
  }

  async remove(id: string): Promise<OnboardingSessionDocument> {
    const session = await this.onboardingSessionModel.findByIdAndDelete(id).exec();
    if (!session) {
      throw new NotFoundException(`Onboarding session with ID ${id} not found`);
    }
    return session;
  }

  async getStatistics(): Promise<any> {
    const stats = await this.onboardingSessionModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return stats;
  }
}
