'use server';

/**
 * @fileOverview Genera metadatos SEO (meta descripción y palabras clave) basados en el contenido de la sección principal (hero).
 *
 * - generateSeoMetadata - Una función que genera los metadatos SEO.
 * - GenerateSeoMetadataInput - El tipo de entrada para la función generateSeoMetadata.
 * - GenerateSeoMetadataOutput - El tipo de retorno para la función generateSeoMetadata.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeoMetadataInputSchema = z.object({
  heroTitle: z.string().describe('El título principal de la sección hero del sitio web.'),
  heroSubtitle: z.string().describe('El subtítulo o texto descriptivo de la sección hero.'),
});
export type GenerateSeoMetadataInput = z.infer<typeof GenerateSeoMetadataInputSchema>;

const GenerateSeoMetadataOutputSchema = z.object({
  metaDescription: z.string().describe('Una meta descripción concisa y atractiva para SEO, de menos de 160 caracteres.'),
  keywords: z.array(z.string()).describe('Una lista de 5 a 10 palabras clave relevantes para SEO.'),
});
export type GenerateSeoMetadataOutput = z.infer<typeof GenerateSeoMetadataOutputSchema>;


export async function generateSeoMetadata(input: GenerateSeoMetadataInput): Promise<GenerateSeoMetadataOutput> {
  return generateSeoMetadataFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateSeoMetadataPrompt',
  input: {schema: GenerateSeoMetadataInputSchema},
  output: {schema: GenerateSeoMetadataOutputSchema},
  prompt: `Eres un experto en SEO especializado en sitios web para empresas de tecnología y seguridad.
Basado en el título y subtítulo proporcionados, genera una meta descripción optimizada (menos de 160 caracteres) y una lista de 5 a 10 palabras clave relevantes.

Título Principal: {{{heroTitle}}}
Subtítulo: {{{heroSubtitle}}}

Genera la respuesta en el formato JSON requerido.`,
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
