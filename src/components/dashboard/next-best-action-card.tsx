'use client';

import { useState } from 'react';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { nextBestActions, NextBestActionsInput, NextBestActionsOutput } from '@/ai/flows/next-best-actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

export function NextBestActionCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NextBestActionsOutput | null>(null);
  const { toast } = useToast();

  const [input, setInput] = useState<NextBestActionsInput>({
    cropType: 'Wheat',
    location: 'Punjab, India',
    currentConditions: 'Post-harvest, dry soil, expecting monsoon in 4-6 weeks.',
    historicalData: 'Last season had a 10% lower yield due to delayed pest control.',
    farmerContext: 'Looking to improve soil health before the next sowing season.'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await nextBestActions(input);
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to get recommendations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          AI: Next Best Actions
        </CardTitle>
        <CardDescription>Get AI-powered suggestions for your crops based on current conditions.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='space-y-2'>
            <Label htmlFor='current-conditions'>Describe current situation</Label>
            <Textarea
              id="current-conditions"
              value={input.currentConditions}
              onChange={(e) => setInput({ ...input, currentConditions: e.target.value })}
              placeholder="e.g., Post-harvest, dry soil..."
              rows={3}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Suggestions'}
          </Button>
        </form>
        {result && (
          <div className="mt-4 space-y-4 rounded-lg border bg-card p-4">
            <div>
                <h4 className="font-bold mb-2 text-primary">Suggestions:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                {result.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                ))}
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-2 text-primary">Reasoning:</h4>
                <p className="text-sm text-muted-foreground">{result.reasoning}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
