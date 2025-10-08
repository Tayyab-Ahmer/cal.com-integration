import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBookingDto } from './dto/booking.dto';
import { BookingService } from './booking.service';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Cal.com-compatible booking' })
  async create(@Body() createBookingDto: CreateBookingDto) {
    return await this.bookingService.create(createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings with related user info' })
  async findAll() {
    return await this.bookingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  async findOne(@Param('id') id: string) {
    return await this.bookingService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel or delete a booking' })
  async remove(@Param('id') id: string) {
    return await this.bookingService.remove(id);
  }
}
