'use server';

/**
 * @fileOverview AI-powered photo detection for skin conditions.
 *
 * - photoDetection - Analyzes an image description to detect potential skin conditions.
 * - PhotoDetectionInput - The input type for the photoDetection function.
 * - PhotoDetectionOutput - The return type for the photoDetection function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PhotoDetectionInputSchema = z.object({
  imageDescription: z
    .string()
    .describe('A detailed description of the skin condition visible in the photo, including color, texture, size, location on body, and any other visible features.'),
  additionalInfo: z
    .string()
    .optional()
    .describe('Any additional information about the condition such as duration, itching, pain, etc.'),
});
export type PhotoDetectionInput = z.infer<typeof PhotoDetectionInputSchema>;

const PhotoDetectionOutputSchema = z.object({
  possibleConditions: z
    .string()
    .describe('A list of possible skin conditions that match the description provided.'),
  severity: z
    .string()
    .describe('An assessment of the severity level: mild, moderate, or severe.'),
  recommendedActions: z
    .string()
    .describe('Recommended actions and treatment suggestions.'),
  urgency: z
    .string()
    .describe('Whether immediate medical attention is recommended: low, medium, or high.'),
});
export type PhotoDetectionOutput = z.infer<typeof PhotoDetectionOutputSchema>;

export async function photoDetection(input: PhotoDetectionInput): Promise<PhotoDetectionOutput> {
  return photoDetectionFlow(input);
}

const photoDetectionPrompt = ai.definePrompt({
  name: 'photoDetectionPrompt',
  input: { schema: PhotoDetectionInputSchema },
  output: { schema: PhotoDetectionOutputSchema },
  prompt: `You are a dermatological AI assistant that helps analyze skin conditions based on visual descriptions.
  
  IMPORTANT DISCLAIMER: You are NOT providing a medical diagnosis. You are only providing educational information based on the description.
  
  Analyze the following description of a skin condition and provide:
  1. Possible conditions that match the description
  2. Severity assessment (mild, moderate, or severe)
  3. Recommended actions (home remedies, over-the-counter treatments, or when to see a doctor)
  4. Urgency level (low, medium, or high)
  
  Description of the skin condition: {{{imageDescription}}}
  
  {{#if additionalInfo}}
  Additional information: {{{additionalInfo}}}
  {{/if}}
  
  Respond in simple, easy-to-understand language suitable for people with varying levels of health literacy.`,
});

const photoDetectionFlow = ai.defineFlow(
  {
    name: 'photoDetectionFlow',
    inputSchema: PhotoDetectionInputSchema,
    outputSchema: PhotoDetectionOutputSchema,
  },
  async (input) => {
    const { output } = await photoDetectionPrompt(input);
    return output!;
  }
);
