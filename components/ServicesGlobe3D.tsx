"use client";

import * as THREE from "three";
import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { Service } from "@/lib/services";

/* ----------------------------
  TWEAKABLE PARAMETERS
  orb.size          - Globe radius (default 1.45)
  orb.glowStrength  - Core emissive intensity
  orb.nodeDensity   - Icosahedron subdivisions (3–5)
  orb.lineOpacity   - Network line opacity (0.2–0.4)
  ripple.speed      - Ripple expansion speed
  ripple.fadeSpeed  - Ripple fade-out rate
  particles.*       - Particle counts and drift
  bloom.strength    - Bloom intensity (0.4–1)
  bloom.radius      - Bloom spread
  bloom.threshold   - Luminance cutoff (lower = more glow)
----------------------------- */
const CONFIG = {
  orb: {
    size: 1.45,
    glowStrength: 0.2,
    nodeDensity: 4,
    lineOpacity: 0.28,
    rimLightIntensity: 0.4,
  },
  ripple: {
    speed: 0.2,
    thickness: 0.4,
    fadeSpeed: 1.2,
  },
  particles: {
    magicDustCount: 800,
    driftSpeed: 0.02,
    auraCount: 1200,
  },
  bloom: {
    strength: 0.6,
    radius: 0.4,
    threshold: 0.2,
  },
};

/* ----------------------------
  Utils
----------------------------- */
function damp(current: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}

