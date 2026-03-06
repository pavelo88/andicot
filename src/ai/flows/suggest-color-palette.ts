'use server';

/**
 * @fileOverview Sugiere una paleta de colores cohesiva y accesible para los modos claro y oscuro, basada en un color primario.
 *
 * - suggestColorPalette - Una función que sugiere la paleta de colores.
 * - SuggestColorPaletteInput - El tipo de entrada para la función suggestColorPalette.
 * - SuggestColorPaletteOutput - El tipo de retorno para la función suggestColorPalette.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestColorPaletteInputSchema = z.object({
  primaryColor: z
    .string()
    .describe('El color primario en formato hexadecimal (ej., #00f2ff).'),
});
export type SuggestColorPaletteInput = z.infer<typeof SuggestColorPaletteInputSchema>;

const SuggestColorPaletteOutputSchema = z.object({
  darkMode: z.object({
    primary: z.string().describe('Color primario para el modo oscuro.'),
    background: z.string().describe('Color de fondo para el modo oscuro.'),
    accent: z.string().describe('Color de acento para el modo oscuro.'),
  }),
  lightMode: z.object({
    primary: z.string().describe('Color primario para el modo claro.'),
    background: z.string().describe('Color de fondo para el modo claro.'),
    accent: z.string().describe('Color de acento para el modo claro.'),
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
  prompt: `Eres un experto en paletas de colores. Basado en el color primario dado, sugiere una paleta de colores cohesiva y accesible para los modos claro y oscuro.

Color Primario: {{{primaryColor}}}

Considera la accesibilidad al elegir los colores para asegurar suficiente contraste.

Genera la paleta de colores en el siguiente formato JSON:
{
  "darkMode": {
    "primary": "Color primario para modo oscuro (código hex)",
    "background": "Color de fondo para modo oscuro (código hex)",
    "accent": "Color de acento para modo oscuro (código hex)",
  },
  "lightMode": {
    "primary": "Color primario para modo claro (código hex)",
    "background": "Color de fondo para modo claro (código hex)",
    "accent": "Color de acento para modo claro (código hex)",
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
