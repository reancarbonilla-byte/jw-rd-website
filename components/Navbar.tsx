"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md"
      role="banner"
    >
      <nav
        className="flex h-14 items-center justify-center px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-lg font-semibold text-white transition-opacity hover:opacity-90"
          aria-label="J.W. Research & Development - Home"
        >
          J.W. Research & Development
        </Link>
      </nav>
    </header>
  );
}
