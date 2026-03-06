'use server';

/**
 * @fileOverview Define un Asistente de IA proactivo para chatear con clientes.
 *
 * - publicAIChatbot - El flujo principal que actúa como un consultor de ingeniería.
 * - PublicAIChatbotInput - El tipo de entrada para el flujo.
 * - PublicAIChatbotOutput - El tipo de salida del flujo.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Esquema de entrada: el historial de chat para mantener el contexto.
const PublicAIChatbotInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('El historial de la conversación actual.'),
});
export type PublicAIChatbotInput = z.infer<typeof PublicAIChatbotInputSchema>;

// Esquema de salida: la respuesta de la IA y los datos capturados.
const PublicAIChatbotOutputSchema = z.object({
  response: z.string().describe('La respuesta cálida, empática y corta (2-3 oraciones) para el usuario.'),
  name: z.string().optional().describe('El nombre del usuario si fue capturado en la conversación.'),
  phone: z.string().optional().describe('El número de teléfono del usuario si fue capturado.'),
  email: z.string().optional().describe('El correo electrónico del usuario si fue capturado.'),
  leadSummary: z.string().optional().describe('Un resumen técnico y conciso para el equipo de ventas, no para el usuario.'),
  showWhatsappButton: z.boolean().optional().describe('Poner en `true` solo cuando se haya capturado información de contacto y sea un buen momento para que un vendedor intervenga.'),
});
export type PublicAIChatbotOutput = z.infer<typeof PublicAIChatbotOutputSchema>;

// Función exportada que se llamará desde el frontend.
export async function publicAIChatbot(input: PublicAIChatbotInput): Promise<PublicAIChatbotOutput> {
  return publicAIChatbotFlow(input);
}

// El prompt que define la personalidad y las reglas de la IA.
const prompt = ai.definePrompt({
  name: 'publicAIChatbotPrompt',
  input: { schema: PublicAIChatbotInputSchema },
  output: { schema: PublicAIChatbotOutputSchema },
  prompt: `Eres un "Consultor de Ingeniería" de Andicot Solutions, una empresa líder en seguridad y tecnología en Ecuador. Eres amigable, empático y muy proactivo. Tu español es perfecto y natural.

Tu misión es doble:
1.  **Aportar Valor:** Ofrece siempre un consejo técnico breve y útil en tu primera o segunda respuesta.
2.  **Capturar Leads:** Identifica si el usuario es un cliente potencial y captura sutilmente su información de contacto (Nombre, Teléfono, Correo).

**Reglas de Oro:**
- **Respuestas Cortas:** Comunícate en 2-3 oraciones como máximo. Sé directo y claro.
- **Tono Cálido:** Usa un tono cercano y profesional. Haz que el usuario se sienta escuchado.
- **Captura Activa:** No seas un robot. Si el usuario dice "Mi nombre es Juan y necesito ayuda", captura "Juan". Si te dan su número, captúralo.
- **Genera Resumen Técnico:** Una vez que tengas datos de contacto, crea un \`leadSummary\` técnico para el equipo de ventas. Ejemplo: "Lead interesado en CCTV para residencia. Necesita cotización para 4 cámaras IP y un NVR. Contacto: Juan."
- **Botón de Cierre:** Cuando ya tengas datos y veas una oportunidad clara, activa el \`showWhatsappButton\`. No antes.

**Historial de la Conversación:**
{{#each history}}
- **{{role}}**: {{{content}}}
{{/each}}
- **model**: (Tu respuesta aquí)

Genera la respuesta y los campos de datos en el formato JSON requerido.`,
});

// El flujo de Genkit que une todo.
const publicAIChatbotFlow = ai.defineFlow(
  {
    name: 'publicAIChatbotFlow',
    inputSchema: PublicAIChatbotInputSchema,
    outputSchema: PublicAIChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
