import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import {
  TutoringSession,
  TutoringSessionDocument,
  SessionStatus,
} from '../schemas/tutoring-session.schema';

@Injectable()
export class TutoringSessionService {
  constructor(
    @InjectModel(TutoringSession.name)
    private tutoringSessionModel: Model<TutoringSessionDocument>,
  ) {}

  async create(createDto: any): Promise<TutoringSessionDocument> {
    const session = new this.tutoringSessionModel(createDto);
    return session.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: FilterQuery<TutoringSessionDocument> = {},
  ): Promise<{ data: TutoringSessionDocument[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.tutoringSessionModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.tutoringSessionModel.countDocuments(filters).exec(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<TutoringSessionDocument> {
    const session = await this.tutoringSessionModel.findById(id).exec();
    if (!session) {
      throw new NotFoundException(`Tutoring session with ID ${id} not found`);
    }
    return session;
  }

  async findByMentee(menteeId: string): Promise<TutoringSessionDocument[]> {
    return this.tutoringSessionModel.find({ menteeId }).sort({ createdAt: -1 }).exec();
  }

  async findByMentor(mentorId: string): Promise<TutoringSessionDocument[]> {
    return this.tutoringSessionModel.find({ mentorId }).sort({ createdAt: -1 }).exec();
  }

  async findUpcoming(userId: string): Promise<TutoringSessionDocument[]> {
    const now = new Date();
    return this.tutoringSessionModel
      .find({
        $or: [{ menteeId: userId }, { mentorId: userId }],
        'sessionDetails.scheduledStartTime': { $gte: now },
        status: 'scheduled',
      })
      .sort({ 'sessionDetails.scheduledStartTime': 1 })
      .exec();
  }

  async startSession(id: string): Promise<TutoringSessionDocument> {
    return this.update(id, {
      status: SessionStatus.IN_PROGRESS,
      'sessionDetails.actualStartTime': new Date(),
    });
  }

  async completeSession(
    id: string,
    completionData: Record<string, unknown>,
  ): Promise<TutoringSessionDocument> {
    return this.update(id, {
      status: SessionStatus.COMPLETED,
      'sessionDetails.actualEndTime': new Date(),
      ...completionData,
    });
  }

  async update(
    id: string,
    updateDto: Record<string, unknown>,
  ): Promise<TutoringSessionDocument> {
    const session = await this.tutoringSessionModel
      .findByIdAndUpdate(id, updateDto as Partial<TutoringSession>, { new: true })
      .exec();
    if (!session) {
      throw new NotFoundException(`Tutoring session with ID ${id} not found`);
    }
    return session;
  }

  async remove(id: string): Promise<TutoringSessionDocument> {
    const session = await this.tutoringSessionModel.findByIdAndDelete(id).exec();
    if (!session) {
      throw new NotFoundException(`Tutoring session with ID ${id} not found`);
    }
    return session;
  }
}
