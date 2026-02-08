'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating service descriptions based on the service title and keywords.
 *
 * It exports:
 * - `generateServiceDescription`: An asynchronous function that takes `GenerateServiceDescriptionInput` and returns a `string` description.
 * - `GenerateServiceDescriptionInput`: The input type for the `generateServiceDescription` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateServiceDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the service.'),
  keywords: z.string().describe('Keywords related to the service, separated by commas.'),
});

export type GenerateServiceDescriptionInput = z.infer<typeof GenerateServiceDescriptionInputSchema>;

const GenerateServiceDescriptionOutputSchema = z.string();

export async function generateServiceDescription(input: GenerateServiceDescriptionInput): Promise<string> {
  return generateServiceDescriptionFlow(input);
}

const generateServiceDescriptionPrompt = ai.definePrompt({
  name: 'generateServiceDescriptionPrompt',
  input: {schema: GenerateServiceDescriptionInputSchema},
  output: {schema: GenerateServiceDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating compelling service descriptions.

  Based on the service title and keywords provided, generate a concise and engaging description for the service.

  Title: {{{title}}}
  Keywords: {{{keywords}}}

  Description:`, // Ensure the output is a string.
});

const generateServiceDescriptionFlow = ai.defineFlow(
  {
    name: 'generateServiceDescriptionFlow',
    inputSchema: GenerateServiceDescriptionInputSchema,
    outputSchema: GenerateServiceDescriptionOutputSchema,
  },
  async input => {
    const {text} = await generateServiceDescriptionPrompt(input);
    return text!;
  }
);
