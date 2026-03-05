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
import { OnboardingSessionService } from '../services/onboarding-session.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('onboarding-sessions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('onboarding-sessions')
export class OnboardingSessionController {
  constructor(private readonly onboardingSessionService: OnboardingSessionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new onboarding session' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Session created successfully' })
  create(@Body() createDto: any) {
    return this.onboardingSessionService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all onboarding sessions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sessions retrieved successfully' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ) {
    const filters = {
      ...(userId ? { userId } : {}),
      ...(status ? { status } : {}),
    } as Parameters<OnboardingSessionService['findAll']>[2];

    return this.onboardingSessionService.findAll(page, limit, filters);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get onboarding statistics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Statistics retrieved successfully' })
  getStatistics() {
    return this.onboardingSessionService.getStatistics();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active onboarding sessions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Active sessions retrieved successfully' })
  findActive() {
    return this.onboardingSessionService.findActive();
  }

  @Get('completed')
  @ApiOperation({ summary: 'Get completed onboarding sessions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Completed sessions retrieved successfully' })
  findCompleted() {
    return this.onboardingSessionService.findCompleted();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get onboarding session by user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Session retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session not found' })
  findByUser(@Param('userId') userId: string) {
    return this.onboardingSessionService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an onboarding session by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Session retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session not found' })
  findOne(@Param('id') id: string) {
    return this.onboardingSessionService.findOne(id);
  }

  @Put(':id/progress')
  @ApiOperation({ summary: 'Update onboarding progress' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Progress updated successfully' })
  updateProgress(
    @Param('id') id: string,
    @Body() body: { currentStep: string; progressData: Record<string, unknown> },
  ) {
    return this.onboardingSessionService.updateProgress(id, body.currentStep, body.progressData);
  }

  @Put(':id/complete-step')
  @ApiOperation({ summary: 'Complete an onboarding step' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Step completed successfully' })
  completeStep(@Param('id') id: string, @Body() body: { step: string; stepData: any }) {
    return this.onboardingSessionService.completeStep(id, body.step, body.stepData);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Complete the onboarding process' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Onboarding completed successfully' })
  completeOnboarding(@Param('id') id: string) {
    return this.onboardingSessionService.completeOnboarding(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an onboarding session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Session updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session not found' })
  update(@Param('id') id: string, @Body() updateDto: Record<string, unknown>) {
    return this.onboardingSessionService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an onboarding session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Session deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Session not found' })
  remove(@Param('id') id: string) {
    return this.onboardingSessionService.remove(id);
  }
}
