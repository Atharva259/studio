'use server';
/**
 * @fileOverview An AI agent for identifying pests and recommending control measures.
 *
 * - pestControlAgent - A function that handles the pest identification and control recommendation process.
 * - PestControlAgentInput - The input type for the pestControlAgent function.
 * - PestControlAgentOutput - The return type for the pestControlAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PestControlAgentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the suspected pest or affected plant part, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  cropType: z.string().describe('The type of crop affected (e.g., "Tomato", "Wheat").'),
});
export type PestControlAgentInput = z.infer<typeof PestControlAgentInputSchema>;

const PestControlAgentOutputSchema = z.object({
  pestIdentification: z.string().describe('The common name of the identified pest (e.g., "Aphid", "Whitefly"). If no pest is identified, this should state "Unknown".'),
  isPest: z.boolean().describe('Whether a pest was confidently identified in the image.'),
  confidenceScore: z.number().describe('A confidence score (0.0 to 1.0) for the pest identification.'),
  recommendedActions: z.array(z.string()).describe('A list of recommended actions to control the identified pest, prioritizing organic and sustainable methods.'),
  preventativeTips: z.string().describe('Tips to prevent future infestations of this pest.'),
});
export type PestControlAgentOutput = z.infer<typeof PestControlAgentOutputSchema>;

export async function pestControlAgent(input: PestControlAgentInput): Promise<PestControlAgentOutput> {
  return pestControlAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pestControlAgentPrompt',
  input: {schema: PestControlAgentInputSchema},
  output: {schema: PestControlAgentOutputSchema},
  prompt: `You are an expert entomologist and plant pathologist for Indian agriculture.

Analyze the provided image and information to identify the pest affecting the crop.

Crop Type: {{{cropType}}}
Image of pest/damage: {{media url=photoDataUri}}

1.  **Identify the pest.** Determine the common name of the pest. If you cannot identify a pest with high confidence, state "Unknown".
2.  **Assess confidence.** Provide a confidence score for your identification.
3.  **Recommend Actions.** Provide a list of specific, actionable control measures. Prioritize organic and integrated pest management (IPM) techniques (e.g., introducing beneficial insects, using neem oil, setting traps) before suggesting chemical pesticides. If chemicals are necessary, recommend specific types and safe application methods for the Indian context.
4.  **Provide Prevention Tips.** Offer advice on how to prevent this pest from appearing in the future.

Your response must be in a structured JSON format.`,
});

const pestControlAgentFlow = ai.defineFlow(
  {
    name: 'pestControlAgentFlow',
    inputSchema: PestControlAgentInputSchema,
    outputSchema: PestControlAgentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
