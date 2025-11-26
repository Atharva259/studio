import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const technologies = [
    {
        title: "Agricultural Drones",
        description: "Enhance crop monitoring, spraying, and health assessment with high-precision aerial data. Drones help in early detection of pests and nutrient deficiencies, optimizing input usage.",
        company: "AeroSeed Technologies",
        image: PlaceHolderImages.find((img) => img.id === 'tech-drone'),
    },
    {
        title: "Smart Irrigation Systems",
        description: "Automate watering schedules based on real-time soil moisture and weather data. These systems conserve water, reduce labor costs, and prevent over-watering or under-watering.",
        company: "AquaCrop Solutions",
        image: PlaceHolderImages.find((img) => img.id === 'tech-irrigation'),
    },
    {
        title: "AI-Powered Soil Sensors",
        description: "Get detailed insights into your soil's health, including NPK values, pH, and moisture levels. Make data-driven decisions for fertilizer application and soil treatment.",
        company: "TerraIntel Labs",
        image: null,
    },
     {
        title: "Automated Weeders",
        description: "Robotic weeders that use computer vision to identify and remove weeds without harming crops, reducing the need for manual labor and herbicides.",
        company: "FarmBotics India",
        image: null,
    }
];

export default function TechHubPage() {
    return (
        <>
            <PageHeader
                title="Tech Hub"
                description="Discover the latest technologies transforming Indian agriculture."
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {technologies.map((tech) => (
                    <Card key={tech.title} className="flex flex-col">
                        {tech.image && (
                            <div className="relative h-48 w-full">
                                <Image
                                    src={tech.image.imageUrl}
                                    alt={tech.title}
                                    fill
                                    className="object-cover rounded-t-lg"
                                    data-ai-hint={tech.image.imageHint}
                                />
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle>{tech.title}</CardTitle>
                            <CardDescription>by <span className="font-semibold text-primary">{tech.company}</span></CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground">{tech.description}</p>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button variant="outline" className="w-full">Learn More</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    )
}
