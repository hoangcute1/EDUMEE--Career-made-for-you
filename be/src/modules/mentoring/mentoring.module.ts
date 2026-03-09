import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TutorProfile, TutorProfileSchema } from './schemas/tutor-profile.schema';
import { TutoringSession, TutoringSessionSchema } from './schemas/tutoring-session.schema';
import { BookingSession, BookingSessionSchema } from './schemas/booking-session.schema';
import { SessionReview, SessionReviewSchema } from './schemas/session-review.schema';
import {
  TutorProfileService,
  TutoringSessionService,
  BookingSessionService,
  SessionReviewService,
} from './services';
import {
  TutorProfileController,
  TutoringSessionController,
  BookingSessionController,
  SessionReviewController,
} from './controllers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TutorProfile.name, schema: TutorProfileSchema },
      { name: TutoringSession.name, schema: TutoringSessionSchema },
      { name: BookingSession.name, schema: BookingSessionSchema },
      { name: SessionReview.name, schema: SessionReviewSchema },
    ]),
  ],
  controllers: [
    TutorProfileController,
    TutoringSessionController,
    BookingSessionController,
    SessionReviewController,
  ],
  providers: [
    TutorProfileService,
    TutoringSessionService,
    BookingSessionService,
    SessionReviewService,
  ],
  exports: [
    TutorProfileService,
    TutoringSessionService,
    BookingSessionService,
    SessionReviewService,
  ],
})
export class MentoringModule {}
