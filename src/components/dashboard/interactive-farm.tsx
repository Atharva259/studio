'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sprout } from 'lucide-react';

const crops = [
  { id: 'wheat', name: 'Wheat', color: 'hsl(45, 80%, 70%)', area: '2 Acres' },
  { id: 'corn', name: 'Corn', color: 'hsl(55, 90%, 60%)', area: '1.5 Acres' },
  { id: 'tomato', name: 'Tomatoes', color: 'hsl(10, 80%, 60%)', area: '0.5 Acres' },
  { id: 'potato', name: 'Potatoes', color: 'hsl(35, 40%, 70%)', area: '1 Acre' },
  { id: 'fallow', name: 'Fallow', color: 'hsl(30, 25%, 60%)', area: '0.5 Acres' },
];

export function InteractiveFarm() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Sprout className="h-6 w-6" />
            My Farm
        </CardTitle>
        <CardDescription>A visual overview of your farm plots.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-3 aspect-[4/3] rounded-lg p-4 bg-muted/50 grid grid-cols-4 grid-rows-3 gap-1">
            <div className="col-span-2 row-span-2 bg-[hsl(45,80%,70%)] rounded-sm flex items-center justify-center text-xs font-bold text-background shadow-inner transition-all hover:scale-105 cursor-pointer">Wheat</div>
            <div className="col-span-2 row-span-1 bg-[hsl(55,90%,60%)] rounded-sm flex items-center justify-center text-xs font-bold text-background shadow-inner transition-all hover:scale-105 cursor-pointer">Corn</div>
            <div className="col-span-1 row-span-1 bg-[hsl(10,80%,60%)] rounded-sm flex items-center justify-center text-xs font-bold text-background shadow-inner transition-all hover:scale-105 cursor-pointer">Tomatoes</div>
            <div className="col-span-2 row-span-1 bg-[hsl(35,40%,70%)] rounded-sm flex items-center justify-center text-xs font-bold text-background shadow-inner transition-all hover:scale-105 cursor-pointer">Potatoes</div>
            <div className="col-span-1 row-span-1 bg-[hsl(30,25%,60%)] rounded-sm flex items-center justify-center text-xs font-bold text-background shadow-inner transition-all hover:scale-105 cursor-pointer">Fallow</div>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-bold mb-2">Crop Distribution</h3>
            <ul className="space-y-2">
              {crops.map((crop) => (
                <li key={crop.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full" style={{ backgroundColor: crop.color }} />
                    <span>{crop.name}</span>
                  </div>
                  <span className="font-mono text-muted-foreground">{crop.area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
