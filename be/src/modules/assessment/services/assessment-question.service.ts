import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AssessmentQuestion, AssessmentQuestionDocument, QuestionType, AssessmentDimension } from '../schemas/assessment-question.schema';
import { CreateAssessmentQuestionDto, UpdateAssessmentQuestionDto } from '../dto';

@Injectable()
export class AssessmentQuestionService {
  constructor(
    @InjectModel(AssessmentQuestion.name)
    private readonly assessmentQuestionModel: Model<AssessmentQuestionDocument>,
  ) {}

  async create(createDto: CreateAssessmentQuestionDto): Promise<AssessmentQuestion> {
    const question = new this.assessmentQuestionModel({
      ...createDto,
    });
    return question.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: Partial<AssessmentQuestion> = {},
  ): Promise<{ questions: AssessmentQuestion[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [questions, total] = await Promise.all([
      this.assessmentQuestionModel
        .find(filters)
        .sort({ orderIndex: 1, createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.assessmentQuestionModel.countDocuments(filters),
    ]);

    return { questions, total };
  }

  async findById(id: string): Promise<AssessmentQuestion> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid question ID');
    }

    const question = await this.assessmentQuestionModel.findById(id).exec();
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async findByType(type: QuestionType): Promise<AssessmentQuestion[]> {
    return this.assessmentQuestionModel
      .find({ questionType: type })
      .sort({ orderIndex: 1 })
      .exec();
  }

  async findByDimension(dimension: AssessmentDimension): Promise<AssessmentQuestion[]> {
    return this.assessmentQuestionModel
      .find({ dimension })
      .sort({ orderIndex: 1 })
      .exec();
  }

  async update(id: string, updateDto: UpdateAssessmentQuestionDto): Promise<AssessmentQuestion> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid question ID');
    }

    const question = await this.assessmentQuestionModel
      .findByIdAndUpdate(id, { $set: updateDto }, { new: true, runValidators: true })
      .exec();

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid question ID');
    }

    const result = await this.assessmentQuestionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Question not found');
    }
  }

  async bulkCreate(questions: CreateAssessmentQuestionDto[]): Promise<AssessmentQuestion[]> {
    const questionsWithOrder = questions.map((q, index) => ({
      ...q,
      orderIndex: q.orderIndex || index + 1,
    }));

    return this.assessmentQuestionModel.insertMany(questionsWithOrder) as any as Promise<AssessmentQuestion[]>;
  }

  async getStats(): Promise<{
    totalQuestions: number;
    typeDistribution: Record<string, number>;
    dimensionDistribution: Record<string, number>;
  }> {
    const [total, typeStats, dimensionStats] = await Promise.all([
      this.assessmentQuestionModel.countDocuments(),
      this.assessmentQuestionModel.aggregate([
        { $group: { _id: '$questionType', count: { $sum: 1 } } }
      ]).exec() as Promise<{ _id: string; count: number }[]>,
      this.assessmentQuestionModel.aggregate([
        { $group: { _id: '$dimension', count: { $sum: 1 } } }
      ]).exec() as Promise<{ _id: string; count: number }[]>
    ]);

    const typeDistribution: Record<string, number> = typeStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const dimensionDistribution: Record<string, number> = dimensionStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalQuestions: total,
      typeDistribution,
      dimensionDistribution,
    };
  }
}