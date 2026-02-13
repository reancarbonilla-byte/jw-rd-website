"use client";

import * as THREE from "three";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { Service } from "@/lib/services";

/* ----------------------------
  TWEAKABLE: orb.size, orb.nodeDensity, orb.lineOpacity, orb.nodeSize
  particles.count, bloom.*, platform.*
----------------------------- */
const CONFIG = {
  orb: {
    size: 1.4,
    nodeDensity: 4,
    lineOpacity: 0.3,
    nodeSize: 0.016,
  },
  particles: { count: 320 },
  bloom: { strength: 0.55, radius: 0.4, threshold: 0.18 },
  platform: { y: -2.2, rippleSpeed: 0.15, rippleCount: 5 },
};

/* ----------------------------
  Utils
----------------------------- */
function damp(current: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}

/* ----------------------------
  Globe - geodesic wireframe + nodes
----------------------------- */
function Globe({ speed }: { speed: number }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<THREE.Points>(null);

  const { wireGeom, nodePositions } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.5, CONFIG.orb.nodeDensity);
    const wire = new THREE.EdgesGeometry(ico, 10);
    const pos = ico.attributes.position;
    const nodes = new Float32Array(pos.array as Float32Array);
    return { wireGeom: wire, nodePositions: nodes };
  }, []);

  useFrame((state, delta) => {
    if (linesRef.current) {
      linesRef.current.rotation.y += delta * 0.12 * speed;
      (linesRef.current.material as THREE.LineBasicMaterial).opacity =
        CONFIG.orb.lineOpacity + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    }
    if (nodesRef.current) {
      nodesRef.current.rotation.y += delta * 0.12 * speed;
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
          size={CONFIG.orb.nodeSize}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/* ----------------------------
  Aura - soft particles around globe
----------------------------- */
function GlobeAura({ speed }: { speed: number }) {
  const ref = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const arr = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const r = 1.7 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2 * speed;
    }
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#7dd3fc"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/* ----------------------------
  Platform - central light, upward beam, ripple rings
----------------------------- */
function createBeamGradientTexture() {
  if (typeof document === "undefined") return null;
  const w = 128;
  const h = 128;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const id = ctx.createImageData(w, h);
  const d = id.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / (w - 1);
      const v = y / (h - 1);
      const radial = 1 - Math.abs(u - 0.5) * 2;
      const vertical = Math.sin(v * Math.PI);
      const alpha = Math.max(0, radial * vertical) * 200;
      const i = (y * w + x) * 4;
      d[i] = d[i + 1] = d[i + 2] = 255;
      d[i + 3] = alpha;
    }
  }
  ctx.putImageData(id, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

function PlatformAndBeam({ speed }: { speed: number }) {
  const platformY = CONFIG.platform.y;
  const beamTex = useMemo(() => createBeamGradientTexture(), []);
  const rippleRefs = useRef<(THREE.Mesh | null)[]>([]);
  const phases = useRef(
    Array.from({ length: CONFIG.platform.rippleCount }, (_, i) => i / CONFIG.platform.rippleCount)
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime * CONFIG.platform.rippleSpeed * speed;
    rippleRefs.current.forEach((ring, i) => {
      if (!ring) return;
      const phase = (t + phases.current[i]) % 1;
      ring.scale.setScalar(0.4 + phase * 3.2);
      const mat = ring.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, (1 - phase) ** 2 * 0.28);
    });
  });

  return (
    <group>
      {/* Central bright light base */}
      <mesh position={[0, platformY + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 64]} />
        <meshBasicMaterial
          color="#7dd3fc"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ripple rings */}
      <group position={[0, platformY + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {Array.from({ length: CONFIG.platform.rippleCount }).map((_, i) => (
          <mesh key={i} ref={(el) => { rippleRefs.current[i] = el; }}>
            <ringGeometry args={[0.25, 0.55, 64]} />
            <meshBasicMaterial
              color="#7dd3fc"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Upward light beam - soft volumetric */}
      <mesh position={[0, platformY + 1.1, 0]}>
        <cylinderGeometry args={[0.95, 0.55, 2.2, 48, 1, true]} />
        <meshBasicMaterial
          color="#7dd3fc"
          transparent
          opacity={0.55}
          alphaMap={beamTex ?? undefined}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ----------------------------
  Particle Field
----------------------------- */
function ParticleField({ speed }: { speed: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = CONFIG.particles.count;
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
  Atmosphere - outer glow
----------------------------- */
function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.78, 64, 64]} />
      <meshBasicMaterial
        color="#7dd3fc"
        transparent
        opacity={0.06}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

const ICON_SLOTS = 24;
const REPOPULATE_INTERVAL = 5.5;
const MOVE_SPEED = 0.4;

function randomSpherePoint(rMin: number, rMax: number) {
  const r = rMin + Math.random() * (rMax - rMin);
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
}

/* ----------------------------
  Floating Icons - distributed in 3D space, repopulate over time
----------------------------- */
function FloatingIcons({
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
  const slotRefs = useRef<(THREE.Group | null)[]>([]);
  const positionsRef = useRef<THREE.Vector3[]>([]);
  const targetsRef = useRef<THREE.Vector3[]>([]);
  const serviceIndicesRef = useRef<number[]>([]);
  const scaleRef = useRef<Record<string, number>>({});
  const repopulateTimerRef = useRef(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [, setRepopulateTick] = useState(0);

  const slots = useMemo(() => {
    const pos: THREE.Vector3[] = [];
    const tgt: THREE.Vector3[] = [];
    const idx: number[] = [];
    for (let i = 0; i < ICON_SLOTS; i++) {
      pos.push(randomSpherePoint(2.0, 2.6));
      tgt.push(pos[i].clone());
      idx.push(Math.floor(Math.random() * services.length));
    }
    positionsRef.current = pos;
    targetsRef.current = tgt;
    serviceIndicesRef.current = idx;
    return { positions: pos, targets: tgt, serviceIndices: idx };
  }, [services.length]);

  const repopulate = useCallback(() => {
    for (let i = 0; i < ICON_SLOTS; i++) {
      targetsRef.current[i].copy(randomSpherePoint(2.0, 2.6));
      if (Math.random() < 0.4) {
        serviceIndicesRef.current[i] = Math.floor(Math.random() * services.length);
      }
    }
    setRepopulateTick((t) => t + 1);
  }, [services.length]);

  useFrame((_, delta) => {
    const dt = delta * speed;

    repopulateTimerRef.current += dt;
    if (repopulateTimerRef.current > REPOPULATE_INTERVAL) {
      repopulateTimerRef.current = 0;
      repopulate();
    }

    for (let i = 0; i < ICON_SLOTS; i++) {
      positionsRef.current[i].lerp(targetsRef.current[i], dt * MOVE_SPEED);
      slotRefs.current[i]?.position.copy(positionsRef.current[i]);
    }

    for (const svc of services) {
      const isSelected = selectedId === svc.id;
      const isHovered = hovered === svc.id;
      const target = isSelected ? 0.62 : isHovered ? 0.48 : 0.36;
      const cur = scaleRef.current[svc.id] ?? 0.36;
      scaleRef.current[svc.id] = damp(cur, target, 10, delta);
    }
  });

  return (
    <group>
      {slots.positions.map((_, i) => {
        const svc = services[serviceIndicesRef.current[i] ?? 0];
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
            key={i}
            ref={(el) => {
              slotRefs.current[i] = el;
            }}
            position={slots.positions[i]}
          >
            <Html
              center
              transform
              sprite
              distanceFactor={14}
              occlude={[occludeRef as React.RefObject<THREE.Object3D>]}
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
      {/* Core - solid opaque sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[CONFIG.orb.size, 64, 64]} />
        <meshBasicMaterial color="#0a1628" side={THREE.FrontSide} />
      </mesh>

      <Globe speed={speed} />
      <Atmosphere />

      <FloatingIcons services={services} speed={speed} selectedId={selectedId} onSelect={onSelect} occludeRef={coreRef} />
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

        <PlatformAndBeam speed={speed} />
        <GlobeSystem speed={speed} services={services} selectedId={selectedId} onSelect={onSelect} />
        <GlobeAura speed={speed} />
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
