import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { ReviewVote, ReviewVoteDocument, VoteType } from '../schemas/review-interactions.schema';

@Injectable()
export class ReviewInteractionsService {
  constructor(
    @InjectModel(ReviewVote.name)
    private reviewVoteModel: Model<ReviewVoteDocument>,
  ) {}

  async create(createDto: any): Promise<ReviewVoteDocument> {
    const vote = new this.reviewVoteModel(createDto);
    return vote.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: FilterQuery<ReviewVoteDocument> = {},
  ): Promise<{ data: ReviewVoteDocument[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.reviewVoteModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.reviewVoteModel.countDocuments(filters).exec(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<ReviewVoteDocument> {
    const vote = await this.reviewVoteModel.findById(id).exec();
    if (!vote) {
      throw new NotFoundException(`Vote with ID ${id} not found`);
    }
    return vote;
  }

  async findByReview(reviewId: string): Promise<ReviewVoteDocument[]> {
    return this.reviewVoteModel.find({ reviewId }).sort({ createdAt: -1 }).exec();
  }

  async findByVoter(voterId: string): Promise<ReviewVoteDocument[]> {
    return this.reviewVoteModel.find({ voterId }).sort({ createdAt: -1 }).exec();
  }

  async upsertVote(reviewId: string, voterId: string, voteType: string): Promise<ReviewVoteDocument> {
    const existingVote = await this.reviewVoteModel.findOne({ reviewId, voterId }).exec();
    
    if (existingVote) {
      existingVote.voteType = voteType as VoteType;
      return existingVote.save();
    }
    
    return this.create({ reviewId, voterId, voteType });
  }

  async removeVote(reviewId: string, voterId: string): Promise<ReviewVoteDocument | null> {
    return this.reviewVoteModel.findOneAndDelete({ reviewId, voterId }).exec();
  }

  async getVoteStatistics(reviewId: string): Promise<any> {
    const stats = await this.reviewVoteModel.aggregate([
      { $match: { reviewId } },
      {
        $group: {
          _id: '$voteType',
          count: { $sum: 1 },
        },
      },
    ]);

    return stats;
  }

  async remove(id: string): Promise<ReviewVoteDocument> {
    const vote = await this.reviewVoteModel.findByIdAndDelete(id).exec();
    if (!vote) {
      throw new NotFoundException(`Vote with ID ${id} not found`);
    }
    return vote;
  }
}
