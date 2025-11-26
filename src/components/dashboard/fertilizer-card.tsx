import { Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function FertilizerCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-green-600"/>
                    A Note on Fertilizers
                </CardTitle>
                <CardDescription>Embracing sustainable farming.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    While chemical fertilizers may promise quick results, long-term soil health and sustainability are key to lasting success. 
                    This platform encourages exploring organic and natural farming techniques. We believe that healthy soil creates healthy crops and a healthier income for farmers, free from dependency on costly chemical inputs.
                </p>
            </CardContent>
        </Card>
    )
}
