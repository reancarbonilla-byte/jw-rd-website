"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  PenTool,
  Megaphone,
  Globe,
  Smartphone,
  Palette,
  FlaskConical,
  Video,
  Database,
  LucideIcon,
} from "lucide-react";
import Modal from "./Modal";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const services: Service[] = [
  {
    id: "consultation",
    title: "Consultation",
    description:
      "Expert guidance in marketing, media production, brand development, engineering, and research, all tailored to meet your unique goals.",
    icon: MessageSquare,
  },
  {
    id: "content-creation",
    title: "Content Creation",
    description:
      "Creating unforgettable product with top industry talents and teams for a lasting impact.",
    icon: PenTool,
  },
  {
    id: "marketing",
    title: "Marketing",
    description:
      "From product placement to national advertising campaigns, we can help you identify your company's goals and achieve results.",
    icon: Megaphone,
  },
  {
    id: "web-development",
    title: "Web Development",
    description:
      "Modern, responsive websites built for performance and conversion.",
    icon: Globe,
  },
  {
    id: "app-development",
    title: "App Development",
    description:
      "Cross-platform apps designed for clarity, speed, and scalability.",
    icon: Smartphone,
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    description:
      "Branding, visuals, and UI assets that stay consistent and memorable.",
    icon: Palette,
  },
  {
    id: "research-development",
    title: "Research & Development",
    description:
      "Strategic experimentation, prototyping, and technical exploration.",
    icon: FlaskConical,
  },
  {
    id: "video-editing",
    title: "Video Editing",
    description:
      "Clean edits, motion, and story-driven post production.",
    icon: Video,
  },
  {
    id: "data-entry",
    title: "Data Entry",
    description:
      "Accurate, structured data support for fast operations.",
    icon: Database,
  },
];

export default function ServicesGrid() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section
      id="offerings"
      className="py-20 lg:py-28"
      aria-labelledby="services-heading"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="services-heading"
            className="text-3xl font-bold text-text md:text-4xl lg:text-5xl"
          >
            Explore Our Services
          </h2>
          <p className="mt-4 text-lg text-textMuted">
            Discover the extensive range of services and solutions we offer across various industries.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group cursor-pointer rounded-xl border border-border bg-surface p-6 transition-all hover:border-accent/40 hover:shadow-glow focus-within:border-accent/40 focus-within:shadow-glow"
                onClick={() => setSelectedService(service)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedService(service);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${service.title}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                    <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text">
                      {service.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-textMuted">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={selectedService?.title ?? ""}
      >
        {selectedService && (
          <p className="text-base leading-relaxed">{selectedService.description}</p>
        )}
      </Modal>
    </section>
  );
}
