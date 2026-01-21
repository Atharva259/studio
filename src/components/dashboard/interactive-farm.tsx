'use client';

import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { Loader2, Sprout } from 'lucide-react';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FarmPlot {
  id: string;
  cropName: string;
  area: string;
}

interface FarmerProfile {
  farmPlots?: FarmPlot[];
}

export function InteractiveFarm() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const farmerDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'farmers', user.uid);
  }, [firestore, user]);

  const { data: farmerData, isLoading: isFarmerDataLoading } = useDoc<FarmerProfile>(farmerDocRef);

  const plots = farmerData?.farmPlots || [];
  const isLoading = isUserLoading || isFarmerDataLoading;

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Sprout className="h-6 w-6" />
            My Farm
        </CardTitle>
        <CardDescription>A visual overview of your farm plots.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : plots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-3 aspect-[4/3] rounded-lg p-4 bg-muted/50 flex flex-wrap gap-2 content-start">
                {plots.map((plot) => (
                    <div key={plot.id} className="bg-primary/20 rounded-md flex flex-col items-center justify-center text-xs text-center font-bold text-primary-foreground shadow-inner p-2 flex-grow transition-all hover:scale-105 cursor-pointer basis-1/4">
                        <p>{plot.cropName}</p>
                        <p className="font-normal opacity-75">{plot.area}</p>
                    </div>
                ))}
              </div>
              <div className="md:col-span-2">
                <h3 className="font-bold mb-2">Crop Distribution</h3>
                <ul className="space-y-2">
                  {plots.map((plot) => (
                    <li key={plot.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full bg-primary/40" />
                        <span>{plot.cropName}</span>
                      </div>
                      <span className="font-mono text-muted-foreground">{plot.area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-center p-4 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">You haven't added any farm plots yet.</p>
                <Button asChild>
                    <Link href="/dashboard/my-farm">
                        Manage Your Farm
                    </Link>
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
