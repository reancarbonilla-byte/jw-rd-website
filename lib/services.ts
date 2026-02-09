import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  PenTool,
  Megaphone,
  Globe,
  Smartphone,
  FlaskConical,
  Video,
  Database,
  Sparkles,
} from "lucide-react";

export type Service = {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  iconSrc: string;
};

export const SERVICES: Service[] = [
  {
    id: "consultation",
    title: "Consultation",
    description:
      "Expert guidance in marketing, media production, brand development, engineering, and research, all tailored to meet your unique goals.",
    Icon: Briefcase,
    iconSrc: "/icons/consultation.svg",
  },
  {
    id: "content-creation",
    title: "Content Creation",
    description:
      "Creating unforgettable product with top industry talents and teams for a lasting impact.",
    Icon: Sparkles,
    iconSrc: "/icons/content-creation.svg",
  },
  {
    id: "marketing",
    title: "Marketing",
    description:
      "From product placement to national advertising campaigns, we can help you identify your company’s goals and achieve results.",
    Icon: Megaphone,
    iconSrc: "/icons/marketing.svg",
  },
  {
    id: "web-development",
    title: "Web Development",
    description:
      "Modern, responsive websites built for performance and conversion.",
    Icon: Globe,
    iconSrc: "/icons/web-development.svg",
  },
  {
    id: "app-development",
    title: "App Development",
    description:
      "Cross-platform apps designed for clarity, speed, and scalability.",
    Icon: Smartphone,
    iconSrc: "/icons/app-development.svg",
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    description:
      "Branding, visuals, and UI assets that stay consistent and memorable.",
    Icon: PenTool,
    iconSrc: "/icons/graphic-design.svg",
  },
  {
    id: "research-development",
    title: "Research & Development",
    description:
      "Strategic experimentation, prototyping, and technical exploration.",
    Icon: FlaskConical,
    iconSrc: "/icons/research-development.svg",
  },
  {
    id: "video-editing",
    title: "Video Editing",
    description:
      "Clean edits, motion, and story-driven post production.",
    Icon: Video,
    iconSrc: "/icons/video-editing.svg",
  },
  {
    id: "data-entry",
    title: "Data Entry",
    description:
      "Accurate, structured data support for fast operations.",
    Icon: Database,
    iconSrc: "/icons/data-entry.svg",
  },
];
