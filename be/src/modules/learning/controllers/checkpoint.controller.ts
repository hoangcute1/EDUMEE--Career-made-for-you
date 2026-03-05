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
import { CheckpointService } from '../services/checkpoint.service';
import { CreateCheckpointDto, UpdateCheckpointDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('checkpoints')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('checkpoints')
export class CheckpointController {
  constructor(private readonly checkpointService: CheckpointService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new checkpoint' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Checkpoint created successfully' })
  create(@Body() createDto: CreateCheckpointDto) {
    return this.checkpointService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all checkpoints' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checkpoints retrieved successfully' })
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
    } as Parameters<CheckpointService['findAll']>[2];

    return this.checkpointService.findAll(page, limit, filters);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming checkpoints' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checkpoints retrieved successfully' })
  findUpcoming(@Query('userId') userId?: string, @Query('days') days?: number) {
    const validUserId = userId || '';
    return this.checkpointService.findUpcoming(validUserId, days);
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Get overdue checkpoints' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checkpoints retrieved successfully' })
  findOverdue(@Query('userId') userId?: string) {
    return this.checkpointService.findOverdue(userId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get checkpoints by user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checkpoints retrieved successfully' })
  findByUser(@Param('userId') userId: string) {
    return this.checkpointService.findByUser(userId);
  }

  @Get('roadmap/:roadmapId')
  @ApiOperation({ summary: 'Get checkpoints by roadmap' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checkpoints retrieved successfully' })
  findByRoadmap(@Param('roadmapId') roadmapId: string) {
    return this.checkpointService.findByRoadmap(roadmapId);
  }

  @Get('week-plan/:weekPlanId')
  @ApiOperation({ summary: 'Get checkpoints by week plan' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checkpoints retrieved successfully' })
  findByWeekPlan(@Param('weekPlanId') weekPlanId: string) {
    return this.checkpointService.findByWeekPlan(weekPlanId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a checkpoint by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checkpoint retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Checkpoint not found' })
  findOne(@Param('id') id: string) {
    return this.checkpointService.findOne(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete a checkpoint' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checkpoint completed successfully' })
  completeCheckpoint(@Param('id') id: string, @Body() completionData: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.checkpointService.completeCheckpoint(id, completionData);
  }

  @Post(':id/evaluate')
  @ApiOperation({ summary: 'Add evaluation to checkpoint' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Evaluation added successfully' })
  addEvaluation(@Param('id') id: string, @Body() evaluation: any) {
    return this.checkpointService.addEvaluation(id, evaluation);
  }

  @Post(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule a checkpoint' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checkpoint rescheduled successfully' })
  rescheduleCheckpoint(
    @Param('id') id: string,
    @Body() body: { newDate: string; reason?: string },
  ) {
    return this.checkpointService.rescheduleCheckpoint(id, new Date(body.newDate), body.reason);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a checkpoint' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checkpoint updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Checkpoint not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateCheckpointDto) {
    return this.checkpointService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a checkpoint' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checkpoint deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Checkpoint not found' })
  remove(@Param('id') id: string) {
    return this.checkpointService.remove(id);
  }
}
