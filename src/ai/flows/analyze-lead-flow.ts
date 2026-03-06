'use server';

/**
 * @fileOverview Analyzes a lead's message to suggest a category, evaluate intent, and draft a response.
 *
 * - analyzeLead - A function that performs the lead analysis.
 * - AnalyzeLeadInput - The input type for the analyzeLead function.
 * - AnalyzeLeadOutput - The return type for the analyzeLead function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeLeadInputSchema = z.object({
  message: z.string().describe("The user's contact message or requirement."),
});
export type AnalyzeLeadInput = z.infer<typeof AnalyzeLeadInputSchema>;

const AnalyzeLeadOutputSchema = z.object({
  suggestedCategory: z.string().describe('A suggested category for the lead (e.g., "CCTV Installation", "General Inquiry").'),
  intentEvaluation: z.string().describe('A brief evaluation of the lead\'s intent (e.g., "High-intent, requires immediate quote").'),
  draftResponse: z.string().describe('A concise, professional draft response to the lead.'),
});
export type AnalyzeLeadOutput = z.infer<typeof AnalyzeLeadOutputSchema>;


export async function analyzeLead(input: AnalyzeLeadInput): Promise<AnalyzeLeadOutput> {
  return analyzeLeadFlow(input);
}


const prompt = ai.definePrompt({
  name: 'analyzeLeadPrompt',
  input: {schema: AnalyzeLeadInputSchema},
  output: {schema: AnalyzeLeadOutputSchema},
  prompt: `You are a sales assistant for Andicot, a security and technology solutions company.
Your task is to analyze an incoming lead message.

Based on the message, provide a suggested category, evaluate the customer's intent, and draft a short, polite initial response.

Lead Message:
"{{{message}}}"

Generate the response in the required JSON format.`,
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
