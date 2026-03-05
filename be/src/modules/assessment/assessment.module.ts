import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas
import {
  AssessmentQuestion,
  AssessmentQuestionSchema,
  AssessmentAnswer,
  AssessmentAnswerSchema,
  CareerFitResult,
  CareerFitResultSchema,
} from './schemas';

// Services
import {
  AssessmentQuestionService,
  AssessmentAnswerService,
  CareerFitResultService,
} from './services';
import { AIService } from '../../common/services/ai.service';

// Controllers
import {
  AssessmentQuestionController,
  AssessmentAnswerController,
  CareerFitResultController,
} from './controllers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssessmentQuestion.name, schema: AssessmentQuestionSchema },
      { name: AssessmentAnswer.name, schema: AssessmentAnswerSchema },
      { name: CareerFitResult.name, schema: CareerFitResultSchema },
    ]),
  ],
  controllers: [
    AssessmentQuestionController,
    AssessmentAnswerController,
    CareerFitResultController,
  ],
  providers: [
    AssessmentQuestionService,
    AssessmentAnswerService,
    CareerFitResultService,
    AIService,
  ],
  exports: [
    AssessmentQuestionService,
    AssessmentAnswerService,
    CareerFitResultService,
  ],
})
export class AssessmentModule {}