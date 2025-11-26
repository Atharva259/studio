'use server';

/**
 * @fileOverview An AI chatbot for farmers to answer questions about farming, crop management, and market trends.
 *
 * - unlimitedAiChatbot - A function that handles the chatbot interaction.
 * - UnlimitedAiChatbotInput - The input type for the unlimitedAiChatbot function.
 * - UnlimitedAiChatbotOutput - The return type for the unlimitedAiChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UnlimitedAiChatbotInputSchema = z.object({
  query: z.string().describe('The question from the farmer.'),
});
export type UnlimitedAiChatbotInput = z.infer<typeof UnlimitedAiChatbotInputSchema>;

const UnlimitedAiChatbotOutputSchema = z.object({
  response: z.string().describe('The AI chatbot response to the farmer.'),
});
export type UnlimitedAiChatbotOutput = z.infer<typeof UnlimitedAiChatbotOutputSchema>;

export async function unlimitedAiChatbot(input: UnlimitedAiChatbotInput): Promise<UnlimitedAiChatbotOutput> {
  return unlimitedAiChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'unlimitedAiChatbotPrompt',
  input: {schema: UnlimitedAiChatbotInputSchema},
  output: {schema: UnlimitedAiChatbotOutputSchema},
  prompt: `You are a helpful AI assistant for farmers. Your goal is to provide informative and helpful answers to their questions about farming, crop management, market trends, and any other related topics.

Question: {{{query}}}

Response:`, 
});

const unlimitedAiChatbotFlow = ai.defineFlow(
  {
    name: 'unlimitedAiChatbotFlow',
    inputSchema: UnlimitedAiChatbotInputSchema,
    outputSchema: UnlimitedAiChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
