import { IsOptional, IsString, IsEnum, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType, AssessmentDimension } from '../schemas/assessment-question.schema';

class QuestionOptionDto {
  @IsOptional()
  @IsString()
  value?: 'A' | 'B' | 'C' | 'D';

  @IsOptional()
  @IsString()
  label?: string;
}

export class UpdateAssessmentQuestionDto {
  @IsOptional()
  @IsString()
  questionText?: string;

  @IsOptional()
  @IsEnum(QuestionType)
  questionType?: QuestionType;

  @IsOptional()
  @IsEnum(AssessmentDimension)
  dimension?: AssessmentDimension;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options?: QuestionOptionDto[];

  @IsOptional()
  @IsNumber()
  orderIndex?: number;
}