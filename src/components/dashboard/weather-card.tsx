'use client';

import Image from 'next/image';
import { AlertCircle, CloudDrizzle, Sun, Wind, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  locationName: string;
  icon: React.ReactNode;
}

const getWeatherInfo = (code: number): { condition: string; icon: React.ReactNode } => {
  if (code === 0) return { condition: 'Clear', icon: <Sun className="h-8 w-8 text-accent"/> };
  if ([1, 2, 3].includes(code)) return { condition: 'Cloudy', icon: <Sun className="h-8 w-8 text-accent"/> };
  if ([45, 48].includes(code)) return { condition: 'Fog', icon: <CloudDrizzle className="h-8 w-8 text-primary"/> };
  if (code >= 51 && code <= 67) return { condition: 'Rain', icon: <CloudDrizzle className="h-8 w-8 text-primary"/> };
  if (code >= 80 && code <= 82) return { condition: 'Showers', icon: <CloudDrizzle className="h-8 w-8 text-primary"/> };
  if (code >= 95) return { condition: 'Thunderstorm', icon: <CloudDrizzle className="h-8 w-8 text-primary"/> };
  
  return { condition: "Cloudy", icon: <Sun className="h-8 w-8 text-accent" /> };
}


export function WeatherCard() {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'weather-map');
  
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    const fetchWeatherData = async (lat: number, lon: number) => {
        try {
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&wind_speed_unit=kmh`);
            if (!weatherResponse.ok) {
                throw new Error("Failed to fetch weather data.");
            }
            const weatherData = await weatherResponse.json();

            const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`);
            if(!locationResponse.ok) {
                throw new Error("Failed to fetch location data.");
            }
            const locationData = await locationResponse.json();
            
            const locationName = locationData.results?.[0]?.name ? `${locationData.results[0].name}, ${locationData.results[0].country_code}` : "Your Location";
            
            const { condition, icon } = getWeatherInfo(weatherData.current.weather_code);

            setWeather({
                temp: Math.round(weatherData.current.temperature_2m),
                condition: condition,
                humidity: weatherData.current.relative_humidity_2m,
                windSpeed: Math.round(weatherData.current.wind_speed_10m),
                locationName: locationName,
                icon: icon,
            });

        } catch (err: any) {
            console.error("Weather fetch error:", err);
            setError("Could not retrieve weather information.");
            toast({
                title: "Weather Error",
                description: "Could not retrieve weather information.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }

    const handleLocationError = (error: GeolocationPositionError) => {
        let errorMessage = "An unknown error occurred.";
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "Location permission denied. Please enable it in your browser settings.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                errorMessage = "The request to get user location timed out.";
                break;
        }
        setError(errorMessage);
        setLoading(false);
        toast({
          title: "Weather Error",
          description: errorMessage,
          variant: "destructive"
        })
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        handleLocationError
    );

  }, [toast]);


  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Weather</CardTitle>
        <CardDescription>{loading ? "Fetching your location..." : error ? "Could not fetch weather" : `Current conditions for ${weather?.locationName}`}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
             <div className="flex items-center justify-center h-[150px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}

        {error && !loading && (
             <div className="p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold">Error</h4>
                  <p className="text-sm">{error}</p>
                </div>
            </div>
        )}

        {weather && !loading && !error && (
            <>
                <div className="flex justify-around text-center p-4 rounded-lg bg-muted/50">
                    <div className="flex flex-col items-center gap-1">
                        {weather.icon}
                        <span className="font-bold text-lg">{weather.temp}°C</span>
                        <span className="text-xs text-muted-foreground">{weather.condition}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <CloudDrizzle className="h-8 w-8 text-primary"/>
                        <span className="font-bold text-lg">{weather.humidity}%</span>
                        <span className="text-xs text-muted-foreground">Humidity</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Wind className="h-8 w-8 text-secondary-foreground"/>
                        <span className="font-bold text-lg">{weather.windSpeed} km/h</span>
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
            </>
        )}
      </CardContent>
    </Card>
  );
}
