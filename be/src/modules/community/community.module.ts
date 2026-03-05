import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CareerReview, CareerReviewSchema } from './schemas/career-review.schema';
import { ReviewVote, ReviewVoteSchema } from './schemas/review-interactions.schema';
import { CareerReviewService, ReviewInteractionsService } from './services';
import { CareerReviewController, ReviewInteractionsController } from './controllers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CareerReview.name, schema: CareerReviewSchema },
      { name: ReviewVote.name, schema: ReviewVoteSchema },
    ]),
  ],
  controllers: [CareerReviewController, ReviewInteractionsController],
  providers: [CareerReviewService, ReviewInteractionsService],
  exports: [CareerReviewService, ReviewInteractionsService],
})
export class CommunityModule {}
