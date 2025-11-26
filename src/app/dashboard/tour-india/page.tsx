import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const regions = [
    {
        title: "Punjab - The Granary of India",
        description: "Known for its vast, fertile plains and extensive canal irrigation system, Punjab is a leader in wheat and rice production. Explore the heart of the Green Revolution and its modern farming practices.",
        keyCrops: "Wheat, Rice, Cotton",
        image: PlaceHolderImages.find((img) => img.id === 'tour-punjab'),
    },
    {
        title: "Kerala - The Spice Garden of India",
        description: "With its tropical climate and high rainfall, Kerala is famous for its spices like pepper, cardamom, and cloves. The state also has extensive plantations of rubber, tea, and coffee.",
        keyCrops: "Spices, Rubber, Coconuts",
        image: PlaceHolderImages.find((img) => img.id === 'tour-kerala'),
    },
    {
        title: "Maharashtra - The Orchard State",
        description: "A leading producer of fruits like mangoes, grapes, and bananas. The state's diverse agro-climatic zones also support major crops like sugarcane, cotton, and onions.",
        keyCrops: "Sugarcane, Grapes, Mangoes",
        image: null,
    },
     {
        title: "Gujarat - The Cotton Belt",
        description: "Gujarat is the largest producer of cotton in India. It's also a major producer of groundnuts, castor seeds, and other cash crops, supported by innovative irrigation like the Sardar Sarovar Project.",
        keyCrops: "Cotton, Groundnuts, Castor",
        image: null,
    }
];

export default function TourIndiaPage() {
    return (
        <>
            <PageHeader
                title="Tour India's Agriculture"
                description="Discover the diverse and vibrant agricultural landscapes of India."
            />

            <div className="grid gap-6 md:grid-cols-2">
                {regions.map((region) => (
                    <Card key={region.title} className="overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            <div className="relative h-48 md:h-full w-full">
                                {region.image ? (
                                    <Image
                                        src={region.image.imageUrl}
                                        alt={region.title}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={region.image.imageHint}
                                    />
                                ) : (
                                    <div className="bg-muted h-full w-full flex items-center justify-center">
                                        <span className="text-muted-foreground text-sm">Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{region.title}</CardTitle>
                                    <CardDescription>Key Crops: {region.keyCrops}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground">{region.description}</p>
                                </CardContent>
                                <div className="p-6 pt-0">
                                    <Button variant="secondary" className="w-full">Explore Region</Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    )
}
