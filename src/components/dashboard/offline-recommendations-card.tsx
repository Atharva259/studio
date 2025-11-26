'use client';

import { useState } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { getOfflineRecommendations, OfflineRecommendationsInput, OfflineRecommendationsOutput } from '@/ai/flows/offline-recommendations';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function OfflineRecommendationsCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OfflineRecommendationsOutput | null>(null);
  const { toast } = useToast();

  const [input, setInput] = useState<OfflineRecommendationsInput>({
    produceType: 'Tomatoes',
    shipmentHistory: 'Shipped 2 tons last month to local markets.',
    location: 'Nashik, Maharashtra',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await getOfflineRecommendations(input);
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to get offline recommendations. Please try again.',
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
          <Lightbulb className="h-6 w-6 text-primary" />
          Offline Recommendations
        </CardTitle>
        <CardDescription>Get market, storage, and pricing tips for your produce.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='space-y-2'>
            <Label htmlFor='produce-type'>Produce Type</Label>
            <Input
              id="produce-type"
              value={input.produceType}
              onChange={(e) => setInput({ ...input, produceType: e.target.value })}
              placeholder="e.g., Tomatoes"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Tips'}
          </Button>
        </form>
        {result && (
          <div className="mt-4 space-y-4 rounded-lg border bg-card p-4 text-sm">
            <div>
                <h4 className="font-bold text-primary">Market Suggestion:</h4>
                <p className="text-muted-foreground">{result.marketSuggestion}</p>
            </div>
             <div>
                <h4 className="font-bold text-primary">Storage Tips:</h4>
                <p className="text-muted-foreground">{result.storageTips}</p>
            </div>
             <div>
                <h4 className="font-bold text-primary">Pricing Tips:</h4>
                <p className="text-muted-foreground">{result.pricingTips}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
