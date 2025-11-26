'use client';

import { pestControlAgent, PestControlAgentOutput } from '@/ai/flows/pest-control-agent';
import { useToast } from '@/hooks/use-toast';
import { Bug, Camera, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Image from 'next/image';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

export function PestControlCard() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [cropType, setCropType] = useState('Tomato');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PestControlAgentOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!photo) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await pestControlAgent({ photoDataUri: photo, cropType });
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Identifying Pest',
        description: 'Could not analyze the image. Please try another one.',
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
          <Bug className="h-6 w-6 text-primary" />
          Smart Pest Control
        </CardTitle>
        <CardDescription>Upload a photo to identify pests and get control recommendations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="crop-type-pest">Crop Type</Label>
          <Input id="crop-type-pest" value={cropType} onChange={(e) => setCropType(e.target.value)} placeholder="e.g., Tomato" />
        </div>
        <div className="space-y-2">
          <Label>Pest/Damage Photo</Label>
          <div
            className="relative flex justify-center items-center h-40 w-full border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {photo ? (
              <Image src={photo} alt="Uploaded pest" fill className="object-contain rounded-lg p-1" />
            ) : (
              <div className="text-center text-muted-foreground">
                <Camera className="mx-auto h-8 w-8" />
                <p className="mt-1 text-sm">Click to upload photo</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        <Button onClick={handleIdentify} disabled={loading || !photo} className="w-full">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Bug className="mr-2 h-4 w-4" /> Identify Pest</>}
        </Button>

        {result && (
          <div className="mt-4 space-y-4 rounded-lg border bg-card p-4 text-sm">
            {result.isPest ? (
               <>
                 <div className='flex justify-between items-center'>
                    <h4 className="font-bold text-lg text-primary">{result.pestIdentification}</h4>
                    <Badge variant={result.confidenceScore > 0.7 ? 'default' : 'secondary'}>
                        {Math.round(result.confidenceScore * 100)}% Confidence
                    </Badge>
                 </div>
                <div>
                    <h5 className="font-semibold mb-1">Recommended Actions:</h5>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {result.recommendedActions.map((action, i) => <li key={i}>{action}</li>)}
                    </ul>
                </div>
                 <div>
                    <h5 className="font-semibold mb-1">Preventative Tips:</h5>
                    <p className="text-muted-foreground">{result.preventativeTips}</p>
                </div>
               </>
            ): (
                <div className="text-center text-muted-foreground">
                    <p>No pest could be confidently identified in the image.</p>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
