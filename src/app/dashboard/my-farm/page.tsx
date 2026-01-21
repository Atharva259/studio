'use client';

import { useState, useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { Home, Loader2, PlusCircle, Trash2, X } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface FarmPlot {
  id: string;
  cropName: string;
  area: string;
}

interface FarmerProfile {
  farmPlots?: FarmPlot[];
  // other farmer properties
}

export default function MyFarmPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const farmerDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'farmers', user.uid);
  }, [firestore, user]);

  const { data: farmerData, isLoading: isFarmerDataLoading } = useDoc<FarmerProfile>(farmerDocRef);

  const [plots, setPlots] = useState<FarmPlot[]>([]);
  const [newCropName, setNewCropName] = useState('');
  const [newCropArea, setNewCropArea] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (farmerData?.farmPlots) {
      setPlots(farmerData.farmPlots);
    } else {
        setPlots([]);
    }
  }, [farmerData]);

  const handleAddPlot = () => {
    if (!newCropName.trim() || !newCropArea.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both crop name and area.',
        variant: 'destructive',
      });
      return;
    }
    const newPlot: FarmPlot = {
      id: new Date().toISOString(),
      cropName: newCropName,
      area: newCropArea,
    };
    setPlots([...plots, newPlot]);
    setNewCropName('');
    setNewCropArea('');
  };

  const handleRemovePlot = (id: string) => {
    setPlots(plots.filter((plot) => plot.id !== id));
  };

  const handleSaveChanges = async () => {
    if (!farmerDocRef) return;
    setIsSaving(true);
    try {
        const updatedData = { ...farmerData, farmPlots: plots };
        setDocumentNonBlocking(farmerDocRef, updatedData, { merge: true });

        toast({
            title: 'Success!',
            description: 'Your farm details have been saved.',
        });
    } catch (error) {
        console.error("Error saving farm details:", error);
        toast({
            title: 'Error',
            description: 'Could not save your farm details. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsSaving(false);
    }
  };

  const isLoading = isUserLoading || isFarmerDataLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <PageHeader title="My Farm" description="Customize and manage your farm plots." />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manage Your Plots</CardTitle>
            <CardDescription>Add or remove the crops you are currently cultivating.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Add a New Plot</h3>
              <div className="flex gap-4">
                <div className="w-1/2 space-y-2">
                  <Label htmlFor="crop-name">Crop Name</Label>
                  <Input
                    id="crop-name"
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    placeholder="e.g., Wheat"
                  />
                </div>
                <div className="w-1/2 space-y-2">
                  <Label htmlFor="crop-area">Area</Label>
                  <Input
                    id="crop-area"
                    value={newCropArea}
                    onChange={(e) => setNewCropArea(e.target.value)}
                    placeholder="e.g., 2 Acres"
                  />
                </div>
              </div>
              <Button onClick={handleAddPlot} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Plot
              </Button>
            </div>
            <div className="space-y-4">
               <h3 className="font-semibold text-lg">Current Plots</h3>
               {plots.length > 0 ? (
                <div className="space-y-2 rounded-md border p-4">
                    {plots.map((plot) => (
                        <div key={plot.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                            <div>
                                <p className="font-medium">{plot.cropName}</p>
                                <p className="text-sm text-muted-foreground">{plot.area}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleRemovePlot(plot.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>
               ): (
                <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                    <Home className="mx-auto h-12 w-12" />
                    <p className="mt-4">You haven&apos;t added any plots yet. Add one above to get started.</p>
                </div>
               )}
            </div>
             <Button onClick={handleSaveChanges} disabled={isSaving} className="w-full">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
             </Button>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Farm Visualization</CardTitle>
                <CardDescription>A visual overview of your farm.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="aspect-[4/3] rounded-lg p-4 bg-muted/50 grid grid-cols-4 grid-rows-3 gap-1">
                    {plots.map((plot, index) => (
                        <div key={plot.id} className="bg-primary/20 rounded-sm flex flex-col items-center justify-center text-xs font-bold text-primary-foreground shadow-inner transition-all hover:scale-105 hover:z-10 cursor-pointer relative group p-1 text-center" style={{gridArea: `span 1 / span ${index % 3 + 1}`}}>
                           <p>{plot.cropName}</p>
                           <p className="font-normal opacity-75">{plot.area}</p>
                        </div>
                    ))}
                     {plots.length === 0 && (
                        <div className="col-span-4 row-span-3 flex items-center justify-center text-muted-foreground">
                            Add plots to see your farm here.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

      </div>
    </>
  );
}
