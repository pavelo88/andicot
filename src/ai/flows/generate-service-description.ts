'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating service descriptions based on the service title.
 *
 * It exports:
 * - `generateServiceDescription`: An asynchronous function that takes `GenerateServiceDescriptionInput` and returns `GenerateServiceDescriptionOutput`.
 * - `GenerateServiceDescriptionInput`: The input type for the `generateServiceDescription` function.
 * - `GenerateServiceDescriptionOutput`: The output type for the `generateServiceDescription` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateServiceDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the service.'),
});

export type GenerateServiceDescriptionInput = z.infer<typeof GenerateServiceDescriptionInputSchema>;

const GenerateServiceDescriptionOutputSchema = z.object({
  description: z.string().describe('A compelling, commercial description for the service.'),
});
export type GenerateServiceDescriptionOutput = z.infer<typeof GenerateServiceDescriptionOutputSchema>;


export async function generateServiceDescription(input: GenerateServiceDescriptionInput): Promise<GenerateServiceDescriptionOutput> {
  return generateServiceDescriptionFlow(input);
}

const generateServiceDescriptionPrompt = ai.definePrompt({
  name: 'generateServiceDescriptionPrompt',
  input: {schema: GenerateServiceDescriptionInputSchema},
  output: {schema: GenerateServiceDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating compelling service descriptions for technology and security companies.

  Based on the service title provided, generate a concise and engaging commercial description for the service.

  Title: {{{title}}}

  Generate the response in the required JSON format.`,
});

const generateServiceDescriptionFlow = ai.defineFlow(
  {
    name: 'generateServiceDescriptionFlow',
    inputSchema: GenerateServiceDescriptionInputSchema,
    outputSchema: GenerateServiceDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateServiceDescriptionPrompt(input);
    return output!;
  }
);
