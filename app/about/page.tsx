"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Award, Users, Shield } from "lucide-react";

const coreValues = [
  {
    id: "integrity",
    title: "Integrity",
    description:
      "We uphold the highest ethical standards, ensuring transparency, honesty, and trust in all our dealings.",
    icon: Shield,
  },
  {
    id: "excellence",
    title: "Excellence",
    description:
      "We strive for excellence in everything we do, delivering exceptional results with precision and innovation.",
    icon: Award,
  },
  {
    id: "collaboration",
    title: "Collaboration",
    description:
      "We value collaboration and teamwork, fostering strong relationships with clients and partners to achieve mutual success.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="container-custom">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-text md:text-5xl lg:text-6xl"
          >
            Innovative Consultation Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-2xl text-lg text-textMuted"
          >
            Multi-disciplinary expertise for strategic growth and lasting impact.
          </motion.p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-text md:text-4xl"
          >
            Our Story
          </motion.h2>
          <div className="mt-8 max-w-3xl space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg leading-relaxed text-textMuted"
            >
              With a diverse portfolio spanning from private consultation to brokering, J.W. Research & Development offers unparalleled expertise and ethical assistance to entities seeking to achieve their goals.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg leading-relaxed text-textMuted"
            >
              Founded on a commitment to excellence and ethical practices, J.W. Research & Development has evolved into a multi-faceted consultancy firm with a proven track record of success.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-lg leading-relaxed text-textMuted"
            >
              Having served esteemed clients including US Army, NASA, Harvard University, and more. The company has a stellar reputation for delivering outstanding results and fostering long-lasting partnerships.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-text md:text-4xl"
          >
            Core Values
          </motion.h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.article
                  key={value.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border border-border bg-surface p-8"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-7 w-7" strokeWidth={2} aria-hidden />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-text">
                    {value.title}
                  </h3>
                  <p className="mt-4 text-textMuted">{value.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl rounded-2xl border border-accent/30 bg-surface px-8 py-16 text-center shadow-glow md:px-12 md:py-20"
          >
            <h2 className="text-3xl font-bold text-text md:text-4xl">
              Ready to Transform?
            </h2>
            <p className="mt-4 text-lg text-textMuted">
              Partner with us today and let&apos;s elevate your business to new heights together. Contact us now to get started!
            </p>
            <Link
              href="/#contact"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-background transition-all hover:bg-accentDim hover:shadow-glow-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Contact us"
            >
              Explore Now
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
