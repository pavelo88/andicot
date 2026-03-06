'use server';

/**
 * @fileOverview Genera una propuesta comercial basada en el mensaje de un prospecto.
 *
 * - generateProposal - Una función que genera el texto de la propuesta.
 * - GenerateProposalInput - El tipo de entrada para la función generateProposal.
 * - GenerateProposalOutput - El tipo de retorno para la función generateProposal.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProposalInputSchema = z.object({
  leadMessage: z.string().describe("El mensaje de contacto o requerimiento original del usuario."),
});
export type GenerateProposalInput = z.infer<typeof GenerateProposalInputSchema>;

const GenerateProposalOutputSchema = z.object({
  proposal: z.string().describe('Una propuesta comercial bien estructurada en texto plano, lista para ser enviada al cliente. Usa markdown para el formato.'),
});
export type GenerateProposalOutput = z.infer<typeof GenerateProposalOutputSchema>;


export async function generateProposal(input: GenerateProposalInput): Promise<GenerateProposalOutput> {
  return generateProposalFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateProposalPrompt',
  input: {schema: GenerateProposalInputSchema},
  output: {schema: GenerateProposalOutputSchema},
  prompt: `Eres un redactor experto de propuestas para Andicot Solutions, una empresa de primer nivel en seguridad y automatización en Ecuador.

Tu tarea es crear una propuesta comercial convincente, profesional y bien estructurada basada en el mensaje del cliente potencial.

La propuesta debe:
1.  Comenzar con un saludo cortés y profesional.
2.  Reconocer y resumir las necesidades del cliente a partir de su mensaje.
3.  Proponer una solución clara, sugiriendo 1-3 servicios relevantes de Andicot (ej: CCTV con IA, Control de Acceso, Detección de Incendios, Cableado Estructurado).
4.  Exponer brevemente los beneficios de la solución propuesta.
5.  Incluir una llamada a la acción, sugiriendo una reunión o una llamada para discutir detalles.
6.  Terminar con un cierre profesional.

Formatea la salida como un único bloque de texto (texto plano o markdown), no JSON.

Mensaje del Prospecto:
"{{{leadMessage}}}"

Genera la propuesta.`,
});


const generateProposalFlow = ai.defineFlow(
  {
    name: 'generateProposalFlow',
    inputSchema: GenerateProposalInputSchema,
    outputSchema: GenerateProposalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
