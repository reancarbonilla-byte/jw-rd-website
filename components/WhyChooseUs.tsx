"use client";

import { motion } from "framer-motion";
import { Target, Users, Shield } from "lucide-react";

const features = [
  {
    id: "tailored",
    title: "Tailored Solutions",
    description:
      "Customized strategies and solutions that align perfectly with each client's unique requirements and aspirations.",
    icon: Target,
  },
  {
    id: "expertise",
    title: "Industry Expertise",
    description:
      "Guidance from seasoned professionals with a proven track record of success across a diverse range of industries and projects.",
    icon: Users,
  },
  {
    id: "ethical",
    title: "Ethical Practices",
    description:
      "Integrity-first collaboration with transparent processes and clear outcomes.",
    icon: Shield,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="why-heading">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="why-heading"
            className="text-3xl font-bold text-text md:text-4xl lg:text-5xl"
          >
            Why Choose Us?
          </h2>
          <p className="mt-4 text-lg text-textMuted">
            We offer a unique blend of expertise, creativity, and ethical practices to help businesses achieve remarkable success.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-xl border border-border bg-surface p-8 transition-colors hover:border-accent/30"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-7 w-7" strokeWidth={2} aria-hidden />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-text">
                  {feature.title}
                </h3>
                <p className="mt-4 text-textMuted">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
