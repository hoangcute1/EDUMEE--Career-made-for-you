import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AssessmentAnswer, AssessmentAnswerDocument } from '../schemas/assessment-answer.schema';
import { CreateAssessmentAnswerDto, UpdateAssessmentAnswerDto } from '../dto';

@Injectable()
export class AssessmentAnswerService {
  constructor(
    @InjectModel(AssessmentAnswer.name)
    private readonly assessmentAnswerModel: Model<AssessmentAnswerDocument>,
  ) {}

  async create(createDto: CreateAssessmentAnswerDto): Promise<AssessmentAnswer> {
    try {
      const answer = new this.assessmentAnswerModel({
        ...createDto,
        questionId: new Types.ObjectId(createDto.questionId),
        userId: new Types.ObjectId(createDto.userId),
      });
      return answer.save();
    } catch (error) {
      if (error instanceof Error && 'code' in error && (error as { code: number }).code === 11000) {
        throw new ConflictException('User đã trả lời câu hỏi này rồi');
      }
      throw error;
    }
  }

  // Trả lời câu hỏi (tạo mới hoặc cập nhật nếu đã trả lời)
  async answerQuestion(createDto: CreateAssessmentAnswerDto): Promise<AssessmentAnswer> {
    const existingAnswer = await this.assessmentAnswerModel
      .findOne({
        questionId: new Types.ObjectId(createDto.questionId),
        userId: new Types.ObjectId(createDto.userId),
      })
      .exec();

    if (existingAnswer) {
      // Cập nhật câu trả lời cũ
      return this.assessmentAnswerModel
        .findByIdAndUpdate(
          existingAnswer._id,
          {
            answer: createDto.answer,
            responseTime: createDto.responseTime,
            answeredAt: new Date(),
            metadata: createDto.metadata,
          },
          { new: true, runValidators: true }
        )
        .exec() as Promise<AssessmentAnswer>;
    } else {
      // Tạo câu trả lời mới
      const answer = new this.assessmentAnswerModel({
        ...createDto,
        questionId: new Types.ObjectId(createDto.questionId),
        userId: new Types.ObjectId(createDto.userId),
      });
      return answer.save();
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: Partial<AssessmentAnswer> = {},
  ): Promise<{ data: AssessmentAnswer[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    
    const query = this.buildQuery(filters);
    
    const [data, total] = await Promise.all([
      this.assessmentAnswerModel
        .find(query)
        .populate('questionId', 'questionText dimension orderIndex')
        .populate('userId', 'email firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.assessmentAnswerModel.countDocuments(query),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<AssessmentAnswer> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid answer ID');
    }

    const answer = await this.assessmentAnswerModel
      .findById(id)
      .populate('questionId', 'questionText dimension')
      .populate('userId', 'email firstName lastName')
      .exec();

    if (!answer) {
      throw new NotFoundException('Assessment answer not found');
    }

    return answer;
  }



  async findByUser(userId: string): Promise<AssessmentAnswer[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const query: Record<string, any> = { userId: new Types.ObjectId(userId) };

    return this.assessmentAnswerModel
      .find(query)
      .populate('questionId', 'questionText dimension orderIndex')
      .sort({ 'questionId.orderIndex': 1, createdAt: 1 })
      .exec();
  }

  async findByQuestion(questionId: string): Promise<AssessmentAnswer[]> {
    if (!Types.ObjectId.isValid(questionId)) {
      throw new BadRequestException('Invalid question ID');
    }

    return this.assessmentAnswerModel
      .find({ questionId: new Types.ObjectId(questionId) })
      .populate('userId', 'email firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateDto: UpdateAssessmentAnswerDto): Promise<AssessmentAnswer> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid answer ID');
    }

    const answer = await this.assessmentAnswerModel
      .findByIdAndUpdate(id, updateDto, { new: true, runValidators: true })
      .populate('questionId', 'questionText dimension')
      .populate('userId', 'email firstName lastName')
      .exec();

    if (!answer) {
      throw new NotFoundException('Assessment answer not found');
    }

    return answer;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid answer ID');
    }

    const result = await this.assessmentAnswerModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException('Assessment answer not found');
    }
  }



  async bulkCreate(answers: CreateAssessmentAnswerDto[]): Promise<AssessmentAnswer[]> {
    const answersWithObjectIds = answers.map(answer => ({
      ...answer,
      questionId: new Types.ObjectId(answer.questionId),
      userId: new Types.ObjectId(answer.userId),
    }));

    return this.assessmentAnswerModel.insertMany(answersWithObjectIds);
  }

  // Thống kê đơn giản cho user
  async getUserAnswerStats(userId: string): Promise<{
    totalAnswered: number;
    answersByDimension: Record<string, number>;
    responseTimeStats?: {
      average: number;
      min: number;
      max: number;
    };
  }> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const answers = await this.assessmentAnswerModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('questionId', 'dimension')
      .exec();

    const answersByDimension: Record<string, number> = {};
    const responseTimes: number[] = [];

    answers.forEach(answer => {
      const questionId = answer.questionId as { dimension?: string } | undefined;
      const dimension = questionId?.dimension;
      if (dimension && typeof dimension === 'string') {
        answersByDimension[dimension] = (answersByDimension[dimension] || 0) + 1;
      }
      if (answer.responseTime) {
        responseTimes.push(answer.responseTime);
      }
    });

    let responseTimeStats;
    if (responseTimes.length > 0) {
      responseTimeStats = {
        average: responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length,
        min: Math.min(...responseTimes),
        max: Math.max(...responseTimes),
      };
    }

    return {
      totalAnswered: answers.length,
      answersByDimension,
      responseTimeStats,
    };
  }


  private buildQuery(filters: Partial<AssessmentAnswer>): Record<string, any> {
    const query: Record<string, any> = {};

    if (filters.questionId) {
      const questionId = typeof filters.questionId === 'string' ? filters.questionId : String(filters.questionId);
      query.questionId = new Types.ObjectId(questionId);
    }

    if (filters.userId) {
      const userId = typeof filters.userId === 'string' ? filters.userId : String(filters.userId);
      query.userId = new Types.ObjectId(userId);
    }

    return query;
  }
}