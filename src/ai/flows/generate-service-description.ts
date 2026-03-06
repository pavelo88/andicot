'use server';

/**
 * @fileOverview Este archivo define un flujo de Genkit para generar descripciones de servicios basadas en el título del servicio.
 *
 * Exporta:
 * - `generateServiceDescription`: Una función asíncrona que toma `GenerateServiceDescriptionInput` y retorna `GenerateServiceDescriptionOutput`.
 * - `GenerateServiceDescriptionInput`: El tipo de entrada para la función `generateServiceDescription`.
 * - `GenerateServiceDescriptionOutput`: El tipo de salida para la función `generateServiceDescription`.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateServiceDescriptionInputSchema = z.object({
  title: z.string().describe('El título del servicio.'),
});

export type GenerateServiceDescriptionInput = z.infer<typeof GenerateServiceDescriptionInputSchema>;

const GenerateServiceDescriptionOutputSchema = z.object({
  description: z.string().describe('Una descripción comercial, atractiva y convincente para el servicio.'),
});
export type GenerateServiceDescriptionOutput = z.infer<typeof GenerateServiceDescriptionOutputSchema>;


export async function generateServiceDescription(input: GenerateServiceDescriptionInput): Promise<GenerateServiceDescriptionOutput> {
  return generateServiceDescriptionFlow(input);
}

const generateServiceDescriptionPrompt = ai.definePrompt({
  name: 'generateServiceDescriptionPrompt',
  input: {schema: GenerateServiceDescriptionInputSchema},
  output: {schema: GenerateServiceDescriptionOutputSchema},
  prompt: `Eres un redactor publicitario experto, especializado en crear descripciones de servicios atractivas para empresas de tecnología y seguridad.

  Basado en el título del servicio proporcionado, genera una descripción comercial concisa y cautivadora para el servicio.

  Título: {{{title}}}

  Genera la respuesta en el formato JSON requerido.`,
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
