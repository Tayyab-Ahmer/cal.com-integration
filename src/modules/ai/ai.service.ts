import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { generateText, ModelMessage, stepCountIs, streamText, tool } from 'ai';
import { google, createGoogleGenerativeAI } from '@ai-sdk/google';
import axios from 'axios';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly model = google('gemini-2.5-flash');
  google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  async generateContentFromCustomPrompt(userPrompt: string) {
    try {
      const { text } = await generateText({
        model: this.model,
        prompt: userPrompt,
      });
      return await text;
    } catch (error) {
      throw new HttpException(
        'Failed to generate content from custom prompt.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateSpecificContent() {
    const fixedPrompt =
      'Generate a brief, exciting, and encouraging motto for a developer team working on a new AI product.';

    try {
      const { text } = await generateText({
        model: this.model,
        prompt: fixedPrompt,
      });
      return await text;
    } catch (error) {
      throw new HttpException(
        'Failed to generate specific content.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateContentFromSystemCustomPrompt(userPrompt: string) {
    try {
      const { textStream } = streamText({
        model: this.model,
        system:
          'You are a helpful assistant that provides concise and relevant information.',
        prompt: userPrompt,
      });
      for await (const textPart of textStream) {
        console.log(textPart);
      }
      return await textStream;
    } catch (error) {
      throw new HttpException(
        'Failed to generate content from custom prompt.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateContentFromMessageArray(
    systemPrompt: string,
    userPrompt: string,
  ) {
    const messages: ModelMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ];

    try {
      const { text } = await generateText({
        model: this.model,
        messages: messages,
      });

      return text;
    } catch (error) {
      console.error('Gemini Message Array Prompt Error:', error);
      throw new Error('Failed to generate content using message array.');
    }
  }

  async chatWithAssistant(userId: string, userMessage: string) {
    // Save the user’s message
    await this.prisma.chatMessage.create({
      data: {
        userId,
        role: 'user',
        content: userMessage,
      },
    });

    // Get all previous messages for context (oldest → newest)
    const previousMessages = await this.prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    // Build message array for AI
    const messages: ModelMessage[] = [
      {
        role: 'system',
        content:
          `You are an AI assistant. Read the entire conversation history carefully before replying. ` +
          `Respond helpfully and consistently with previous context. Do NOT repeat old messages. ` +
          `Your tone should be friendly, concise, and context-aware.`,
      },
      ...previousMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      {
        role: 'user',
        content: userMessage,
      },
    ];

    // Generate new AI response
    try {
      const { text: aiReply } = await generateText({
        model: this.model,
        messages,
      });

      // Save assistant reply
      await this.prisma.chatMessage.create({
        data: {
          userId,
          role: 'assistant',
          content: aiReply,
        },
      });

      // Return the response
      return {
        message: 'Success',
        reply: aiReply,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to generate chat response',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  async askWithTools(prompt: string) {
    try {
      const { text /*, steps */ } = await generateText({
        model: this.model,

        tools: {
          getWeather: tool({
            description: 'Get the current weather for a given location',
            inputSchema: z.object({
              location: z
                .string()
                .describe('The name of the city to get weather for'),
            }),
            execute: async ({ location }) => {
              // Step 1️⃣: Fetch geolocation data
              let geo;
              try {
                geo = await axios.get(
                  `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`,
                );

                if (geo.status !== 200 || !geo.data?.results?.length) {
                  throw new HttpException(
                    `Could not find city: ${location}`,
                    HttpStatus.NOT_FOUND,
                  );
                }
              } catch (err) {
                throw new HttpException(
                  `Failed to fetch geolocation data for ${location}: ${err.message}`,
                  HttpStatus.BAD_GATEWAY,
                );
              }

              const loc = geo.data.results[0];

              // Step 2️⃣: Fetch current weather
              let res;
              try {
                res = await axios.get(
                  `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true`,
                );

                if (res.status !== 200 || !res.data?.current_weather) {
                  throw new HttpException(
                    `Failed to retrieve weather data for ${loc.name}`,
                    HttpStatus.NOT_FOUND,
                  );
                }
              } catch (err) {
                throw new HttpException(
                  `Weather API request failed for ${loc.name}: ${err.message}`,
                  HttpStatus.BAD_GATEWAY,
                );
              }

              const current = res.data.current_weather;

              return {
                location: loc.name,
                temperature: current.temperature,
                windspeed: current.windspeed,
                weathercode: current.weathercode,
              };
            },
          }),
        },

        stopWhen: stepCountIs(5),
        prompt,
      });

      return await text;
    } catch (error) {
      //  Replace generic throw with proper NestJS HttpException
      throw new HttpException(
        `Failed to process AI tool request: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
