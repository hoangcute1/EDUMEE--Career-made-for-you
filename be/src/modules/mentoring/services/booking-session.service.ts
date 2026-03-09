import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import {
  BookingSession,
  BookingSessionDocument,
  BookingStatus,
} from '../schemas/booking-session.schema';

@Injectable()
export class BookingSessionService {
  constructor(
    @InjectModel(BookingSession.name)
    private bookingSessionModel: Model<BookingSessionDocument>,
  ) {}

  async create(createDto: any): Promise<BookingSessionDocument> {
    const booking = new this.bookingSessionModel(createDto);
    return booking.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: FilterQuery<BookingSessionDocument> = {},
  ): Promise<{ data: BookingSessionDocument[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.bookingSessionModel.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.bookingSessionModel.countDocuments(filters).exec(),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<BookingSessionDocument> {
    const booking = await this.bookingSessionModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking session with ID ${id} not found`);
    }
    return booking;
  }

  async findByMentee(menteeId: string): Promise<BookingSessionDocument[]> {
    return this.bookingSessionModel.find({ menteeId }).sort({ createdAt: -1 }).exec();
  }

  async findByMentor(mentorId: string): Promise<BookingSessionDocument[]> {
    return this.bookingSessionModel.find({ mentorId }).sort({ createdAt: -1 }).exec();
  }

  async findPending(): Promise<BookingSessionDocument[]> {
    return this.bookingSessionModel.find({ status: BookingStatus.PENDING }).sort({ createdAt: 1 }).exec();
  }

  async confirmBooking(id: string): Promise<BookingSessionDocument> {
    return this.update(id, { status: BookingStatus.CONFIRMED });
  }

  async cancelBooking(id: string, cancelledBy: 'mentee' | 'mentor', reason?: string): Promise<BookingSessionDocument> {
    const status =
      cancelledBy === 'mentee'
        ? BookingStatus.CANCELLED_BY_MENTEE
        : BookingStatus.CANCELLED_BY_MENTOR;
    return this.update(id, { status, ...(reason ? { 'cancellationDetails.reason': reason } : {}) });
  }

  async rescheduleBooking(
    id: string,
    newSchedule: BookingSession['schedulingDetails'],
  ): Promise<BookingSessionDocument> {
    return this.update(id, {
      status: BookingStatus.RESCHEDULED,
      schedulingDetails: newSchedule,
    });
  }

  async update(
    id: string,
    updateDto: Record<string, unknown>,
  ): Promise<BookingSessionDocument> {
    const booking = await this.bookingSessionModel
      .findByIdAndUpdate(id, updateDto as Partial<BookingSession>, { new: true })
      .exec();
    if (!booking) {
      throw new NotFoundException(`Booking session with ID ${id} not found`);
    }
    return booking;
  }

  async remove(id: string): Promise<BookingSessionDocument> {
    const booking = await this.bookingSessionModel.findByIdAndDelete(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking session with ID ${id} not found`);
    }
    return booking;
  }
}
