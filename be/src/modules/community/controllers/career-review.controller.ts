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
import { Types } from 'mongoose';
import { CareerReviewService } from '../services/career-review.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCareerReviewDto, UpdateCareerReviewDto } from '../dto';


@ApiTags('career-reviews')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('career-reviews')
export class CareerReviewController {
  constructor(private readonly careerReviewService: CareerReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new career review' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Review created successfully' })
  create(@Body() createDto: CreateCareerReviewDto) {
    return this.careerReviewService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all career reviews' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reviews retrieved successfully' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
    @Query('careerId') careerId?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    const filters = {
      ...(userId ? { userId } : {}),
      ...(careerId ? { careerId } : {}),
      ...(category ? { category } : {}),
      ...(status ? { status } : {}),
    } as Parameters<CareerReviewService['findAll']>[2];

    return this.careerReviewService.findAll(page, limit, filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get review statistics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Statistics retrieved successfully' })
  getStatistics(@Query('careerId') careerId?: string) {
    return this.careerReviewService.getStatistics(careerId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get reviews by user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reviews retrieved successfully' })
  findByUser(@Param('userId') userId: string) {
    return this.careerReviewService.findByUser(userId);
  }

  @Get('career/:careerId')
  @ApiOperation({ summary: 'Get reviews by career' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reviews retrieved successfully' })
  findByCareer(
    @Param('careerId') careerId: string,
    @Query('published') published?: boolean,
  ) {
    return this.careerReviewService.findByCareer(careerId, published !== false);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get reviews by category' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reviews retrieved successfully' })
  findByCategory(@Param('category') category: string) {
    return this.careerReviewService.findByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a career review by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Review retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Review not found' })
  findOne(@Param('id') id: string) {
    return this.careerReviewService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a career review' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Review updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Review not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateCareerReviewDto) {
    const updateData = {
      ...updateDto,
      ...(updateDto.careerId ? { careerId: new Types.ObjectId(updateDto.careerId) } : {}),
    } as Partial<any>;
    return this.careerReviewService.update(id, updateData);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update review status' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Status updated successfully' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.careerReviewService.updateStatus(id, body.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a career review' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Review deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Review not found' })
  remove(@Param('id') id: string) {
    return this.careerReviewService.remove(id);
  }
}
