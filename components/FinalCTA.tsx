"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section
      id="contact"
      className="py-20 lg:py-28"
      aria-labelledby="cta-heading"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl rounded-2xl border border-accent/30 bg-surface px-8 py-16 text-center shadow-glow md:px-12 md:py-20"
        >
          <h2
            id="cta-heading"
            className="text-3xl font-bold text-text md:text-4xl"
          >
            Ready to Transform?
          </h2>
          <p className="mt-4 text-lg text-textMuted">
            Partner with us today and let&apos;s elevate your business to new heights together. Contact us now to get started!
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-background transition-all hover:bg-accentDim hover:shadow-glow-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Explore our offerings"
            >
              Explore Now
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-lg border border-accent/50 px-6 py-3.5 text-base font-semibold text-accent transition-all hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Contact us"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
