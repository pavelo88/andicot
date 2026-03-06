'use server';

/**
 * @fileOverview Generates SEO metadata (meta description and keywords) based on hero section content.
 *
 * - generateSeoMetadata - A function that generates the SEO metadata.
 * - GenerateSeoMetadataInput - The input type for the generateSeoMetadata function.
 * - GenerateSeoMetadataOutput - The return type for the generateSeoMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeoMetadataInputSchema = z.object({
  heroTitle: z.string().describe('The main title from the hero section of the website.'),
  heroSubtitle: z.string().describe('The subtitle or descriptive text from the hero section.'),
});
export type GenerateSeoMetadataInput = z.infer<typeof GenerateSeoMetadataInputSchema>;

const GenerateSeoMetadataOutputSchema = z.object({
  metaDescription: z.string().describe('A concise and compelling meta description for SEO, under 160 characters.'),
  keywords: z.array(z.string()).describe('A list of 5-10 relevant SEO keywords.'),
});
export type GenerateSeoMetadataOutput = z.infer<typeof GenerateSeoMetadataOutputSchema>;


export async function generateSeoMetadata(input: GenerateSeoMetadataInput): Promise<GenerateSeoMetadataOutput> {
  return generateSeoMetadataFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateSeoMetadataPrompt',
  input: {schema: GenerateSeoMetadataInputSchema},
  output: {schema: GenerateSeoMetadataOutputSchema},
  prompt: `You are an SEO expert specializing in websites for technology and security companies.
Based on the provided hero title and subtitle, generate an optimized meta description (under 160 characters) and a list of 5-10 relevant keywords.

Hero Title: {{{heroTitle}}}
Hero Subtitle: {{{heroSubtitle}}}

Generate the response in the required JSON format.`,
});


const generateSeoMetadataFlow = ai.defineFlow(
  {
    name: 'generateSeoMetadataFlow',
    inputSchema: GenerateSeoMetadataInputSchema,
    outputSchema: GenerateSeoMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
