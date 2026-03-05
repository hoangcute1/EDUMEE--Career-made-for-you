import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SimulationTask,
  SimulationTaskDocument,
  TaskType,
  DifficultyLevel,
} from '../schemas/simulation-task.schema';
import { CreateSimulationTaskDto, UpdateSimulationTaskDto } from '../dto';

@Injectable()
export class SimulationTaskService {
  constructor(
    @InjectModel(SimulationTask.name)
    private readonly simulationTaskModel: Model<SimulationTaskDocument>,
  ) {}

  async create(createDto: CreateSimulationTaskDto): Promise<SimulationTask> {
    const task = new this.simulationTaskModel({
      ...createDto,
      careerId: new Types.ObjectId(createDto.careerId),
      recommendedBeforeTasks: createDto.recommendedBeforeTasks?.map(
        id => new Types.ObjectId(id)
      ),
      followUpTasks: createDto.followUpTasks?.map(id => new Types.ObjectId(id)),
    });
    
    return task.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: Partial<SimulationTask> = {},
  ): Promise<{
    data: SimulationTask[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const query = this.buildQuery(filters);
    
    const [data, total] = await Promise.all([
      this.simulationTaskModel
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .find(query)
        .populate('careerId', 'title category industry')
        .populate('recommendedBeforeTasks', 'title difficulty')
        .populate('followUpTasks', 'title difficulty')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.simulationTaskModel.countDocuments(query),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<SimulationTask> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid task ID');
    }

    const task = await this.simulationTaskModel
      .findById(id)
      .populate('careerId', 'title category industry description')
      .populate('recommendedBeforeTasks', 'title difficulty taskType')
      .populate('followUpTasks', 'title difficulty taskType')
      .exec();

    if (!task) {
      throw new NotFoundException('Simulation task not found');
    }

    return task;
  }

  async findByCareer(careerId: string): Promise<SimulationTask[]> {
    if (!Types.ObjectId.isValid(careerId)) {
      throw new BadRequestException('Invalid career ID');
    }

    return this.simulationTaskModel
      .find({ careerId: new Types.ObjectId(careerId), isActive: true })
      .sort({ difficulty: 1, createdAt: 1 })
      .exec();
  }

  async findByType(taskType: TaskType): Promise<SimulationTask[]> {
    return this.simulationTaskModel
      .find({ taskType, isActive: true })
      .populate('careerId', 'title category')
      .sort({ difficulty: 1 })
      .exec();
  }

  async findByDifficulty(difficulty: DifficultyLevel): Promise<SimulationTask[]> {
    return this.simulationTaskModel
      .find({ difficulty, isActive: true })
      .populate('careerId', 'title category')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findBySkill(skillName: string): Promise<SimulationTask[]> {
    return this.simulationTaskModel
      .find({
        'skillsEvaluated.skillName': { $regex: skillName, $options: 'i' },
        isActive: true,
      })
      .populate('careerId', 'title category')
      .sort({ 'skillsEvaluated.weight': -1 })
      .exec();
  }

  async searchTasks(criteria: any): Promise<SimulationTask[]> {
    const query: any = { isActive: true };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (criteria.skills && criteria.skills.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      query['skillsEvaluated.skillName'] = { $in: criteria.skills };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (criteria.keyword) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      query.$text = { $search: criteria.keyword };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (criteria.difficulty) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      query.difficulty = criteria.difficulty;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (criteria.taskType) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      query.taskType = criteria.taskType;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (criteria.careerId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      query.careerId = new Types.ObjectId(criteria.careerId as string);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (criteria.timeRange) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      query['timeEstimation.averageHours'] = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        $gte: criteria.timeRange.min || 0,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        $lte: criteria.timeRange.max || 1000,
      };
    }

    return this.simulationTaskModel
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .find(query)
      .populate('careerId', 'title category')
      .sort({ 'stats.averageScore': -1 })
      .exec();
  }

  async getRecommendedTasks(
    _userId: string,
    currentSkills: string[],
    targetLevel: string,
    limit = 5,
  ): Promise<SimulationTask[]> {
    // Find tasks that match user's current skill level and target progression
    const tasks = await this.simulationTaskModel
      .find({
        'skillsEvaluated.skillName': { $in: currentSkills },
        targetLevel,
        isActive: true,
      })
      .populate('careerId', 'title category')
      .sort({ 'stats.averageScore': -1, difficulty: 1 })
      .limit(limit)
      .exec();

    // If not enough tasks found, find related tasks
    if (tasks.length < limit) {
      const additionalTasks = await this.simulationTaskModel
        .find({
          _id: { $nin: tasks.map(t => t._id) },
          targetLevel,
          isActive: true,
        })
        .populate('careerId', 'title category')
        .sort({ 'stats.completionRate': -1 })
        .limit(limit - tasks.length)
        .exec();

      return [...tasks, ...additionalTasks];
    }

    return tasks;
  }

  async getTasksByLearningPath(
    careerId: string,
    targetLevel: string,
  ): Promise<SimulationTask[]> {
    if (!Types.ObjectId.isValid(careerId)) {
      throw new BadRequestException('Invalid career ID');
    }

    return this.simulationTaskModel
      .find({
        careerId: new Types.ObjectId(careerId),
        targetLevel,
        isActive: true,
      })
      .sort({ difficulty: 1, 'timeEstimation.averageHours': 1 })
      .exec();
  }

  async updateTaskStatistics(
    taskId: string,
    submissionResult: any,
  ): Promise<SimulationTask> {
    if (!Types.ObjectId.isValid(taskId)) {
      throw new BadRequestException('Invalid task ID');
    }

    const task = await this.simulationTaskModel.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Update statistics based on submission
    const currentStats = task.stats || {
      totalAttempts: 0,
      averageScore: 0,
      completionRate: 0,
      averageTimeSpent: 0,
    };

    currentStats.totalAttempts = (currentStats.totalAttempts || 0) + 1;
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (submissionResult.completed) {
      const newCompletionRate = 
        (((currentStats.completionRate || 0) * ((currentStats.totalAttempts || 1) - 1)) + 1) / 
        (currentStats.totalAttempts || 1);
      currentStats.completionRate = Math.round(newCompletionRate * 100) / 100;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (submissionResult.score !== undefined) {
      const newAverageScore = 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (((currentStats.averageScore || 0) * ((currentStats.totalAttempts || 1) - 1)) + submissionResult.score) / 
        (currentStats.totalAttempts || 1);
      currentStats.averageScore = Math.round(newAverageScore * 100) / 100;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (submissionResult.timeSpent) {
      const newAverageTime = 
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (((currentStats.averageTimeSpent || 0) * ((currentStats.totalAttempts || 1) - 1)) + submissionResult.timeSpent) / 
        (currentStats.totalAttempts || 1);
      currentStats.averageTimeSpent = Math.round(newAverageTime);
    }

    currentStats.lastUpdated = new Date();

    return this.simulationTaskModel
      .findByIdAndUpdate(
        taskId,
        { stats: currentStats },
        { new: true }
      )
      .exec() as Promise<SimulationTask>;
  }

  async getTaskAnalytics(taskId?: string): Promise<any> {
    const matchStage: any = { isActive: true };
    if (taskId) {
      if (!Types.ObjectId.isValid(taskId)) {
        throw new BadRequestException('Invalid task ID');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      matchStage._id = new Types.ObjectId(taskId);
    }

    const analytics = await this.simulationTaskModel.aggregate([
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      { $match: matchStage },
      {
        $group: {
          _id: taskId ? '$_id' : null,
          totalTasks: { $sum: 1 },
          avgCompletionRate: { $avg: '$stats.completionRate' },
          avgScore: { $avg: '$stats.averageScore' },
          totalAttempts: { $sum: '$stats.totalAttempts' },
          tasksByDifficulty: {
            $push: {
              difficulty: '$difficulty',
              completionRate: '$stats.completionRate',
              averageScore: '$stats.averageScore',
            }
          },
          tasksByType: {
            $push: {
              type: '$taskType',
              count: 1,
            }
          }
        }
      }
    ]);

    return analytics[0] || {
      totalTasks: 0,
      avgCompletionRate: 0,
      avgScore: 0,
      totalAttempts: 0,
      tasksByDifficulty: [],
      tasksByType: [],
    };
  }

  async duplicateTask(taskId: string, modifications?: Partial<CreateSimulationTaskDto>): Promise<SimulationTask> {
    const originalTask = await this.findOne(taskId);
    
    const duplicatedTask = new this.simulationTaskModel({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...(originalTask as any).toObject(),
      _id: undefined,
      title: `${originalTask.title} (Copy)`,
      stats: undefined, // Reset statistics
      ...modifications,
    });

    return duplicatedTask.save();
  }

  async update(id: string, updateDto: UpdateSimulationTaskDto): Promise<SimulationTask> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid task ID');
    }

    if (updateDto.careerId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      updateDto.careerId = new Types.ObjectId(updateDto.careerId) as any;
    }
    if (updateDto.recommendedBeforeTasks) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      updateDto.recommendedBeforeTasks = updateDto.recommendedBeforeTasks.map(
        id => new Types.ObjectId(id)
      ) as any;
    }
    if (updateDto.followUpTasks) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      updateDto.followUpTasks = updateDto.followUpTasks.map(
        id => new Types.ObjectId(id)
      ) as any;
    }

    const task = await this.simulationTaskModel
      .findByIdAndUpdate(id, updateDto, { new: true, runValidators: true })
      .populate('careerId', 'title category industry')
      .exec();

    if (!task) {
      throw new NotFoundException('Simulation task not found');
    }

    return task;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid task ID');
    }

    // Soft delete by setting isActive to false
    const result = await this.simulationTaskModel
      .findByIdAndUpdate(id, { isActive: false })
      .exec();
    
    if (!result) {
      throw new NotFoundException('Simulation task not found');
    }
  }

  async hardDelete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid task ID');
    }

    const result = await this.simulationTaskModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException('Simulation task not found');
    }
  }

  private buildQuery(filters: Partial<SimulationTask>): any {
    const query: any = { isActive: true };

    if (filters.careerId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      query.careerId = new Types.ObjectId(String(filters.careerId));
    }

    if (filters.taskType) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      query.taskType = filters.taskType;
    }

    if (filters.difficulty) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      query.difficulty = filters.difficulty;
    }

    if (filters.targetLevel) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      query.targetLevel = filters.targetLevel;
    }

    if (filters.tags) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      query.tags = { $in: filters.tags };
    }

    return query;
  }
}