"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function Testimonial() {
  return (
    <section
      id="blog"
      className="py-20 lg:py-28"
      aria-labelledby="testimonial-heading"
    >
      <div className="container-custom">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8 md:p-12"
        >
          <Quote
            className="absolute left-6 top-6 h-10 w-10 text-accent/30"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="relative text-lg italic text-textMuted md:text-xl">
            &ldquo;J.W. Research Development exceeded our expectations in every way. Highly recommended for their professionalism and results.&rdquo;
          </p>
          <footer className="mt-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-accent/20" aria-hidden />
            <div>
              <cite className="not-italic font-semibold text-text">
                William Hicks
              </cite>
              <p className="text-sm text-textMuted">Client</p>
            </div>
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
