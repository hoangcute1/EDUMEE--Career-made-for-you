import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewInteractionsService } from '../services/review-interactions.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('review-interactions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('review-interactions')
export class ReviewInteractionsController {
  constructor(private readonly reviewInteractionsService: ReviewInteractionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vote' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Vote created successfully' })
  create(@Body() createDto: any) {
    return this.reviewInteractionsService.create(createDto);
  }

  @Post('vote')
  @ApiOperation({ summary: 'Add or update a vote' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vote added/updated successfully' })
  upsertVote(@Body() body: { reviewId: string; voterId: string; voteType: string }) {
    return this.reviewInteractionsService.upsertVote(body.reviewId, body.voterId, body.voteType);
  }

  @Get()
  @ApiOperation({ summary: 'Get all votes' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Votes retrieved successfully' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('reviewId') reviewId?: string,
    @Query('voterId') voterId?: string,
  ) {
    const filters = {
      ...(reviewId ? { reviewId } : {}),
      ...(voterId ? { voterId } : {}),
    } as Parameters<ReviewInteractionsService['findAll']>[2];

    return this.reviewInteractionsService.findAll(page, limit, filters);
  }

  @Get('review/:reviewId')
  @ApiOperation({ summary: 'Get votes by review' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Votes retrieved successfully' })
  findByReview(@Param('reviewId') reviewId: string) {
    return this.reviewInteractionsService.findByReview(reviewId);
  }

  @Get('review/:reviewId/statistics')
  @ApiOperation({ summary: 'Get vote statistics for a review' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Statistics retrieved successfully' })
  getVoteStatistics(@Param('reviewId') reviewId: string) {
    return this.reviewInteractionsService.getVoteStatistics(reviewId);
  }

  @Get('voter/:voterId')
  @ApiOperation({ summary: 'Get votes by voter' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Votes retrieved successfully' })
  findByVoter(@Param('voterId') voterId: string) {
    return this.reviewInteractionsService.findByVoter(voterId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vote by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vote retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Vote not found' })
  findOne(@Param('id') id: string) {
    return this.reviewInteractionsService.findOne(id);
  }

  @Delete('vote')
  @ApiOperation({ summary: 'Remove a vote' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vote removed successfully' })
  removeVote(@Body() body: { reviewId: string; voterId: string }) {
    return this.reviewInteractionsService.removeVote(body.reviewId, body.voterId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vote' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vote deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Vote not found' })
  remove(@Param('id') id: string) {
    return this.reviewInteractionsService.remove(id);
  }
}
