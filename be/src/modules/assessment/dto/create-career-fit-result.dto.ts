import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCareerFitResultDto {
  // sessionId removed - no longer using sessions
  // @IsOptional()
  // @IsString() 
  // sessionId?: string;

  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  careerId!: string;

  @IsNotEmpty()
  @IsNumber()
  overallFitScore!: number;

  @IsOptional()
  dimensionScores?: any;

  @IsOptional()
  strengths?: string[];

  @IsOptional()
  developmentAreas?: string[];

  @IsOptional()
  careerRecommendations?: any;

  @IsOptional()
  learningPath?: any;

  @IsOptional()
  confidenceMetrics?: any;
}