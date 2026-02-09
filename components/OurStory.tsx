"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function OurStory() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="story-heading">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <h2
            id="story-heading"
            className="text-3xl font-bold text-text md:text-4xl"
          >
            Our Story
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-textMuted">
            J.W. Research & Development is a multi-disciplinary consulting agency specializing in strategic operations, media production & distribution, as well as brand development.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center justify-center rounded-lg border border-accent/50 bg-transparent px-6 py-3.5 text-base font-semibold text-accent transition-all hover:bg-accent/10 hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Learn more about J.W. Research & Development"
          >
            Learn More
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
