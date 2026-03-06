'use server';

/**
 * @fileOverview Define un asistente experto de IA que responde preguntas sobre la empresa.
 *
 * - expertAssistant - La función que responde a la pregunta del usuario.
 * - ExpertAssistantInput - El tipo de entrada para la función.
 * - ExpertAssistantOutput - El tipo de salida de la función.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpertAssistantInputSchema = z.object({
  question: z.string().describe('La pregunta del usuario sobre la empresa, sus servicios o marcas.'),
  servicesContext: z.string().describe('Una cadena JSON con la lista de servicios que ofrece la empresa.'),
  brandsContext: z.string().describe('Una cadena JSON con la lista de marcas con las que trabaja la empresa.'),
});
export type ExpertAssistantInput = z.infer<typeof ExpertAssistantInputSchema>;

const ExpertAssistantOutputSchema = z.object({
  answer: z.string().describe('La respuesta del asistente experto a la pregunta del usuario.'),
});
export type ExpertAssistantOutput = z.infer<typeof ExpertAssistantOutputSchema>;


export async function expertAssistant(input: ExpertAssistantInput): Promise<ExpertAssistantOutput> {
  return expertAssistantFlow(input);
}


const prompt = ai.definePrompt({
  name: 'expertAssistantPrompt',
  input: {schema: ExpertAssistantInputSchema},
  output: {schema: ExpertAssistantOutputSchema},
  prompt: `Eres un asistente de ventas experto y amigable de Andicot Solutions, una empresa líder en seguridad y tecnología en Ecuador.
Tu misión es responder las preguntas de los usuarios de manera clara, concisa y profesional, basándote únicamente en la información proporcionada a continuación.

**CONTEXTO DE SERVICIOS (en formato JSON):**
{{{servicesContext}}}

**CONTEXTO DE MARCAS ALIADAS (en formato JSON):**
{{{brandsContext}}}

**PREGUNTA DEL USUARIO:**
"{{{question}}}"

**INSTRUCCIONES:**
1.  Responde siempre en español.
2.  Tu conocimiento se limita estrictamente a la información de los contextos de servicios y marcas. No uses conocimiento externo.
3.  Si la pregunta del usuario está relacionada con los servicios o marcas, responde de forma útil y directa.
4.  Si la pregunta no se puede responder con la información proporcionada (ej: "¿cuál es el clima en Quito?" o preguntas sobre temas no relacionados), responde amablemente: "Soy un asistente especializado en los servicios y soluciones de Andicot. No tengo información sobre ese tema, pero estaré encantado de ayudarte con cualquier consulta sobre seguridad y tecnología."
5.  No inventes precios ni detalles que no estén en el contexto. Si te preguntan por un precio, puedes mencionar que pueden usar el cotizador online para más detalles.
6.  Sé breve y amigable.

Genera la respuesta en el formato JSON requerido.`,
});


const expertAssistantFlow = ai.defineFlow(
  {
    name: 'expertAssistantFlow',
    inputSchema: ExpertAssistantInputSchema,
    outputSchema: ExpertAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
