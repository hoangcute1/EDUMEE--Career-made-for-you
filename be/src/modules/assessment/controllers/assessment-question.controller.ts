import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AssessmentQuestionService } from '../services/assessment-question.service';
import { CreateAssessmentQuestionDto, UpdateAssessmentQuestionDto } from '../dto';
import { QuestionType } from '../schemas/assessment-question.schema';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Assessment Questions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('assessment-questions')
export class AssessmentQuestionController {
  constructor(private readonly assessmentQuestionService: AssessmentQuestionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new assessment question' })
  @ApiResponse({ 
    status: 201, 
    description: 'Assessment question created successfully' 
  })
  async create(@Body() createDto: CreateAssessmentQuestionDto) {
    return this.assessmentQuestionService.create(createDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create assessment questions' })
  @ApiResponse({ 
    status: 201, 
    description: 'Assessment questions created successfully' 
  })
  async bulkCreate(
    @Body() questions: CreateAssessmentQuestionDto[],
  ) {
    return this.assessmentQuestionService.bulkCreate(questions);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assessment questions with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: QuestionType })
  @ApiResponse({ 
    status: 200, 
    description: 'Assessment questions retrieved successfully' 
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: QuestionType,
  ) {
    const filters: Partial<any> = {};
    if (type) filters.questionType = type;

    return this.assessmentQuestionService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      filters,
    );
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get questions by type' })
  @ApiParam({ name: 'type', enum: QuestionType })
  @ApiResponse({ 
    status: 200, 
    description: 'Questions by type retrieved successfully' 
  })
  async findByType(
    @Param('type') type: QuestionType,
  ) {
    return this.assessmentQuestionService.findByType(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an assessment question by ID' })
  @ApiParam({ name: 'id', description: 'Assessment question ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Assessment question retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Assessment question not found' 
  })
  async findOne(@Param('id') id: string) {
    return this.assessmentQuestionService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an assessment question' })
  @ApiParam({ name: 'id', description: 'Assessment question ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Assessment question updated successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Assessment question not found' 
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAssessmentQuestionDto,
  ) {
    return this.assessmentQuestionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an assessment question' })
  @ApiParam({ name: 'id', description: 'Assessment question ID' })
  @ApiResponse({ 
    status: 204, 
    description: 'Assessment question deleted successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Assessment question not found' 
  })
  async remove(@Param('id') id: string) {
    return this.assessmentQuestionService.delete(id);
  }
}