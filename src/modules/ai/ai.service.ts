import { Injectable } from '@nestjs/common';
import { generateText, ModelMessage, stepCountIs, streamText, tool } from 'ai';
import { google, createGoogleGenerativeAI } from '@ai-sdk/google';
import axios from 'axios';
import { z } from 'zod';

@Injectable()
export class AiService {
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
      console.error('Gemini Custom Prompt Error:', error);
      throw new Error('Failed to generate content from custom prompt.');
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
      console.error('Gemini Specific Prompt Error:', error);
      throw new Error('Failed to generate specific content.');
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
      console.error('Gemini Custom Prompt Error:', error);
      throw new Error('Failed to generate content from custom prompt.');
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

  async askWithTools(prompt: string) {
    const { text /* , steps */ } = await generateText({
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
            const geo = await axios.get(
              `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`,
            );
            const loc = geo.data.results?.[0];
            if (!loc) throw new Error(`City not found: ${location}`);

            const res = await axios.get(
              `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true`,
            );

            const current = res.data.current_weather;
            // console.log('Weather Tool Result:', current);

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

    // console.log('Gemini Tools Steps:', steps);
    // console.log('Gemini Tools Response:', text);

    return text;
  }
}
