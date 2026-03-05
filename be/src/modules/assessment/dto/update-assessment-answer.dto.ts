import { IsOptional, IsNumber, IsString, IsIn } from 'class-validator';

export class UpdateAssessmentAnswerDto {
  @IsOptional()
  @IsString()
  @IsIn(['A', 'B', 'C', 'D'])
  answer?: string; // Chỉ A, B, C, D

  @IsOptional()
  @IsNumber()
  responseTime?: number; // Thời gian trả lời (milliseconds)

  @IsOptional()
  metadata?: {
    skipped?: boolean;
    notes?: string;
  };
}