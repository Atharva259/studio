'use client';

import { multilingualVoiceAssistant } from '@/ai/flows/multilingual-voice-assistant';
import { useToast } from '@/hooks/use-toast';
import { Mic, Loader2, Volume2, Languages } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

export function VoiceAssistantCard() {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!text) return;
    setLoading(true);
    setResponse('');
    try {
      const result = await multilingualVoiceAssistant({
        text,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });
      setResponse(result.translatedText);
      if (audioRef.current) {
        audioRef.current.src = result.audio;
        audioRef.current.play();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to process voice command.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const languages = [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'bn', name: 'Bengali' },
      { code: 'te', name: 'Telugu' },
      { code: 'mr', name: 'Marathi' },
      { code: 'ta', name: 'Tamil' },
      { code: 'gu', name: 'Gujarati' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-6 w-6 text-primary" />
          Voice Assistant
        </CardTitle>
        <CardDescription>Ask a question and get a spoken response in your chosen language.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className='space-y-2'>
            <Label className="flex items-center gap-2"><Languages className='w-4 h-4' /> Input Language</Label>
            <Select value={sourceLang} onValueChange={setSourceLang}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {languages.map(lang => <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label className="flex items-center gap-2"><Volume2 className='w-4 h-4' /> Output Language</Label>
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                 {languages.map(lang => <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="voice-input">Your Question</Label>
          <Textarea
            id="voice-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., What is the market price for tomatoes?"
          />
        </div>
        <Button onClick={handleProcess} disabled={loading || !text} className="w-full">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Process'}
        </Button>
        {response && (
          <div className="p-4 rounded-lg bg-muted text-sm">{response}</div>
        )}
        <audio ref={audioRef} className="hidden" />
      </CardContent>
    </Card>
  );
}
