"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { SERVICES } from "@/lib/services";

const ServicesGlobe3D = dynamic(() => import("./ServicesGlobe3D"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-56 w-56 animate-pulse rounded-full bg-cyan-400/10" />
    </div>
  ),
});

export default function Hero() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <section className="relative min-h-[calc(100vh-72px)]">
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl flex-col items-center justify-center px-6">
        {/* Globe */}
        <div className="w-full">
          <ServicesGlobe3D
            services={SERVICES}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* AI assistant panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-6 w-full max-w-xl rounded-2xl border border-white/10 bg-black/30 p-5 text-center text-white/85 backdrop-blur-md"
        >
          <p className="text-sm md:text-base">
            Welcome. I&apos;m your AI assistant. How can I help you today?
          </p>

          <p className="mt-2 text-xs text-white/55">
            Selected: {selectedId ?? "none"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
