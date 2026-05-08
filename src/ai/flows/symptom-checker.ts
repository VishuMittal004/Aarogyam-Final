'use server';

/**
 * @fileOverview A symptom checker AI agent.
 *
 * - symptomChecker - A function that handles the symptom checking process.
 * - SymptomCheckerInput - The input type for the symptomChecker function.
 * - SymptomCheckerOutput - The return type for the symptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe("The user's description of their symptoms, including details about the severity, duration, and onset of each symptom."),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
  possibleConditions: z
    .string()
    .describe('A list of possible diseases or conditions that match the symptoms described.'),
  recommendedActions: z
    .string()
    .describe('Recommended actions for the user to take, based on the possible conditions.'),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are an AI health assistant that provides possible conditions and recommended actions based on the user's described symptoms.

  Symptoms: {{{symptoms}}}

  Respond in a way that is easily understandable by someone with low digital literacy.
  List the possible conditions and recommended actions clearly.`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
