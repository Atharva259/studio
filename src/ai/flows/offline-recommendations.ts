// src/ai/flows/offline-recommendations.ts
'use server';

/**
 * @fileOverview Provides offline recommendations to farmers on market suggestions, storage, and pricing tips based on their produce and shipment history.
 *
 * - getOfflineRecommendations - A function that retrieves offline recommendations for farmers.
 * - OfflineRecommendationsInput - The input type for the getOfflineRecommendations function.
 * - OfflineRecommendationsOutput - The return type for the getOfflineRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OfflineRecommendationsInputSchema = z.object({
  produceType: z.string().describe('The type of produce (e.g., tomatoes, corn).'),
  shipmentHistory: z.string().describe('A summary of the farmer\'s past shipments, including dates, quantities, and destinations.'),
  location: z.string().describe('The farmer\'s current location.'),
  relevantContext: z.string().optional().describe('Any relevant context about the farmer, such as recent weather conditions or local market trends.')
});
export type OfflineRecommendationsInput = z.infer<typeof OfflineRecommendationsInputSchema>;

const OfflineRecommendationsOutputSchema = z.object({
  marketSuggestion: z.string().describe('A suggestion for the best market to sell the produce.'),
  storageTips: z.string().describe('Tips for storing the produce to maximize its shelf life.'),
  pricingTips: z.string().describe('Advice on how to price the produce for optimal profit.'),
});
export type OfflineRecommendationsOutput = z.infer<typeof OfflineRecommendationsOutputSchema>;

export async function getOfflineRecommendations(input: OfflineRecommendationsInput): Promise<OfflineRecommendationsOutput> {
  return offlineRecommendationsFlow(input);
}

const offlineRecommendationsPrompt = ai.definePrompt({
  name: 'offlineRecommendationsPrompt',
  input: {schema: OfflineRecommendationsInputSchema},
  output: {schema: OfflineRecommendationsOutputSchema},
  prompt: `You are an agricultural advisor providing offline recommendations to farmers.

  Based on the farmer's produce type, shipment history, and current location, provide the following:
  - marketSuggestion: A suggestion for the best market to sell the produce.
  - storageTips: Tips for storing the produce to maximize its shelf life.
  - pricingTips: Advice on how to price the produce for optimal profit.

  Produce Type: {{{produceType}}}
  Shipment History: {{{shipmentHistory}}}
  Location: {{{location}}}
  
  {{#if relevantContext}}
  Relevant Context: {{{relevantContext}}}
  {{/if}}
  `,
});

const offlineRecommendationsFlow = ai.defineFlow(
  {
    name: 'offlineRecommendationsFlow',
    inputSchema: OfflineRecommendationsInputSchema,
    outputSchema: OfflineRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await offlineRecommendationsPrompt(input);
    return output!;
  }
);
