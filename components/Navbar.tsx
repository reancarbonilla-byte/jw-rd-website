"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/#offerings", label: "Offerings" },
  { href: "/#blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md"
      role="banner"
    >
      <nav
        className="container-custom flex h-16 items-center justify-between lg:h-20"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-text transition-colors hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="J.W. Research & Development - Home"
        >
          <Sparkles className="h-5 w-5 text-accent" strokeWidth={2} aria-hidden />
          <span>J.W. Research & Development</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex" role="menubar">
          {navLinks.map((link) => (
            <li key={link.href} role="none">
              <Link
                href={link.href}
                className="text-sm font-medium text-textMuted transition-colors hover:text-text focus:outline-none focus-visible:text-accent"
                role="menuitem"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-all hover:bg-accentDim hover:shadow-glow-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Explore our offerings"
          >
            Explore Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex p-2 text-textMuted hover:text-text focus:outline-none focus-visible:text-accent md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" strokeWidth={2} aria-hidden />
          ) : (
            <Menu className="h-6 w-6" strokeWidth={2} aria-hidden />
          )}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/50 bg-background/95 backdrop-blur-md md:hidden"
          >
            <ul className="container-custom flex flex-col gap-1 py-4" role="menu">
              {navLinks.map((link) => (
                <li key={link.href} role="none">
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-3 text-textMuted hover:bg-surfaceLight hover:text-text focus:outline-none focus-visible:bg-surfaceLight focus-visible:text-accent"
                    role="menuitem"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2" role="none">
                <Link
                  href="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="mx-4 block rounded-lg bg-accent px-4 py-3 text-center font-semibold text-background"
                  role="menuitem"
                >
                  Explore Now
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
