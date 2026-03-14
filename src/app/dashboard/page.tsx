import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { InteractiveFarm } from "@/components/dashboard/interactive-farm";
import { WeatherCard } from "@/components/dashboard/weather-card";
import { NextBestActionCard } from "@/components/dashboard/next-best-action-card";
import { VoiceAssistantCard } from "@/components/dashboard/voice-assistant-card";
import { FertilizerCard } from "@/components/dashboard/fertilizer-card";
import { OfflineRecommendationsCard } from "@/components/dashboard/offline-recommendations-card";
import Link from "next/link";
import { PestControlCard } from "@/components/dashboard/pest-control-card";

const InteractiveFarm = dynamic(() =>
  import("@/components/dashboard/interactive-farm")
);

const WeatherCard = dynamic(() =>
  import("@/components/dashboard/weather-card")
);

const NextBestActionCard = dynamic(() =>
  import("@/components/dashboard/next-best-action-card")
);

const PestControlCard = dynamic(() =>
  import("@/components/dashboard/pest-control-card")
);

const OfflineRecommendationsCard = dynamic(() =>
  import("@/components/dashboard/offline-recommendations-card")
);

const VoiceAssistantCard = dynamic(() =>
  import("@/components/dashboard/voice-assistant-card")
);

const FertilizerCard = dynamic(() =>
  import("@/components/dashboard/fertilizer-card")
);

export default function Dashboard() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, here’s your farm’s overview.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <InteractiveFarm />
        <WeatherCard />
        <NextBestActionCard />
        <PestControlCard />
        <OfflineRecommendationsCard />
        <VoiceAssistantCard />
        <FertilizerCard />
      </div>
    </>
  );
}
