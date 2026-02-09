"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, Suspense } from "react";
import HeroOrbCSS from "./HeroOrbCSS";

const HeroOrb3D = dynamic(() => import("./HeroOrb3D"), {
  ssr: false,
  loading: () => <HeroOrbCSS />,
});

export default function HeroOrb() {
  const [useWebGL, setUseWebGL] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setUseWebGL(false);
      return;
    }
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) {
      setUseWebGL(false);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="relative h-full min-h-[320px] w-full">
        <HeroOrbCSS />
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[320px] w-full">
      {useWebGL ? (
        <Suspense fallback={<HeroOrbCSS />}>
          <HeroOrb3D />
        </Suspense>
      ) : (
        <HeroOrbCSS />
      )}
    </div>
  );
}
