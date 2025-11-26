import Image from 'next/image';
import { AlertCircle, CloudDrizzle, Sun, Wind } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '../ui/badge';

export function WeatherCard() {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'weather-map');
  const isCyclone = true; // Hardcoded for demonstration

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Weather & Alerts</CardTitle>
        <CardDescription>Current conditions for your location.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCyclone && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold">Cyclone Alert</h4>
              <p className="text-sm">Cyclone 'Vayu' is approaching. Expected landfall in 48 hours. Secure equipment and prepare for heavy rain.</p>
            </div>
          </div>
        )}
        <div className="flex justify-around text-center p-4 rounded-lg bg-muted/50">
            <div className="flex flex-col items-center gap-1">
                <Sun className="h-8 w-8 text-accent"/>
                <span className="font-bold text-lg">32°C</span>
                <span className="text-xs text-muted-foreground">Sunny</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <CloudDrizzle className="h-8 w-8 text-primary"/>
                <span className="font-bold text-lg">45%</span>
                <span className="text-xs text-muted-foreground">Humidity</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Wind className="h-8 w-8 text-secondary-foreground"/>
                <span className="font-bold text-lg">12 km/h</span>
                <span className="text-xs text-muted-foreground">Wind</span>
            </div>
        </div>
        {mapImage && (
          <div className="overflow-hidden rounded-lg">
            <Image
              src={mapImage.imageUrl}
              alt="Weather map"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              data-ai-hint={mapImage.imageHint}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
