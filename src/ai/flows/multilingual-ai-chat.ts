// src/ai/flows/multilingual-ai-chat.ts
'use server';

/**
 * @fileOverview A multilingual AI chat interface for health-related queries.
 *
 * - multilingualAIChat - A function that handles the multilingual chat process.
 * - MultilingualAIChatInput - The input type for the multilingualAIChat function.
 * - MultilingualAIChatOutput - The return type for the multilingualAIChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MultilingualAIChatInputSchema = z.object({
  language: z.string().describe('The language in which the user wants to communicate.'),
  message: z.string().describe('The user message in their preferred language.'),
});
export type MultilingualAIChatInput = z.infer<typeof MultilingualAIChatInputSchema>;

const MultilingualAIChatOutputSchema = z.object({
  response: z.string().describe('The chatbot response in the user\u2019s preferred language.'),
});
export type MultilingualAIChatOutput = z.infer<typeof MultilingualAIChatOutputSchema>;

export async function multilingualAIChat(input: MultilingualAIChatInput): Promise<MultilingualAIChatOutput> {
  return multilingualAIChatFlow(input);
}

const multilingualAIChatPrompt = ai.definePrompt({
  name: 'multilingualAIChatPrompt',
  input: {schema: MultilingualAIChatInputSchema},
  output: {schema: MultilingualAIChatOutputSchema},
  prompt: `You are a multilingual AI chatbot designed to provide health-related information.
  The user will send a message in their preferred language, and you should respond in the same language.
  
  User Language: {{{language}}}
  User Message: {{{message}}}
  
  Response:`, // Keep it open-ended to allow the LLM to provide a natural response.
});

const multilingualAIChatFlow = ai.defineFlow(
  {
    name: 'multilingualAIChatFlow',
    inputSchema: MultilingualAIChatInputSchema,
    outputSchema: MultilingualAIChatOutputSchema,
  },
  async input => {
    const {output} = await multilingualAIChatPrompt(input);
    return output!;
  }
);
