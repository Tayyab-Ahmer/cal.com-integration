import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

@Injectable()
export class CalService {
  private readonly logger = new Logger(CalService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly apiVersion: string;

  constructor() {
    this.apiUrl = process.env.CALCOM_API_URL;
    this.apiKey = process.env.CALCOM_API_KEY;
    this.apiVersion = process.env.CALCOM_API_VERSION || '2024-01-01';

    if (!this.apiUrl || !this.apiKey) {
      this.logger.error(
        ' Missing Cal.com environment variables (CALCOM_API_URL or CALCOM_API_KEY)',
      );
    } else {
      this.logger.log(`CalService initialized `);
    }
  }

  async createBooking(payload: any): Promise<any> {
    if (!this.apiUrl || !this.apiKey) {
      throw new HttpException(
        'Cal.com configuration missing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const response = await axios.post(`${this.apiUrl}`, payload, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'cal-api-version': this.apiVersion,
          'Content-Type': 'application/json',
        },
        validateStatus: () => true,
      });

      if (response.status === 201) {
        this.logger.log('Booking successfully created in Cal.com');
        return response.data;
      } else {
        this.logger.warn(`Cal.com responded with status ${response.status}`);
        // this.logger.debug(`Response: ${JSON.stringify(response.data)}`);

        throw new HttpException(
          {
            message: 'Cal.com booking creation failed',
            status: response.status,
            details: response.data || 'No details provided',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error('Axios error while calling Cal.com:', error.message);
        throw new HttpException(
          {
            message: 'Failed to communicate with Cal.com API',
            details: error.response?.data || error.message,
          },
          error.response?.status || HttpStatus.BAD_GATEWAY,
        );
      }

      this.logger.error('🔥 Unexpected error in CalService:', error);
      throw new HttpException(
        'Unexpected error occurred while creating booking',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

/* import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CalService {
  private readonly apiUrl = process.env.CALCOM_API_URL;

  async createBooking(payload: any) {
    const apiKey = process.env.CALCOM_API_KEY;

    try {
      const response = await axios.post(`${this.apiUrl}`, payload, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          // 'cal-api-version': '',
          'cal-api-version': process.env.CALCOM_API_VERSION,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        'Cal.com booking creation failed:',
        error.response?.data || error.message,
      );
      throw new Error(error.response?.data || 'Cal.com booking error');
    }
  }
}
 */
