import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingSessionService } from '../services/booking-session.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('booking-sessions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('booking-sessions')
export class BookingSessionController {
  constructor(private readonly bookingSessionService: BookingSessionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking session' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Booking created successfully' })
  create(@Body() createDto: any) {
    return this.bookingSessionService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all booking sessions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Bookings retrieved successfully' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('menteeId') menteeId?: string,
    @Query('mentorId') mentorId?: string,
    @Query('status') status?: string,
  ) {
    const filters = {
      ...(menteeId ? { menteeId } : {}),
      ...(mentorId ? { mentorId } : {}),
      ...(status ? { status } : {}),
    } as Parameters<BookingSessionService['findAll']>[2];

    return this.bookingSessionService.findAll(page, limit, filters);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending booking sessions' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pending bookings retrieved successfully' })
  findPending() {
    return this.bookingSessionService.findPending();
  }

  @Get('mentee/:menteeId')
  @ApiOperation({ summary: 'Get bookings by mentee' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Bookings retrieved successfully' })
  findByMentee(@Param('menteeId') menteeId: string) {
    return this.bookingSessionService.findByMentee(menteeId);
  }

  @Get('mentor/:mentorId')
  @ApiOperation({ summary: 'Get bookings by mentor' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Bookings retrieved successfully' })
  findByMentor(@Param('mentorId') mentorId: string) {
    return this.bookingSessionService.findByMentor(mentorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking session by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Booking not found' })
  findOne(@Param('id') id: string) {
    return this.bookingSessionService.findOne(id);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm a booking session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking confirmed successfully' })
  confirmBooking(@Param('id') id: string) {
    return this.bookingSessionService.confirmBooking(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking cancelled successfully' })
  cancelBooking(
    @Param('id') id: string,
    @Body() body: { cancelledBy: 'mentee' | 'mentor'; reason?: string },
  ) {
    return this.bookingSessionService.cancelBooking(id, body.cancelledBy, body.reason);
  }

  @Post(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule a booking session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking rescheduled successfully' })
  rescheduleBooking(@Param('id') id: string, @Body() body: { newSchedule: unknown }) {
    return this.bookingSessionService.rescheduleBooking(
      id,
      body.newSchedule as Parameters<BookingSessionService['rescheduleBooking']>[1],
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a booking session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Booking not found' })
  update(@Param('id') id: string, @Body() updateDto: Record<string, unknown>) {
    return this.bookingSessionService.update(
      id,
      updateDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking session' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Booking not found' })
  remove(@Param('id') id: string) {
    return this.bookingSessionService.remove(id);
  }
}