/* ----------------------------
  Network Shell - dense geodesic globe
----------------------------- */
function NetworkShell({ speed }: { speed: number }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<THREE.Points>(null);

  const { wireGeom, nodePositions } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.5, CONFIG.orb.nodeDensity);
    const wire = new THREE.EdgesGeometry(ico, 8);
    const nodes = new Float32Array(ico.attributes.position.array as Float32Array);
    return { wireGeom: wire, nodePositions: nodes };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (linesRef.current) {
      linesRef.current.rotation.y += delta * 0.12 * speed;
      const m = linesRef.current.material as THREE.LineBasicMaterial;
      m.opacity = CONFIG.orb.lineOpacity + Math.sin(t * 0.8) * 0.03;
    }
    if (nodesRef.current) {
      nodesRef.current.rotation.y += delta * 0.12 * speed;
      const m = nodesRef.current.material as THREE.PointsMaterial;
      m.opacity = 0.8 + Math.sin(t * 0.9) * 0.06;
    }
  });

  return (
    <group>
      <lineSegments ref={linesRef} geometry={wireGeom}>
        <lineBasicMaterial
          color="#7dd3fc"
          transparent
          opacity={CONFIG.orb.lineOpacity}
          depthWrite={false}
        />
      </lineSegments>

      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#c7f0ff"
          size={0.018}
          sizeAttenuation
          transparent
          opacity={0.88}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/* ----------------------------
  Gradient texture - smooth radial + vertical fade to transparent
  For cylinder: u = around, v = height. Fades at sides and top/bottom.
----------------------------- */
function createStreamGradientTexture() {
  if (typeof document === "undefined") return null;
  const w = 128;
  const h = 128;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / (w - 1);
      const v = y / (h - 1);
      const distFromCenterU = Math.abs(u - 0.5) * 2;
      const distFromCenterV = Math.abs(v - 0.5) * 2;
      const radial = 1 - Math.pow(distFromCenterU, 1.2);
      const vertical = 1 - Math.pow(distFromCenterV, 1.5);
      const alpha = Math.max(0, Math.min(1, radial * vertical)) * 255;
      const i = (y * w + x) * 4;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = alpha;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/* ----------------------------
  Animated Ripple Rings - smooth, slow, water-like
----------------------------- */
function RippleRings({ speed, platformY }: { speed: number; platformY: number }) {
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);
  const phaseRef = useRef([0, 0.22, 0.44, 0.66, 0.88, 0.1, 0.32]);

  useFrame((state) => {
    const t = state.clock.elapsedTime * CONFIG.ripple.speed * speed;
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      const phase = (t + phaseRef.current[i]) % 1;
      const scale = 0.4 + phase * 4.2;
      ring.scale.setScalar(scale);
      const mat = ring.material as THREE.MeshBasicMaterial;
      const eased = 1 - phase;
      mat.opacity = Math.max(0, eased * eased * eased * 0.24);
    });
  });

  return (
    <group position={[0, platformY + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            ringRefs.current[i] = el;
          }}
        >
          <ringGeometry args={[0.35, 0.75, 64]} />
          <meshBasicMaterial
            color="#7dd3fc"
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ----------------------------
  Magical Aura - particles surrounding the globe
----------------------------- */
function GlobeMagicalAura({ speed }: { speed: number }) {
  const auraRef = useRef<THREE.Points>(null);
  const auraRef2 = useRef<THREE.Points>(null);

  const auraParticles = useMemo(() => {
    const count = 280;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.75 + Math.random() * 0.6;
      const theta = Math.random() * Math.PI * 2;
      const u = Math.random() * 2 - 1;
      const phi = Math.acos(u);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const auraParticles2 = useMemo(() => {
    const count = 120;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.9 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const u = Math.random() * 2 - 1;
      const phi = Math.acos(u);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (auraRef.current) {
      auraRef.current.rotation.y += delta * 0.25 * speed;
      auraRef.current.rotation.x = Math.sin(t * 0.15) * 0.1;
      const m = auraRef.current.material as THREE.PointsMaterial;
      m.opacity = 0.5 + Math.sin(t * 1.1) * 0.15;
    }
    if (auraRef2.current) {
      auraRef2.current.rotation.y -= delta * 0.18 * speed;
      auraRef2.current.rotation.x = Math.sin(t * 0.12 + 1) * 0.08;
      const m = auraRef2.current.material as THREE.PointsMaterial;
      m.opacity = 0.35 + Math.sin(t * 0.9 + 0.5) * 0.1;
    }
  });

  return (
    <group>
      <Points ref={auraRef} positions={auraParticles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#c7f0ff"
          size={0.018}
          sizeAttenuation
          depthWrite={false}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <Points ref={auraRef2} positions={auraParticles2} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#7dd3fc"
          size={0.012}
          sizeAttenuation
          depthWrite={false}
          opacity={0.28}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

/* ----------------------------
  Platform + Aura + Connecting Particles
----------------------------- */
function PlatformAndAura({ speed }: { speed: number }) {
  const auraRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const platformY = -2.4;
  const streamRadius = 0.6;

  const alphaMap = useMemo(() => createStreamGradientTexture(), []);

  const risingParticles = useMemo(() => {
    const count = 180;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * streamRadius * 0.8;
      const baseY = platformY + Math.random() * 0.2;
      const height = 2.2 + Math.random() * 2.4;
      const progress = Math.random();
      const y = baseY + height * progress;

      arr[i * 3] = Math.cos(angle) * r * (1 - progress * 0.6);
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(angle) * r * (1 - progress * 0.6);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.2 * speed;
      const m = particlesRef.current.material as THREE.PointsMaterial;
      m.opacity = 0.55 + Math.sin(t * 1.0) * 0.12;
    }
    if (auraRef.current) {
      const mat = auraRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.14 + Math.sin(t * 1.2) * 0.04;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Subtle ripple origin at stream base */}
      <RippleRings speed={speed} platformY={platformY} />

      {/* Slender energy stream - gradient fade to transparent */}
      <mesh ref={auraRef} position={[0, platformY + 1.2, 0]}>
        <cylinderGeometry args={[0.85, streamRadius, 2.6, 48, 1, true]} />
        <meshBasicMaterial
          color="#7dd3fc"
          transparent
          opacity={0.5}
          alphaMap={alphaMap ?? undefined}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer stream layer - soft gradient glow */}
      <mesh position={[0, platformY + 1.1, 0]}>
        <cylinderGeometry args={[1.0, streamRadius * 1.2, 2.4, 48, 1, true]} />
        <meshBasicMaterial
          color="#7dd3fc"
          transparent
          opacity={0.35}
          alphaMap={alphaMap ?? undefined}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Rising particles - energy stream from platform to globe */}
      <Points
        ref={particlesRef}
        positions={risingParticles}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#7dd3fc"
          size={0.02}
          sizeAttenuation
          depthWrite={false}
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

/* ----------------------------
  Particle Field
----------------------------- */
function ParticleField({ speed }: { speed: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 350;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const u = Math.random() * 2 - 1;
      const phi = Math.acos(u);

      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi);
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;

    pointsRef.current.rotation.y += delta * 0.02 * speed;
    pointsRef.current.rotation.x = Math.sin(t * 0.08) * 0.06;
  });

  return (
      <Points ref={pointsRef} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#7dd3fc"
          size={0.014}
          sizeAttenuation
          depthWrite={false}
          opacity={0.32}
          blending={THREE.AdditiveBlending}
        />
    </Points>
  );
}

/* ----------------------------
  Atmosphere + Halo
----------------------------- */
function Atmosphere({ speed }: { speed: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;

    ref.current.rotation.y += 0.0015 * speed;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.06 + Math.sin(t * 0.6) * 0.015;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.82, 96, 96]} />
      <meshBasicMaterial
        color="#7dd3fc"
        transparent
        opacity={0.07}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

/* ----------------------------
  Icon Ring (real occlusion + smaller)
----------------------------- */
function IconRing({
  services,
  speed,
  selectedId,
  onSelect,
  occludeRef,
}: {
  services: Service[];
  speed: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  occludeRef: React.RefObject<THREE.Object3D | null>;
}) {
  const ringRef = useRef<THREE.Group>(null);
  const iconGroupRefs = useRef<Record<string, THREE.Group | null>>({});
  const scaleRef = useRef<Record<string, number>>({});
  const [hovered, setHovered] = useState<string | null>(null);

  const radius = 2.35;

  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.y += delta * 0.25 * speed;

    for (const svc of services) {
      const isSelected = selectedId === svc.id;
      const isHovered = hovered === svc.id;

      const base = 0.36;
      const target = isSelected ? 0.62 : isHovered ? 0.48 : base;

      const cur = scaleRef.current[svc.id] ?? base;
      scaleRef.current[svc.id] = damp(cur, target, 10, delta);
    }
  });

  return (
    <group ref={ringRef} rotation={[0.25, 0, 0]}>
      {services.map((svc, i) => {
        const a = (i / services.length) * Math.PI * 2;
        const x = Math.cos(a) * radius;
        const z = Math.sin(a) * radius;

        const scale = scaleRef.current[svc.id] ?? 0.36;

        const isSelected = selectedId === svc.id;
        const isHovered = hovered === svc.id;
        const active = isSelected || isHovered;

        const borderColor = isSelected
          ? "rgba(125,211,252,1)"
          : isHovered
          ? "rgba(125,211,252,0.85)"
          : "rgba(125,211,252,0.5)";

        const boxShadow = isSelected
          ? "0 0 24px rgba(125,211,252,0.6), inset 0 0 20px rgba(125,211,252,0.12)"
          : isHovered
          ? "0 0 20px rgba(125,211,252,0.45), inset 0 0 16px rgba(125,211,252,0.08)"
          : "0 0 12px rgba(125,211,252,0.25), inset 0 0 12px rgba(125,211,252,0.06)";

        return (
          <group
            key={svc.id}
            ref={(el) => {
              iconGroupRefs.current[svc.id] = el;
            }}
            position={[x, 0, z]}
          >
            <Html
              center
              transform
              sprite
              distanceFactor={14}
              occlude={[occludeRef]}
              style={{
                width: 72,
                height: 72,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onMouseEnter={() => setHovered(svc.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect(svc.id)}
                title={svc.title}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 16,
                  border: `2px solid ${borderColor}`,
                  background:
                    "linear-gradient(180deg, rgba(125,211,252,0.18), rgba(125,211,252,0.06))",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  transform: `scale(${scale * 0.5})`,
                  boxShadow,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "box-shadow 220ms ease, border-color 220ms ease, background 220ms ease",
                  WebkitFontSmoothing: "antialiased",
                  MozOsxFontSmoothing: "grayscale",
                }}
              >
                <svc.Icon
                  size={36}
                  strokeWidth={2}
                  color="#ffffff"
                  style={{
                    flexShrink: 0,
                    filter: active
                      ? "drop-shadow(0 0 12px rgba(199,240,255,0.95))"
                      : "drop-shadow(0 0 8px rgba(125,211,252,0.6))",
                  }}
                />
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

/* ----------------------------
  Globe System
----------------------------- */
function GlobeSystem({
  speed,
  services,
  selectedId,
  onSelect,
}: {
  speed: number;
  services: Service[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const globeRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (globeRef.current) globeRef.current.rotation.y += delta * 0.14 * speed;

  });

  return (
    <group ref={globeRef}>
      {/* Solid opaque globe core - meshBasicMaterial so no light reflection/glow */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[CONFIG.orb.size, 96, 96]} />
        <meshBasicMaterial
          color="#0a1628"
          side={THREE.FrontSide}
        />
      </mesh>

      <NetworkShell speed={speed} />
      <Atmosphere speed={speed} />

      <IconRing services={services} speed={speed} selectedId={selectedId} onSelect={onSelect} occludeRef={coreRef} />
    </group>
  );
}

/* ----------------------------
  Main (IN-PAGE, NOT FIXED)
----------------------------- */
export default function ServicesGlobe3D({
  services,
  selectedId,
  onSelect,
}: {
  services: Service[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  // never pause, only slow on hover
  const speed = hovered ? 0.6 : 1;

  return (
    <div
      className="relative h-[640px] w-full overflow-hidden rounded-3xl border border-white/10 bg-black"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Dark gradient + vignette + soft orb halo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(13,32,54,0.5) 0%, rgba(0,0,0,0.88) 50%, rgba(0,0,0,1) 100%), radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(0,0,0,0.4) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-screen"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(125,211,252,0.06) 1px, rgba(0,0,0,0) 1px)",
          backgroundSize: "100% 6px",
        }}
      />
      <div className="pointer-events-none absolute inset-6 rounded-3xl border border-white/5" />

      <Canvas
        className="absolute inset-0"
        gl={{ alpha: true, antialias: true }}
        dpr={[1.5, 2]}
        camera={{ position: [0, 0.35, 8.2], fov: 38 }}
      >

        <ambientLight intensity={0.85} />
        <directionalLight position={[6, 6, 6]} intensity={1.35} />
        <pointLight position={[-5, -2, 5]} intensity={0.9} color="#7dd3fc" />
        <pointLight position={[0, 2.5, -5]} intensity={0.4} color="#7dd3fc" />

        <PlatformAndAura speed={speed} />
        <GlobeSystem speed={speed} services={services} selectedId={selectedId} onSelect={onSelect} />
        <GlobeMagicalAura speed={speed} />
        <ParticleField speed={speed} />

        <EffectComposer>
          <Bloom
            intensity={CONFIG.bloom.strength}
            radius={CONFIG.bloom.radius}
            luminanceThreshold={CONFIG.bloom.threshold}
            mipmapBlur
          />
        </EffectComposer>

        <OrbitControls
          enabled
          enableZoom
          enablePan={false}
          minDistance={5}
          maxDistance={12}
          rotateSpeed={hovered ? 0.55 : 0.85}
          dampingFactor={0.08}
          enableDamping
        />
      </Canvas>

    </div>
  );
}
