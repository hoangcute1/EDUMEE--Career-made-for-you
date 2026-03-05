import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OnboardingSession, OnboardingSessionSchema } from './schemas/onboarding-session.schema';
import { OnboardingSessionService } from './services';
import { OnboardingSessionController } from './controllers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OnboardingSession.name, schema: OnboardingSessionSchema },
    ]),
  ],
  controllers: [OnboardingSessionController],
  providers: [OnboardingSessionService],
  exports: [OnboardingSessionService],
})
export class OnboardingModule {}
