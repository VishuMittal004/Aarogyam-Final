'use server';

/**
 * @fileOverview AI-powered health tips generator.
 *
 * - generateHealthTip - Generates personalized health tips.
 * - HealthTipInput - The input type.
 * - HealthTipOutput - The return type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HealthTipInputSchema = z.object({
  category: z.string().describe('The health category: nutrition, exercise, mental-health, hygiene, seasonal, general'),
  language: z.string().optional().describe('The language to respond in. Defaults to English.'),
});
export type HealthTipInput = z.infer<typeof HealthTipInputSchema>;

const HealthTipOutputSchema = z.object({
  title: z.string().describe('A short, catchy title for the health tip.'),
  content: z.string().describe('The health tip content in 2-3 sentences.'),
  additionalInfo: z.string().describe('Extra context or a fun fact related to the tip.'),
});
export type HealthTipOutput = z.infer<typeof HealthTipOutputSchema>;

export async function generateHealthTip(input: HealthTipInput): Promise<HealthTipOutput> {
  return healthTipFlow(input);
}

const healthTipPrompt = ai.definePrompt({
  name: 'healthTipPrompt',
  input: { schema: HealthTipInputSchema },
  output: { schema: HealthTipOutputSchema },
  prompt: `You are a public health educator providing practical, easy-to-understand health tips for people in rural and semi-urban areas of India.
  
  Generate a health tip for the category: {{{category}}}
  
  {{#if language}}
  Respond in: {{{language}}}
  {{/if}}
  
  Keep the language simple and actionable. Focus on practical advice that can be followed with readily available resources.`,
});

const healthTipFlow = ai.defineFlow(
  {
    name: 'healthTipFlow',
    inputSchema: HealthTipInputSchema,
    outputSchema: HealthTipOutputSchema,
  },
  async (input) => {
    const { output } = await healthTipPrompt(input);
    return output!;
  }
);
