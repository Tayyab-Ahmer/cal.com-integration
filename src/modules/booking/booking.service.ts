import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateBookingDto } from './dto/booking.dto';
import { CalService } from 'src/shared/services/cal.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly calService: CalService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const {
      userId,
      start,
      language = 'en',
      attendee,
      // timeZone,
      bookingFieldsResponses,
      eventTypeId,
      eventTypeSlug,
      username,
      teamSlug,
      organizationSlug,
      guests,
      meetingUrl,
      // location,
      // metadata,
      lengthInMinutes,
      routing,
      emailVerificationCode,
      instant,
    } = createBookingDto;

    // Ensure user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const calPayload: any = {
      start,
      // language: language || 'en', /
      attendee: {
        name: attendee?.name || user.name || 'Guest',
        email: attendee?.email || user.email,
        timeZone: attendee?.timeZone || 'UTC',
        phoneNumber: attendee?.phoneNumber,
        language: attendee?.language || language || 'en',
      },
      bookingFieldsResponses: bookingFieldsResponses
        ? { ...bookingFieldsResponses }
        : undefined,
      // metadata: metadata ? { ...metadata } : undefined,
      // location: location ? { ...location } : undefined,
      routing: routing ? { ...routing } : undefined,
      eventTypeId,
      eventTypeSlug,
      username,
      teamSlug,
      organizationSlug,
      guests: guests?.length ? guests : undefined,
      meetingUrl,
      emailVerificationCode,
    };

    Object.keys(calPayload).forEach((key) => {
      if (calPayload[key] === undefined) {
        delete calPayload[key];
      }
    });

    // console.debug(
    //   '📤 Cal.com booking payload:',
    //   JSON.stringify(calPayload, null, 2),
    // );

    const calResponse = await this.calService.createBooking(calPayload);

    // console.debug('📥 Cal.com booking response:', calResponse);

    return this.prisma.booking.create({
      data: {
        userId,
        eventTypeId,
        eventTypeSlug,
        username,
        teamSlug,
        organizationSlug,
        instant: instant || false,
        calComEventId: calResponse?.data?.uid || null,
        start: start,
        language: language || 'en',
        attendee: {
          name: calPayload.attendee.name,
          email: calPayload.attendee.email,
          timeZone: calPayload.attendee.timeZone,
          phoneNumber: calPayload.attendee.phoneNumber,
          language: calPayload.attendee.language,
        },
        bookingFieldsResponses,
        guests: guests || [],
        meetingUrl: calResponse?.data?.meetingUrl,
        location: { type: 'Google Meet' },
        // metadata,
        lengthInMinutes,
        routing,
        emailVerificationCode,
      },
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.booking.delete({ where: { id } });
  }
}
