"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { SERVICES } from "@/lib/services";
import type { Service } from "@/lib/services";

const ServicesGlobe3D = dynamic(() => import("@/components/ServicesGlobe3D"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-56 w-56 animate-pulse rounded-full bg-cyan-400/10" />
    </div>
  ),
});

export default function HomePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedService = selectedId
    ? SERVICES.find((s) => s.id === selectedId)
    : null;

  return (
    <main className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center pt-14">
      {/* Centered Globe */}
      <div className="flex w-full max-w-4xl flex-1 items-center justify-center px-4 py-6">
        <ServicesGlobe3D
          services={SERVICES as Service[]}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {/* AI assistant panel below globe */}
      <div className="w-full max-w-2xl px-4 pb-8">
        <div className="relative rounded-2xl border border-white/10 bg-black/30 p-5 text-center backdrop-blur-md">
          {selectedService ? (
            <div>
              <p className="font-medium text-cyan-200/90">{selectedService.title}</p>
              <p className="mt-2 text-sm text-white/75">{selectedService.description}</p>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="mt-4 rounded-lg border border-cyan-400/40 px-4 py-2 text-xs font-medium text-cyan-300/90 transition-colors hover:bg-cyan-400/10 hover:border-cyan-400/60"
                aria-label="Reset to welcome message"
              >
                Reset
              </button>
            </div>
          ) : (
            <p className="text-sm text-white/85 md:text-base">
              Welcome. I&apos;m your AI assistant. How can I help you today?
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
