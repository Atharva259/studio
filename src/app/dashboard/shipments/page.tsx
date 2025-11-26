import { MoreHorizontal, PlusCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/page-header';

const shipments = [
    { id: 'SH-312F4', produce: 'Tomatoes', weight: '500 kg', destination: 'Mumbai', status: 'Delivered', driver: 'Ravi Kumar', cost: '₹3,500' },
    { id: 'SH-A4B1C', produce: 'Onions', weight: '1.2 Ton', destination: 'Delhi', status: 'In Transit', driver: 'Sanjay Patel', cost: '₹8,200' },
    { id: 'SH-D9E8F', produce: 'Wheat', weight: '5 Ton', destination: 'Jaipur', status: 'Delivered', driver: 'Amit Singh', cost: '₹22,000' },
    { id: 'SH-G7H6J', produce: 'Potatoes', weight: '2 Ton', destination: 'Pune', status: 'Pending', driver: 'N/A', cost: '₹11,500' },
    { id: 'SH-K5L4M', produce: 'Apples', weight: '800 kg', destination: 'Shimla', status: 'Cancelled', driver: 'N/A', cost: '₹6,000' },
];

const statusVariant: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Delivered': 'default',
    'In Transit': 'secondary',
    'Pending': 'outline',
    'Cancelled': 'destructive',
};

export default function ShipmentsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <PageHeader
            title="Manage Shipments"
            description="Track your produce from farm to market."
        />
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Shipment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment History</CardTitle>
          <CardDescription>A list of all your recent shipments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Produce</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">{shipment.id}</TableCell>
                  <TableCell>{shipment.produce}</TableCell>
                  <TableCell>{shipment.weight}</TableCell>
                  <TableCell>{shipment.destination}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[shipment.status] || 'default'}>{shipment.status}</Badge>
                  </TableCell>
                  <TableCell>{shipment.driver}</TableCell>
                  <TableCell className="text-right font-mono">{shipment.cost}</TableCell>
                   <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Contact Driver</DropdownMenuItem>
                         <DropdownMenuItem className="text-destructive">Cancel Shipment</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
