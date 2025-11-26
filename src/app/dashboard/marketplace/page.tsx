import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";

const cropPrices = [
    { crop: 'Wheat', price: '₹2,125', unit: 'Quintal', change: 1.2, trend: 'up' },
    { crop: 'Rice (Basmati)', price: '₹3,500', unit: 'Quintal', change: -0.8, trend: 'down' },
    { crop: 'Tomatoes', price: '₹25', unit: 'kg', change: 5.5, trend: 'up' },
    { crop: 'Onions', price: '₹18', unit: 'kg', change: 2.1, trend: 'up' },
    { crop: 'Potatoes', price: '₹15', unit: 'kg', change: -3.0, trend: 'down' },
    { crop: 'Sugarcane', price: '₹315', unit: 'Quintal', change: 0.5, trend: 'up' },
    { crop: 'Cotton', price: '₹7,800', unit: 'Quintal', change: -1.5, trend: 'down' },
    { crop: 'Mango (Alphonso)', price: '₹1,200', unit: 'Dozen', change: 10.2, trend: 'up' },
];

export default function MarketplacePage() {
    return (
        <>
            <PageHeader 
                title="Crop Marketplace"
                description="Live prices for various crops across Indian markets."
            />

            <Card>
                <CardHeader>
                    <CardTitle>Market Prices</CardTitle>
                    <CardDescription>All prices are indicative and sourced from major mandis.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Crop</TableHead>
                                <TableHead>Current Price</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead className="text-right">24h Change</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cropPrices.map((item) => (
                                <TableRow key={item.crop}>
                                    <TableCell className="font-medium">{item.crop}</TableCell>
                                    <TableCell className="font-mono text-lg">{item.price}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={item.trend === 'up' ? 'default' : 'destructive'} className="flex items-center justify-center gap-1 w-20 ml-auto">
                                            {item.trend === 'up' ? 
                                                <ArrowUp className="h-4 w-4"/> : 
                                                <ArrowDown className="h-4 w-4"/>
                                            }
                                            <span>{item.change.toFixed(1)}%</span>
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}
