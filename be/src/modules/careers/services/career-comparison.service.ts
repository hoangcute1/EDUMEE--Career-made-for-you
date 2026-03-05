import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CareerComparison, CareerComparisonDocument } from '../schemas/career-comparison.schema';
import { CreateCareerComparisonDto, UpdateCareerComparisonDto } from '../dto';
import { CareerService } from './career.service';

interface CareerData {
  _id: Types.ObjectId;
  title: string;
  category: string;
  industry?: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  careerPath?: Record<string, unknown>;
  [key: string]: unknown;
}

interface ComparisonQuery {
  userId?: Types.ObjectId;
}

@Injectable()
export class CareerComparisonService {
  constructor(
    @InjectModel(CareerComparison.name)
    private readonly careerComparisonModel: Model<CareerComparisonDocument>,
    private readonly careerService: CareerService,
  ) {}

  async create(createDto: CreateCareerComparisonDto): Promise<CareerComparison> {
    // Validate career IDs
    const careerObjectIds = await this.validateCareerIds(createDto.careerIds);
    
    const comparison = new this.careerComparisonModel({
      ...createDto,
      userId: new Types.ObjectId(createDto.userId),
      careerIds: careerObjectIds,
    });
    
    return comparison.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: Partial<CareerComparison> = {},
  ): Promise<{ data: CareerComparison[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    
    const query: ComparisonQuery = this.buildQuery(filters);
    
    const [data, total] = await Promise.all([
      this.careerComparisonModel
        .find(query)
        .populate('userId', 'email firstName lastName')
        .populate('careerIds', 'title category industry')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.careerComparisonModel.countDocuments(query),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<CareerComparison> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid comparison ID');
    }

    const comparison = await this.careerComparisonModel
      .findById(id)
      .populate('userId', 'email firstName lastName')
      .populate('careerIds', 'title category industry description requiredSkills')
      .exec();

    if (!comparison) {
      throw new NotFoundException('Career comparison not found');
    }

    return comparison;
  }

  async findByUser(userId: string): Promise<CareerComparison[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.careerComparisonModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('careerIds', 'title category industry')
      .sort({ createdAt: -1 })
      .exec();
  }

  async compareCareersSideBySide(careerIds: string[]): Promise<any> {
    const careerObjectIds = await this.validateCareerIds(careerIds);
    
    const careers = await Promise.all(
      careerObjectIds.map(id => this.careerService.findOne(id.toString()))
    );

    return {
      careers,
      comparison: this.generateSideBySideComparison(careers as unknown as CareerData[]),
      summary: this.generateComparisonSummary(careers as unknown as CareerData[]),
    };
  }

  async generateDetailedComparison(
    userId: string, 
    careerIds: string[],
    criteria?: Record<string, unknown>
  ): Promise<any> {
    const careerObjectIds = await this.validateCareerIds(careerIds);
    
    const careers = await Promise.all(
      careerObjectIds.map(id => this.careerService.findOne(id.toString()))
    );

    const comparison = {
      userId,
      careerIds,
      careers,
      detailedAnalysis: this.performDetailedAnalysis(careers as unknown as CareerData[]),
      recommendations: this.generateRecommendations(careers as unknown as CareerData[]),
      scoreBreakdown: this.calculateScoreBreakdown(careers as unknown as CareerData[]),
    };

    // Save the comparison for future reference
    const savedComparison = await this.create({
      userId,
      careerIds,
      comparisonName: 'Detailed Career Analysis',
      purpose: 'detailed_comparison',
      comparisonCriteria: criteria,
      results: comparison,
      insights: comparison.recommendations,
    });

    return {
      ...comparison,
      comparisonId: savedComparison._id,
    };
  }

  async update(id: string, updateDto: UpdateCareerComparisonDto): Promise<CareerComparison> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid comparison ID');
    }

    if (updateDto.careerIds) {
      updateDto.careerIds = (await this.validateCareerIds(updateDto.careerIds)).map(id => id.toString());
    }

    const comparison = await this.careerComparisonModel
      .findByIdAndUpdate(id, updateDto, { new: true, runValidators: true })
      .populate('userId', 'email firstName lastName')
      .populate('careerIds', 'title category industry')
      .exec();

    if (!comparison) {
      throw new NotFoundException('Career comparison not found');
    }

    return comparison;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid comparison ID');
    }

