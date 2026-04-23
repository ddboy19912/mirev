import { AutopilotProfiles } from "@/components/home/autopilot-profiles";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { TheSystem } from "@/components/home/the-system";
import { Trust } from "@/components/home/trust";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Hero />
      <HowItWorks />
      <TheSystem />
      <AutopilotProfiles />
      <Trust />
      <FinalCta />
    </div>
  );
}
