"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Service } from "@/lib/services";

export default function ServiceDescriptionPanel({
  selected,
  onReset,
}: {
  selected: Service | null;
  onReset: () => void;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-lg text-white/90">
              Welcome. I’m your AI assistant. How can I help you today?
            </p>
            <p className="mt-2 text-sm text-white/60">
              Hover the globe to pause. Drag to spin. Click an icon to learn more.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-semibold text-white">{selected.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {selected.description}
                </p>
              </div>

              <button
                onClick={onReset}
                className="shrink-0 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
