"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { SERVICES } from "@/lib/services";
import ServiceDescriptionPanel from "@/components/ServiceDescriptionPanel";

import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import OurStory from "@/components/OurStory";
import Testimonial from "@/components/Testimonial";
import WhyChooseUs from "@/components/WhyChooseUs";
import FinalCTA from "@/components/FinalCTA";

const ServicesGlobe3D = dynamic(() => import("@/components/ServicesGlobe3D"), {
  ssr: false,
});

export default function HomePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => SERVICES.find((s) => s.id === selectedId) || null,
    [selectedId]
  );

  return (
    <>
      <Hero
        rightSlot={
          <div>
            <ServicesGlobe3D
              services={SERVICES}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
            />
            <ServiceDescriptionPanel
              selected={selected}
              onReset={() => setSelectedId(null)}
            />
          </div>
        }
      />

      <ServicesGrid />
      <OurStory />
      <Testimonial />
      <WhyChooseUs />
      <FinalCTA />
    </>
  );
}
