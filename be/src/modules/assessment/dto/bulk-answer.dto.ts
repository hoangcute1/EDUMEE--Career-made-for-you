import { IsNotEmpty, IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class BulkAnswerDto {
  @IsNotEmpty()
  @IsString()
  questionId!: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['A', 'B', 'C', 'D'])
  answer!: string; // Trắc nghiệm ABCD

  @IsOptional()
  @IsNumber()
  responseTime?: number; // Thời gian trả lời (milliseconds)

  @IsOptional()
  metadata?: any; // Thông tin bổ sung nếu cần
}