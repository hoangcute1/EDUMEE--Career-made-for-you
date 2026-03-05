import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { SessionReview, SessionReviewDocument } from '../schemas/session-review.schema';

@Injectable()
export class SessionReviewService {
  constructor(
    @InjectModel(SessionReview.name)
    private sessionReviewModel: Model<SessionReviewDocument>,
  ) {}

  async create(createDto: any): Promise<SessionReviewDocument> {
    const review = new this.sessionReviewModel(createDto);
    return review.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: FilterQuery<SessionReviewDocument> = {},
  ): Promise<{ data: SessionReviewDocument[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.sessionReviewModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.sessionReviewModel.countDocuments(filters).exec(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<SessionReviewDocument> {
    const review = await this.sessionReviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException(`Session review with ID ${id} not found`);
    }
    return review;
  }

  async findBySession(sessionId: string): Promise<SessionReviewDocument[]> {
    return this.sessionReviewModel.find({ tutoringSessionId: sessionId }).exec();
  }

  async findByReviewer(reviewerId: string): Promise<SessionReviewDocument[]> {
    return this.sessionReviewModel.find({ reviewerId }).sort({ createdAt: -1 }).exec();
  }

  async findByReviewee(revieweeId: string): Promise<SessionReviewDocument[]> {
    return this.sessionReviewModel.find({ reviewedUserId: revieweeId }).sort({ createdAt: -1 }).exec();
  }

  async getAverageRating(revieweeId: string): Promise<number> {
    const result = await this.sessionReviewModel.aggregate<{ averageRating: number }>([
      { $match: { reviewedUserId: revieweeId } },
      { $group: { _id: null, averageRating: { $avg: '$overallRatings.overallSatisfaction' } } },
    ]);

    return result[0]?.averageRating ?? 0;
  }

  async update(id: string, updateDto: Partial<SessionReview>): Promise<SessionReviewDocument> {
    const review = await this.sessionReviewModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!review) {
      throw new NotFoundException(`Session review with ID ${id} not found`);
    }
    return review;
  }

  async remove(id: string): Promise<SessionReviewDocument> {
    const review = await this.sessionReviewModel.findByIdAndDelete(id).exec();
    if (!review) {
      throw new NotFoundException(`Session review with ID ${id} not found`);
    }
    return review;
  }
}
