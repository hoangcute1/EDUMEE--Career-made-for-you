import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WeeklyPlanService } from '../services/weekly-plan.service';
import { CreateWeeklyPlanDto, UpdateWeeklyPlanDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('weekly-plans')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('weekly-plans')
export class WeeklyPlanController {
  constructor(private readonly weeklyPlanService: WeeklyPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new weekly plan' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Plan created successfully' })
  create(@Body() createDto: CreateWeeklyPlanDto) {
    return this.weeklyPlanService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all weekly plans' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Plans retrieved successfully' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
    @Query('roadmapId') roadmapId?: string,
    @Query('status') status?: string,
  ) {
    const filters = {
      ...(userId ? { userId } : {}),
      ...(roadmapId ? { roadmapId } : {}),
      ...(status ? { status } : {}),
    } as Parameters<WeeklyPlanService['findAll']>[2];

    return this.weeklyPlanService.findAll(page, limit, filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get plan statistics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Statistics retrieved successfully' })
  getStatistics(@Query('userId') userId?: string) {
    return this.weeklyPlanService.getPlanStatistics(userId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get plans by user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Plans retrieved successfully' })
  findByUser(@Param('userId') userId: string) {
    return this.weeklyPlanService.findByUser(userId);
  }

  @Get('user/:userId/current')
  @ApiOperation({ summary: 'Get current week plan for user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Current plan retrieved successfully' })
  findCurrentWeek(@Param('userId') userId: string) {
    return this.weeklyPlanService.findCurrentWeek(userId);
  }

  @Get('user/:userId/range')
  @ApiOperation({ summary: 'Get plans by week range' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Plans retrieved successfully' })
  findByWeekRange(
    @Param('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.weeklyPlanService.findByWeekRange(userId, new Date(startDate), new Date(endDate));
  }

  @Get('roadmap/:roadmapId')
  @ApiOperation({ summary: 'Get plans by roadmap' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Plans retrieved successfully' })
  findByRoadmap(@Param('roadmapId') roadmapId: string) {
    return this.weeklyPlanService.findByRoadmap(roadmapId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a weekly plan by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Plan retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Plan not found' })
  findOne(@Param('id') id: string) {
    return this.weeklyPlanService.findOne(id);
  }

  @Get(':id/progress')
  @ApiOperation({ summary: 'Calculate weekly progress' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Progress calculated successfully' })
  calculateProgress(@Param('id') id: string) {
    return this.weeklyPlanService.calculateWeeklyProgress(id);
  }

  @Get(':id/recommendations')
  @ApiOperation({ summary: 'Generate next week recommendations' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Recommendations generated successfully' })
  generateRecommendations(@Param('id') id: string) {
    return this.weeklyPlanService.generateNextWeekRecommendations(id);
  }

  @Post(':id/activities')
  @ApiOperation({ summary: 'Add an activity to the plan' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Activity added successfully' })
  addActivity(@Param('id') id: string, @Body() newActivity: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.weeklyPlanService.addActivity(id, newActivity);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a weekly plan' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Plan updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Plan not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateWeeklyPlanDto) {
    return this.weeklyPlanService.update(id, updateDto);
  }

  @Put(':id/activities/:activityId')
  @ApiOperation({ summary: 'Update a specific activity' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Activity updated successfully' })
  updateActivity(
    @Param('id') id: string,
    @Param('activityId') activityId: string,
    @Body() activityUpdate: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.weeklyPlanService.updateActivity(id, activityId, activityUpdate);
  }

  @Put(':id/activities/:activityId/complete')
  @ApiOperation({ summary: 'Complete an activity' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Activity completed successfully' })
  completeActivity(
    @Param('id') id: string,
    @Param('activityId') activityId: string,
    @Body() body: { actualHours?: number; notes?: string },
  ) {
    return this.weeklyPlanService.completeActivity(id, activityId, body.actualHours, body.notes);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Complete the week' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Week completed successfully' })
  completeWeek(@Param('id') id: string, @Body() userFeedback: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.weeklyPlanService.completeWeek(id, userFeedback);
  }

  @Delete(':id/activities/:activityId')
  @ApiOperation({ summary: 'Remove an activity from the plan' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Activity removed successfully' })
  removeActivity(
    @Param('id') id: string,
    @Param('activityId') activityId: string,
    @Query('reason') reason?: string,
  ) {
    return this.weeklyPlanService.removeActivity(id, activityId, reason);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a weekly plan' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Plan deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Plan not found' })
  remove(@Param('id') id: string) {
    return this.weeklyPlanService.remove(id);
  }
}