    const result = await this.careerComparisonModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException('Career comparison not found');
    }
  }

  async getComparisonStatistics(): Promise<any> {
    const stats = await this.careerComparisonModel.aggregate([
      {
        $group: {
          _id: null,
          totalComparisons: { $sum: 1 },
          avgCareersPerComparison: { $avg: { $size: '$careerIds' } },
          mostComparedCareers: { $push: '$careerIds' },
        },
      },
    ]);

    return stats[0] || {
      totalComparisons: 0,
      avgCareersPerComparison: 0,
      mostComparedCareers: [],
    };
  }

  private async validateCareerIds(careerIds: string[]): Promise<Types.ObjectId[]> {
    const objectIds: Types.ObjectId[] = [];
    
    for (const careerId of careerIds) {
      if (!Types.ObjectId.isValid(careerId)) {
        throw new BadRequestException(`Invalid career ID: ${careerId}`);
      }
      
      // Verify career exists
      await this.careerService.findOne(careerId);
      objectIds.push(new Types.ObjectId(careerId));
    }
    
    return objectIds;
  }

  private generateSideBySideComparison(careers: CareerData[]): Record<string, unknown> {
    const comparisonFields = [
      'title',
      'category',
      'industry',
      'requiredSkills',
      'salaryInformation',
      'educationRequirements',
      'workEnvironment',
    ];

    const comparison: Record<string, unknown> = {};
    
    comparisonFields.forEach(field => {
      comparison[field] = careers.map(career => ({
        careerId: career._id,
        careerTitle: career.title,
        value: career[field],
      }));
    });

    return comparison;
  }

  private generateComparisonSummary(careers: CareerData[]): Record<string, unknown> {
    return {
      totalCareers: careers.length,
      categories: [...new Set(careers.map(c => c.category))],
      industries: [...new Set(careers.map(c => c.industry))],
      commonSkills: this.findCommonSkills(careers),
      uniqueAspects: this.findUniqueAspects(careers),
    };
  }

  private performDetailedAnalysis(careers: CareerData[]): Record<string, unknown> {
    return {
      skillsAlignment: this.analyzeSkillsAlignment(careers),
      careerProgression: this.analyzeCareerProgression(careers),
      marketDemand: this.analyzeMarketDemand(careers),
      compatibility: this.analyzeCompatibility(),
    };
  }

  private generateRecommendations(careers: CareerData[]): Record<string, unknown> {
    return {
      bestMatch: careers[0]?._id,
      reasonsForRecommendation: ['High skill alignment', 'Strong market demand'],
      alternativeOptions: careers.slice(1, 3).map(c => c._id),
      developmentSuggestions: ['Focus on technical skills', 'Consider additional certifications'],
    };
  }

  private calculateScoreBreakdown(careers: CareerData[]): Record<string, unknown>[] {
    return careers.map(career => ({
      careerId: career._id,
      careerTitle: career.title,
      overallScore: 85,
      criteriaScores: {
        skillMatch: 90,
        salaryPotential: 80,
        workLifeBalance: 85,
        growthPotential: 88,
      },
    }));
  }

  private findCommonSkills(careers: CareerData[]): string[] {
    const allSkills = careers.flatMap(career => [
      ...(career.requiredSkills || []),
      ...(career.preferredSkills || []),
    ]);
    
    const skillCounts = allSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(skillCounts)
      .filter(([, count]) => count > 1)
      .map(([skill]) => skill);
  }

  private findUniqueAspects(careers: CareerData[]): Record<string, unknown>[] {
    return careers.map(career => ({
      careerId: career._id,
      uniqueSkills: career.requiredSkills?.filter((skill: string) =>
        !this.isCommonSkillAcrossCareers(skill, careers)
      ) || [],
      uniqueFeatures: this.extractUniqueFeatures(),
    }));
  }

  private isCommonSkillAcrossCareers(skill: string, careers: CareerData[]): boolean {
    return careers.filter(career =>
      career.requiredSkills?.includes(skill) || career.preferredSkills?.includes(skill)
    ).length > 1;
  }

  private extractUniqueFeatures(): string[] {
    return ['Remote work options', 'Creative freedom'];
  }

  private analyzeSkillsAlignment(careers: CareerData[]): Record<string, unknown> {
    return {
      overlapPercentage: 75,
      transferableSkills: ['Communication', 'Problem solving'],
      gapAnalysis: careers.map(c => ({
        careerId: c._id,
        missingSkills: ['Leadership', 'Project management'],
      })),
    };
  }

  private analyzeCareerProgression(careers: CareerData[]): Record<string, unknown>[] {
    return careers.map(career => ({
      careerId: career._id,
      progressionPath: career.careerPath || {},
      timeToAdvancement: '2-3 years',
      seniorityLevels: ['Junior', 'Mid-level', 'Senior', 'Lead'],
    }));
  }

  private analyzeMarketDemand(careers: CareerData[]): Record<string, unknown>[] {
    return careers.map(career => ({
      careerId: career._id,
      demandLevel: 'High',
      jobGrowthRate: '15%',
      competitionLevel: 'Moderate',
    }));
  }

  private analyzeCompatibility(): Record<string, string> {
    return {
      personalityFit: 'High',
      skillsCompatibility: 'Moderate',
      lifestyleAlignment: 'High',
      longTermViability: 'Strong',
    };
  }

  private buildQuery(filters: Partial<CareerComparison>): ComparisonQuery {
    const query: ComparisonQuery = {};

    if (filters.userId) {
      query.userId = new Types.ObjectId(filters.userId as unknown as string);
    }

    return query;
  }
}