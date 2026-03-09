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
import { SessionReviewService } from '../services/session-review.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('session-reviews')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('session-reviews')
export class SessionReviewController {
  constructor(private readonly sessionReviewService: SessionReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session review' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Review created successfully' })
  create(@Body() createDto: any) {
    return this.sessionReviewService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all session reviews' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reviews retrieved successfully' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('tutoringSessionId') tutoringSessionId?: string,
    @Query('reviewerId') reviewerId?: string,
    @Query('revieweeId') revieweeId?: string,
  ) {
    const filters = {
      ...(tutoringSessionId ? { tutoringSessionId } : {}),
      ...(reviewerId ? { reviewerId } : {}),
      ...(revieweeId ? { revieweeId } : {}),
    } as Parameters<SessionReviewService['findAll']>[2];

    return this.sessionReviewService.findAll(page, limit, filters);
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Get reviews by session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reviews retrieved successfully' })
  findBySession(@Param('sessionId') sessionId: string) {
    return this.sessionReviewService.findBySession(sessionId);
  }

  @Get('reviewer/:reviewerId')
  @ApiOperation({ summary: 'Get reviews by reviewer' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reviews retrieved successfully' })
  findByReviewer(@Param('reviewerId') reviewerId: string) {
    return this.sessionReviewService.findByReviewer(reviewerId);
  }

  @Get('reviewee/:revieweeId')
  @ApiOperation({ summary: 'Get reviews by reviewee' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reviews retrieved successfully' })
  findByReviewee(@Param('revieweeId') revieweeId: string) {
    return this.sessionReviewService.findByReviewee(revieweeId);
  }

  @Get('reviewee/:revieweeId/average-rating')
  @ApiOperation({ summary: 'Get average rating for a reviewee' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Average rating retrieved successfully' })
  getAverageRating(@Param('revieweeId') revieweeId: string) {
    return this.sessionReviewService.getAverageRating(revieweeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a session review by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Review retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Review not found' })
  findOne(@Param('id') id: string) {
    return this.sessionReviewService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a session review' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Review updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Review not found' })
  update(@Param('id') id: string, @Body() updateDto: Record<string, unknown>) {
    return this.sessionReviewService.update(
      id,
      updateDto as Parameters<SessionReviewService['update']>[1],
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a session review' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Review deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Review not found' })
  remove(@Param('id') id: string) {
    return this.sessionReviewService.remove(id);
  }
}
