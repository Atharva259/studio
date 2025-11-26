'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing farmers with AI-powered suggestions for next best actions
 * to improve their crops, based on current conditions and historical data.
 *
 * - nextBestActions - A function that handles the retrieval of the next best actions for a farmer.
 * - NextBestActionsInput - The input type for the nextBestActions function.
 * - NextBestActionsOutput - The return type for the nextBestActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NextBestActionsInputSchema = z.object({
  cropType: z.string().describe('The type of crop the farmer is growing.'),
  location: z.string().describe('The geographical location of the farm.'),
  currentConditions: z.string().describe('A description of the current weather and environmental conditions.'),
  historicalData: z.string().describe('Historical data about past harvests, yields, and issues.'),
  farmerContext: z.string().optional().describe('Any additional information about the farmer or their farm.'),
});
export type NextBestActionsInput = z.infer<typeof NextBestActionsInputSchema>;

const NextBestActionsOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('A list of suggested actions for the farmer to take.')
  ).describe('AI-powered suggestions for the next best actions for the farmer to improve their crops.'),
  reasoning: z.string().describe('Explanation of the reasoning behind the suggestions.'),
});
export type NextBestActionsOutput = z.infer<typeof NextBestActionsOutputSchema>;

export async function nextBestActions(input: NextBestActionsInput): Promise<NextBestActionsOutput> {
  return nextBestActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'nextBestActionsPrompt',
  input: {schema: NextBestActionsInputSchema},
  output: {schema: NextBestActionsOutputSchema},
  prompt: `You are an AI assistant providing expert agricultural advice to farmers.

  Based on the following information, provide a list of the next best actions the farmer should take to improve their crops.
  Explain the reasoning behind each suggestion.

  Crop Type: {{{cropType}}}
  Location: {{{location}}}
  Current Conditions: {{{currentConditions}}}
  Historical Data: {{{historicalData}}}
  Farmer Context: {{{farmerContext}}}

  Format your response as a JSON object with "suggestions" (an array of strings) and "reasoning" (a string).
  `,
});

const nextBestActionsFlow = ai.defineFlow(
  {
    name: 'nextBestActionsFlow',
    inputSchema: NextBestActionsInputSchema,
    outputSchema: NextBestActionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
