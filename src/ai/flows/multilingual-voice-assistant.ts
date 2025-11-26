'use server';

/**
 * @fileOverview A multilingual voice assistant flow.
 *
 * - multilingualVoiceAssistant - A function that translates input to English, processes it, and responds in the user's language.
 * - MultilingualVoiceAssistantInput - The input type for the multilingualVoiceAssistant function.
 * - MultilingualVoiceAssistantOutput - The return type for the multilingualVoiceAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {google} from 'googleapis';
import wav from 'wav';

const MultilingualVoiceAssistantInputSchema = z.object({
  text: z.string().describe('The input text in the user\'s language.'),
  sourceLanguage: z.string().describe('The language of the input text (e.g., \'en\' for English, \'es\' for Spanish).'),
  targetLanguage: z.string().describe('The desired language for the response (e.g., \'en\' for English, \'es\' for Spanish).'),
});
export type MultilingualVoiceAssistantInput = z.infer<typeof MultilingualVoiceAssistantInputSchema>;

const MultilingualVoiceAssistantOutputSchema = z.object({
  translatedText: z.string().describe('The translated text in the target language.'),
  audio: z.string().describe('The audio data in WAV format as a data URI.'),
});
export type MultilingualVoiceAssistantOutput = z.infer<typeof MultilingualVoiceAssistantOutputSchema>;

export async function multilingualVoiceAssistant(input: MultilingualVoiceAssistantInput): Promise<MultilingualVoiceAssistantOutput> {
  return multilingualVoiceAssistantFlow(input);
}

const translateText = async (text: string, sourceLanguage: string, targetLanguage: string): Promise<string> => {
  const translate = google.translate('v2');
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY is not set in environment variables.');
  }

  translate.translate.key = apiKey;

  const request = {
    q: text,
    source: sourceLanguage,
    target: targetLanguage,
  };

  try {
    const response = await translate.translations.list(request);
    return response.data.translations?.[0]?.translatedText || 'Translation failed';
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Translation failed');
  }
};


const textToSpeech = async (text: string): Promise<string> => {
  const { media } = await ai.generate({
    model: 'googleai/gemini-2.5-flash-preview-tts',
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Algenib' },
        },
      },
    },
    prompt: text,
  });
  if (!media) {
    throw new Error('no media returned');
  }
  const audioBuffer = Buffer.from(
    media.url.substring(media.url.indexOf(',') + 1),
    'base64'
  );
  return 'data:audio/wav;base64,' + (await toWav(audioBuffer));
};

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const multilingualVoiceAssistantFlow = ai.defineFlow(
  {
    name: 'multilingualVoiceAssistantFlow',
    inputSchema: MultilingualVoiceAssistantInputSchema,
    outputSchema: MultilingualVoiceAssistantOutputSchema,
  },
  async input => {
    // Translate the input text to English.
    const englishText = await translateText(input.text, input.sourceLanguage, 'en');

    // TODO: Implement your AI logic here to process the English text
    // and generate a response.
    const aiResponse = `This is a placeholder response based on your input: ${englishText}`;

    // Translate the AI response to the target language.
    const translatedText = await translateText(aiResponse, 'en', input.targetLanguage);

    // Convert the translated text to speech.
    const audio = await textToSpeech(translatedText);

    return {translatedText, audio};
  }
);
