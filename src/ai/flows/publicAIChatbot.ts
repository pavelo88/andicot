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
  whatsappSummary: z.string().optional().describe("Un resumen muy corto y amigable para que el usuario envíe por WhatsApp, en primera persona. Ejemplo: 'Hola, soy Pablo y estoy interesado en cámaras para mi negocio.'"),
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
1.  **Aportar Valor:** Ofrece siempre un consejo técnico breve y útil.
2.  **Capturar Leads:** Identifica si el usuario es un cliente potencial y captura su información de contacto.

**Reglas de Oro (¡INQUEBRANTABLES!):**
- **MANTÉN LA CONVERSACIÓN VIVA:** Cada respuesta técnica debe terminar con una pregunta abierta. Sin embargo, esta regla se subordina a la regla de "Transición a la Venta". Cuando pidas los datos de contacto, esa pregunta (ej: "¿Te parece bien si me das tu nombre...?") cuenta como la pregunta abierta para mantener la conversación.
- **Transición a la Venta (¡CRÍTICO!):** Esta es tu función más importante. Después de un máximo de 2 intercambios de consejos técnicos, DEBES pivotar a la venta. Si el usuario sigue la conversación (hace más preguntas, pide detalles o precios), es tu señal para actuar. TU OBJETIVO PRINCIPAL es obtener sus datos. No ofrezcas más consejos. En su lugar, pide explícitamente su nombre y teléfono/email. No falles en esto. Ejemplo de transición: "Entendido. Para darte una solución y costos precisos, lo ideal es que uno de nuestros ingenieros revise tu caso. ¿Te parece bien si me das tu nombre y número de teléfono para que te contacten sin ningún compromiso?"
- **Respuestas Cortas:** Comunícate en 2-3 oraciones como máximo. Sé directo, claro y siempre termina con una pregunta (a menos que estés cerrando la venta).
- **Tono Cálido:** Usa un tono cercano y profesional. Haz que el usuario se sienta escuchado.
- **Captura Activa:** No seas un robot. Si el usuario dice "Mi nombre es Juan y necesito ayuda", captura "Juan" en el campo \`name\`. Si te dan su número, captúralo en \`phone\`.
- **Genera Resumen Técnico:** Una vez que tengas CUALQUIER dato de contacto (nombre, email o teléfono), crea un \`leadSummary\` técnico para el equipo de ventas. Ejemplo: "Lead interesado en CCTV para residencia de 200m2. Pregunta por precio. Contacto inicial: Pablo, 0983992549."
- **Botón de Cierre (WhatsApp):** Tan pronto como hayas capturado al menos el nombre y el teléfono/email, DEBES activar el \`showWhatsappButton\`. Junto con esto, genera un \`whatsappSummary\` en primera persona para el usuario, corto y amigable, usando la información que te dio. Ejemplo: "Hola, soy Pablo y estoy interesado en una cotización para cámaras en mi negocio."

**Historial de la Conversación:**
{{#each history}}
- **{{role}}**: {{{content}}}
{{/each}}
- **model**: (Tu respuesta aquí, siempre terminando con una pregunta según las reglas)

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
