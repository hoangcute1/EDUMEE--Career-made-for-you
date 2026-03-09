import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AssessmentQuestionDocument = AssessmentQuestion & Document;

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice', // Trắc nghiệm ABCD
}

export enum AssessmentDimension {
  // Big Five Personality dimensions
  OPENNESS = 'openness',
  CONSCIENTIOUSNESS = 'conscientiousness', 
  EXTRAVERSION = 'extraversion',
  AGREEABLENESS = 'agreeableness',
  NEUROTICISM = 'neuroticism',
  
  // Holland Interest codes
  REALISTIC = 'realistic',
  INVESTIGATIVE = 'investigative',
  ARTISTIC = 'artistic',
  SOCIAL = 'social',
  ENTERPRISING = 'enterprising',
  CONVENTIONAL = 'conventional',
}

interface QuestionOption {
  value: 'A' | 'B' | 'C' | 'D';
  label: string;
}

@Schema({
  timestamps: true,
  collection: 'assessment_questions',
  toJSON: {
    virtuals: true,
    transform: (_doc: any, ret: Record<string, unknown>) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class AssessmentQuestion {
  _id!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  questionText!: string;

  @Prop({ type: String, enum: QuestionType, default: QuestionType.MULTIPLE_CHOICE })
  questionType!: QuestionType;

  // Alias for filtering compatibility
  get type(): QuestionType {
    return this.questionType;
  }

  @Prop({ type: String, enum: AssessmentDimension, required: true })
  dimension!: AssessmentDimension;

  @Prop({ required: true })
  options!: QuestionOption[]; // Luôn có 4 đáp án A, B, C, D

  @Prop({ type: Number, default: 0 })
  orderIndex?: number; // Thứ tự câu hỏi

  @Prop({ default: true })
  isActive?: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}


export const AssessmentQuestionSchema = SchemaFactory.createForClass(AssessmentQuestion);

// Indexes for performance
AssessmentQuestionSchema.index({ dimension: 1, isActive: 1 });
AssessmentQuestionSchema.index({ questionType: 1 });
AssessmentQuestionSchema.index({ orderIndex: 1 });