import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { CareerReview, CareerReviewDocument, ReviewStatus } from '../schemas/career-review.schema';

@Injectable()
export class CareerReviewService {
  constructor(
    @InjectModel(CareerReview.name)
    private careerReviewModel: Model<CareerReviewDocument>,
  ) {}

  async create(createDto: any): Promise<CareerReviewDocument> {
    const review = new this.careerReviewModel(createDto);
    return review.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: FilterQuery<CareerReviewDocument> = {},
  ): Promise<{ data: CareerReviewDocument[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.careerReviewModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.careerReviewModel.countDocuments(filters).exec(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<CareerReviewDocument> {
    const review = await this.careerReviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException(`Career review with ID ${id} not found`);
    }
    return review;
  }

  async findByUser(userId: string): Promise<CareerReviewDocument[]> {
    return this.careerReviewModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findByCareer(careerId: string, published = true): Promise<CareerReviewDocument[]> {
    const filter = {
      careerId,
      ...(published ? { status: 'published' } : {}),
    } as FilterQuery<CareerReviewDocument>;
    return this.careerReviewModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findByCategory(category: string): Promise<CareerReviewDocument[]> {
    return this.careerReviewModel.find({ category }).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, updateDto: Partial<CareerReview>): Promise<CareerReviewDocument> {
    const review = await this.careerReviewModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!review) {
      throw new NotFoundException(`Career review with ID ${id} not found`);
    }
    return review;
  }

  async updateStatus(id: string, status: string): Promise<CareerReviewDocument> {
    return this.update(id, { status: status as ReviewStatus });
  }

  async remove(id: string): Promise<CareerReviewDocument> {
    const review = await this.careerReviewModel.findByIdAndDelete(id).exec();
    if (!review) {
      throw new NotFoundException(`Career review with ID ${id} not found`);
    }
    return review;
  }

  async getStatistics(careerId?: string): Promise<any> {
    const matchStage: Record<string, string> = {};
    if (careerId) {
      matchStage.careerId = careerId;
    }

    const stats = await this.careerReviewModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$careerId',
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$overallRating' },
          categoryBreakdown: { $push: '$category' },
        },
      },
    ]);

    return stats;
  }
}
