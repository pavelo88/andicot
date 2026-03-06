'use server';

/**
 * @fileOverview Generates a commercial proposal based on a lead's message.
 *
 * - generateProposal - A function that generates the proposal text.
 * - GenerateProposalInput - The input type for the generateProposal function.
 * - GenerateProposalOutput - The return type for the generateProposal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProposalInputSchema = z.object({
  leadMessage: z.string().describe("The user's original contact message or requirement."),
});
export type GenerateProposalInput = z.infer<typeof GenerateProposalInputSchema>;

const GenerateProposalOutputSchema = z.object({
  proposal: z.string().describe('A well-structured commercial proposal in plain text, ready to be sent to the client. Use markdown for formatting.'),
});
export type GenerateProposalOutput = z.infer<typeof GenerateProposalOutputSchema>;


export async function generateProposal(input: GenerateProposalInput): Promise<GenerateProposalOutput> {
  return generateProposalFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateProposalPrompt',
  input: {schema: GenerateProposalInputSchema},
  output: {schema: GenerateProposalOutputSchema},
  prompt: `You are an expert proposal writer for Andicot Solutions, a top-tier security and automation company in Ecuador.

Your task is to create a compelling, professional, and well-structured commercial proposal based on the lead's message.

The proposal should:
1.  Start with a polite and professional greeting.
2.  Acknowledge and summarize the client's needs from their message.
3.  Propose a clear solution, suggesting 1-3 relevant Andicot services (e.g., CCTV con IA, Control de Acceso, Detección de Incendios, Cableado Estructurado).
4.  Briefly state the benefits of the proposed solution.
5.  Include a call to action, suggesting a meeting or a call to discuss details.
6.  End with a professional closing.

Format the output as a single block of text (plain text or markdown), not JSON.

Lead Message:
"{{{leadMessage}}}"

Generate the proposal.`,
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
