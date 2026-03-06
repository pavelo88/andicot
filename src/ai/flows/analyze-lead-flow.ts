'use server';

/**
 * @fileOverview Analiza el mensaje de un prospecto para sugerir una categoría, evaluar la intención y redactar una respuesta.
 *
 * - analyzeLead - Una función que realiza el análisis del prospecto.
 * - AnalyzeLeadInput - El tipo de entrada para la función analyzeLead.
 * - AnalyzeLeadOutput - El tipo de retorno para la función analyzeLead.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeLeadInputSchema = z.object({
  message: z.string().describe("El mensaje de contacto o requerimiento del usuario."),
});
export type AnalyzeLeadInput = z.infer<typeof AnalyzeLeadInputSchema>;

const AnalyzeLeadOutputSchema = z.object({
  suggestedCategory: z.string().describe('Una categoría sugerida para el prospecto (ej: "Instalación de CCTV", "Consulta General").'),
  intentEvaluation: z.string().describe('Una breve evaluación de la intención del prospecto (ej: "Alta intención, requiere cotización inmediata").'),
  draftResponse: z.string().describe('Un borrador de respuesta conciso y profesional para el prospecto.'),
});
export type AnalyzeLeadOutput = z.infer<typeof AnalyzeLeadOutputSchema>;


export async function analyzeLead(input: AnalyzeLeadInput): Promise<AnalyzeLeadOutput> {
  return analyzeLeadFlow(input);
}


const prompt = ai.definePrompt({
  name: 'analyzeLeadPrompt',
  input: {schema: AnalyzeLeadInputSchema},
  output: {schema: AnalyzeLeadOutputSchema},
  prompt: `Eres un asistente de ventas para Andicot, una empresa de soluciones de seguridad y tecnología en Ecuador.
Tu tarea es analizar un mensaje de un cliente potencial entrante.

Basado en el mensaje, proporciona una categoría sugerida, evalúa la intención del cliente y redacta una respuesta inicial corta y educada.

Mensaje del Prospecto:
"{{{message}}}"

Genera la respuesta en el formato JSON requerido.`,
});


const analyzeLeadFlow = ai.defineFlow(
  {
    name: 'analyzeLeadFlow',
    inputSchema: AnalyzeLeadInputSchema,
    outputSchema: AnalyzeLeadOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
