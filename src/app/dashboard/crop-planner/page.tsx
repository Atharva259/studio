'use client';

import { useState } from 'react';
import { Brain, Loader2, LandPlot, Maximize } from 'lucide-react';
import { aiCropPlanner, AiCropPlannerInput, AiCropPlannerOutput } from '@/ai/flows/ai-crop-planner';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function CropPlannerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiCropPlannerOutput | null>(null);
  const { toast } = useToast();

  const [input, setInput] = useState<AiCropPlannerInput>({
    landSize: '5 acres',
    soilType: 'Loamy soil, slightly acidic',
    climate: 'Tropical monsoon, average rainfall 1200mm',
    availableCrops: 'Rice, Wheat, Sugarcane, Cotton, Mangoes',
    farmerGoals: 'Maximize profit while maintaining soil health for next season.',
    pastCropHistory: 'Last 2 seasons were rice, followed by a fallow period.',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await aiCropPlanner(input);
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate crop plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="AI Crop Planner"
        description="Let our AI generate an optimal crop plan for your farm."
      />
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Farm Details</CardTitle>
              <CardDescription>Provide information about your farm.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="landSize">Land Size</Label>
                  <Input name="landSize" value={input.landSize} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Input name="soilType" value={input.soilType} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="climate">Climate</Label>
                  <Input name="climate" value={input.climate} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableCrops">Available Crops</Label>
                  <Textarea name="availableCrops" value={input.availableCrops} onChange={handleInputChange} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmerGoals">Your Goals</Label>
                  <Textarea name="farmerGoals" value={input.farmerGoals} onChange={handleInputChange} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pastCropHistory">Past Crop History</Label>
                  <Textarea name="pastCropHistory" value={input.pastCropHistory} onChange={handleInputChange} rows={3} />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Brain className="mr-2 h-4 w-4" /> Generate Plan</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-7 lg:col-span-8">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Generated Crop Plan</CardTitle>
                    <CardDescription>
                        {loading ? "Generating your optimized plan..." : result ? "Here is your AI-generated plan." : "Your plan will appear here."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && <div className="flex items-center justify-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}
                    {result && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold flex items-center gap-2"><LandPlot className="w-5 h-5 text-primary" /> Crop Plan</h3>
                                <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-muted p-4 font-body text-sm">{result.cropPlan}</pre>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold flex items-center gap-2"><Maximize className="w-5 h-5 text-primary" /> Land Utilization</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <Progress value={result.utilizationPercentage} className="w-full" />
                                    <span className="font-bold font-mono text-lg text-primary">{result.utilizationPercentage}%</span>
                                </div>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold">Expected Yield</h3>
                                <p className="mt-2 text-muted-foreground">{result.expectedYield}</p>
                            </div>
                        </div>
                    )}
                    {!loading && !result && (
                         <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
                            <Brain className="h-12 w-12 text-muted-foreground/50"/>
                            <p className="mt-4 text-muted-foreground">Fill in your farm details to generate a plan.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
