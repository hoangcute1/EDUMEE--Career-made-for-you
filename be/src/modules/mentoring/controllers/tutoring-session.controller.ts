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
import { TutoringSessionService } from '../services/tutoring-session.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('tutoring-sessions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('tutoring-sessions')
export class TutoringSessionController {
  constructor(private readonly tutoringSessionService: TutoringSessionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tutoring session' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Session created successfully' })
  create(@Body() createDto: any) {
    return this.tutoringSessionService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tutoring sessions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sessions retrieved successfully' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('menteeId') menteeId?: string,
    @Query('mentorId') mentorId?: string,
    @Query('status') status?: string,
  ) {
    const filters = {
      ...(menteeId ? { menteeId } : {}),
      ...(mentorId ? { mentorId } : {}),
      ...(status ? { status } : {}),
    } as Parameters<TutoringSessionService['findAll']>[2];

    return this.tutoringSessionService.findAll(page, limit, filters);
  }

  @Get('upcoming/:userId')
  @ApiOperation({ summary: 'Get upcoming sessions for a user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Upcoming sessions retrieved successfully' })
  findUpcoming(@Param('userId') userId: string) {
    return this.tutoringSessionService.findUpcoming(userId);
  }

  @Get('mentee/:menteeId')
  @ApiOperation({ summary: 'Get sessions by mentee' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sessions retrieved successfully' })
  findByMentee(@Param('menteeId') menteeId: string) {
    return this.tutoringSessionService.findByMentee(menteeId);
  }

  @Get('mentor/:mentorId')
  @ApiOperation({ summary: 'Get sessions by mentor' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sessions retrieved successfully' })
  findByMentor(@Param('mentorId') mentorId: string) {
    return this.tutoringSessionService.findByMentor(mentorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tutoring session by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Session retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session not found' })
  findOne(@Param('id') id: string) {
    return this.tutoringSessionService.findOne(id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start a tutoring session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Session started successfully' })
  startSession(@Param('id') id: string) {
    return this.tutoringSessionService.startSession(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete a tutoring session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Session completed successfully' })
  completeSession(@Param('id') id: string, @Body() completionData: Record<string, unknown>) {
    return this.tutoringSessionService.completeSession(id, completionData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a tutoring session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Session updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session not found' })
  update(@Param('id') id: string, @Body() updateDto: Record<string, unknown>) {
    return this.tutoringSessionService.update(
      id,
      updateDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tutoring session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Session deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session not found' })
  remove(@Param('id') id: string) {
    return this.tutoringSessionService.remove(id);
  }
}
