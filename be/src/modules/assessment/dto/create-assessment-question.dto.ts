import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType, AssessmentDimension } from '../schemas/assessment-question.schema';

class QuestionOptionDto {
  @IsNotEmpty()
  @IsString()
  value!: 'A' | 'B' | 'C' | 'D';

  @IsNotEmpty()
  @IsString()
  label!: string;
}

export class CreateAssessmentQuestionDto {
  @IsNotEmpty()
  @IsString()
  questionText!: string;

  @IsOptional()
  @IsEnum(QuestionType)
  questionType?: QuestionType; // Mặc định là MULTIPLE_CHOICE

  @IsNotEmpty()
  @IsEnum(AssessmentDimension)
  dimension!: AssessmentDimension;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options!: QuestionOptionDto[]; // Phải có đúng 4 đáp án A, B, C, D

  @IsOptional()
  @IsNumber()
  orderIndex?: number;
}