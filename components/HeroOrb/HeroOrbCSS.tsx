"use client";

export default function HeroOrbCSS() {
  return (
    <div className="relative flex h-full min-h-[320px] w-full items-center justify-center">
      <div className="relative h-64 w-64 md:h-80 md:w-80">
        <div className="absolute inset-0 animate-pulse-slow rounded-full bg-accent/20 blur-3xl" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-full w-full animate-spin-slow">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                }}
              >
                <div className="mx-auto h-full w-px bg-gradient-to-b from-transparent via-accent/50 to-transparent" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/40 bg-accent/5 shadow-glow" />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const r = 80;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            return (
              <div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-accent shadow-glow-accent"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}
        </div>

        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-glow-accent" />
      </div>
    </div>
  );
}
