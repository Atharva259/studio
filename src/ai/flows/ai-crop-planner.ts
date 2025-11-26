// Define the types for the tool input and output
// Implement the AI crop planner flow.

'use server';
/**
 * @fileOverview An AI crop planning agent.
 *
 * - aiCropPlanner - A function that handles the crop planning process.
 * - AiCropPlannerInput - The input type for the aiCropPlanner function.
 * - AiCropPlannerOutput - The return type for the aiCropPlanner function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiCropPlannerInputSchema = z.object({
  landSize: z.string().describe('The size of the land in square feet.'),
  soilType: z.string().describe('The type of soil on the land.'),
  climate: z.string().describe('The climate of the region.'),
  availableCrops: z.string().describe('The crops that can be planted.'),
  farmerGoals: z.string().describe('The goals of the farmer, such as maximizing profit or yield.'),
  pastCropHistory: z.string().describe('A description of the crop history.'),
});
export type AiCropPlannerInput = z.infer<typeof AiCropPlannerInputSchema>;

const AiCropPlannerOutputSchema = z.object({
  cropPlan: z.string().describe('The optimal crop plan for the land.'),
  utilizationPercentage: z.number().describe('The percentage of land utilized.'),
  expectedYield: z.string().describe('The expected yield from the crop plan.'),
});
export type AiCropPlannerOutput = z.infer<typeof AiCropPlannerOutputSchema>;

export async function aiCropPlanner(input: AiCropPlannerInput): Promise<AiCropPlannerOutput> {
  return aiCropPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCropPlannerPrompt',
  input: {schema: AiCropPlannerInputSchema},
  output: {schema: AiCropPlannerOutputSchema},
  prompt: `You are an expert agricultural planner.

You will receive information about the land, soil, climate, available crops, and the farmer's goals.

Based on this information, you will create an optimal crop plan that maximizes land utilization and crop yield.

Land Size: {{{landSize}}}
Soil Type: {{{soilType}}}
Climate: {{{climate}}}
Available Crops: {{{availableCrops}}}
Farmer Goals: {{{farmerGoals}}}
Past Crop History: {{{pastCropHistory}}}

Consider the following factors when creating the crop plan:

* Land utilization: Maximize the percentage of land utilized for planting.
* Crop yield: Choose crops that are well-suited to the soil and climate.
* Profitability: Consider the market demand for different crops.
* Sustainability: Promote sustainable farming practices.

Output the crop plan, the percentage of land utilized, and the expected yield.
Ensure that the crop plan is well-organized and easy to understand.
`,
});

const aiCropPlannerFlow = ai.defineFlow(
  {
    name: 'aiCropPlannerFlow',
    inputSchema: AiCropPlannerInputSchema,
    outputSchema: AiCropPlannerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
