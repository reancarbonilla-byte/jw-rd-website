"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const HeroOrb = dynamic(() => import("./HeroOrb"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="h-48 w-48 animate-pulse rounded-full bg-accent/10" />
    </div>
  ),
});

export default function Hero() {
  return (
    <section
      className="relative pt-24 pb-16 lg:pt-32 lg:pb-24"
      aria-labelledby="hero-heading"
    >
      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold leading-tight text-text md:text-5xl lg:text-6xl"
            >
              Empowering Entities to Succeed
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-lg text-textMuted md:text-xl"
            >
              Innovative consultation firm supporting a diverse range of industries.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="#offerings"
                className="mt-8 inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-background transition-all hover:bg-accentDim hover:shadow-glow-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Explore our offerings"
              >
                Explore Now
              </Link>
            </motion.div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full max-w-md">
              <HeroOrb />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 rounded-xl border border-accent/30 bg-surface/80 p-4 backdrop-blur-sm"
              >
                <p className="text-center text-sm text-text md:text-base">
                  Welcome. I&apos;m your AI assistant. How can I help you today?
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
