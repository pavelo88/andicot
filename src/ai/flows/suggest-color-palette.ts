'use server';

/**
 * @fileOverview Suggests a cohesive and accessible color palette for both dark and light modes based on a primary color input.
 *
 * - suggestColorPalette - A function that suggests the color palette.
 * - SuggestColorPaletteInput - The input type for the suggestColorPalette function.
 * - SuggestColorPaletteOutput - The return type for the suggestColorPalette function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestColorPaletteInputSchema = z.object({
  primaryColor: z
    .string()
    .describe('The primary color in hexadecimal format (e.g., #00f2ff).'),
});
export type SuggestColorPaletteInput = z.infer<typeof SuggestColorPaletteInputSchema>;

const SuggestColorPaletteOutputSchema = z.object({
  darkMode: z.object({
    primary: z.string().describe('Primary color for dark mode.'),
    background: z.string().describe('Background color for dark mode.'),
    accent: z.string().describe('Accent color for dark mode.'),
  }),
  lightMode: z.object({
    primary: z.string().describe('Primary color for light mode.'),
    background: z.string().describe('Background color for light mode.'),
    accent: z.string().describe('Accent color for light mode.'),
  }),
});
export type SuggestColorPaletteOutput = z.infer<typeof SuggestColorPaletteOutputSchema>;

export async function suggestColorPalette(input: SuggestColorPaletteInput): Promise<SuggestColorPaletteOutput> {
  return suggestColorPaletteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestColorPalettePrompt',
  input: {schema: SuggestColorPaletteInputSchema},
  output: {schema: SuggestColorPaletteOutputSchema},
  prompt: `You are a color palette expert. Based on the given primary color, suggest a cohesive and accessible color palette for both dark and light modes.

Primary Color: {{{primaryColor}}}

Consider accessibility when choosing colors to ensure sufficient contrast.

Output the color palette in the following JSON format:
{
  "darkMode": {
    "primary": "Primary color for dark mode (hex code)",
    "background": "Background color for dark mode (hex code)",
    "accent": "Accent color for dark mode (hex code)",
  },
  "lightMode": {
    "primary": "Primary color for light mode (hex code)",
    "background": "Background color for light mode (hex code)",
    "accent": "Accent color for light mode (hex code)",
  },
}`,
});

const suggestColorPaletteFlow = ai.defineFlow(
  {
    name: 'suggestColorPaletteFlow',
    inputSchema: SuggestColorPaletteInputSchema,
    outputSchema: SuggestColorPaletteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
