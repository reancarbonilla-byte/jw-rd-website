"use client";

import * as THREE from "three";
import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial, Html } from "@react-three/drei";
import type { Service } from "@/lib/services";

/* ----------------------------
   FUTURISTIC NETWORK SHELL
----------------------------- */
function NetworkShell({ paused }: { paused: boolean }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<THREE.Points>(null);

  const wireGeom = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.55, 3);
    return new THREE.EdgesGeometry(ico, 10);
  }, []);

  const nodePositions = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.55, 3);
    return new Float32Array(ico.attributes.position.array as Float32Array);
  }, []);

  useFrame((_, delta) => {
    if (paused) return;
    if (linesRef.current) linesRef.current.rotation.y += delta * 0.18;
    if (nodesRef.current) nodesRef.current.rotation.y += delta * 0.18;
  });

  return (
    <group>
      <lineSegments ref={linesRef} geometry={wireGeom}>
        <lineBasicMaterial
          color="#7dd3fc"
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </lineSegments>

      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#c7f0ff"
          size={0.022}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/* ----------------------------
   FREE FLOATING PARTICLES
----------------------------- */
function ParticleField({ paused }: { paused: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 2600;
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 2.1 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const u = Math.random() * 2 - 1;
      const phi = Math.acos(u);

      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi);
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (paused) return;
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.03;
  });

  return (
    <Points
      ref={pointsRef}
      positions={particles}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#7dd3fc"
        size={0.012}
        sizeAttenuation
        depthWrite={false}
        opacity={0.42}
      />
    </Points>
  );
}

/* ----------------------------
   OCCLUSION TEST (camera -> icon ray intersects globe first)
----------------------------- */
function isOccludedBySphere(params: {
  cameraPos: THREE.Vector3;
  iconPos: THREE.Vector3;
  sphereCenter: THREE.Vector3;
  sphereRadius: number;
}) {
  const { cameraPos, iconPos, sphereCenter, sphereRadius } = params;

  // Ray from camera toward icon
  const dir = iconPos.clone().sub(cameraPos);
  const distToIcon = dir.length();
  if (distToIcon <= 1e-6) return false;

  dir.normalize();

  // Solve intersection with sphere: |(o + t d) - c|^2 = r^2
  const o = cameraPos;
  const c = sphereCenter;

  const oc = o.clone().sub(c);
  const b = 2 * oc.dot(dir);
  const cc = oc.dot(oc) - sphereRadius * sphereRadius;
  const disc = b * b - 4 * cc; // a = 1

  if (disc < 0) return false;

  const sqrtDisc = Math.sqrt(disc);
  const t1 = (-b - sqrtDisc) / 2;
  const t2 = (-b + sqrtDisc) / 2;

  // If we hit the sphere at a positive t before reaching the icon, it's occluded.
  const eps = 0.02; // small buffer so it "disappears briefly" as it goes behind
  const hitT =
    t1 > 0 ? t1 : t2 > 0 ? t2 : Number.POSITIVE_INFINITY;

  return hitT < distToIcon - eps;
}

/* ----------------------------
   ICON RING (REAL OCCLUSION + SMALLER ICONS)
----------------------------- */
function IconRing({
  services,
  paused,
  selectedId,
  onSelect,
}: {
  services: Service[];
  paused: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const ringRef = useRef<THREE.Group>(null);
  const iconGroupRefs = useRef<Record<string, THREE.Group | null>>({});
  const hiddenRef = useRef<Record<string, boolean>>({});
  const scaleRef = useRef<Record<string, number>>({});
  const [hovered, setHovered] = useState<string | null>(null);

  const radius = 2.35;
  const globeRadius = 1.45;

  const sphereCenterWorld = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const camPos = useMemo(() => new THREE.Vector3(), []);
  const iconWorld = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, delta) => {
    if (!paused && ringRef.current) {
      ringRef.current.rotation.y += delta * 0.22;
    }

    camera.getWorldPosition(camPos);

    // Update occlusion + smooth scaling
    for (const svc of services) {
      const g = iconGroupRefs.current[svc.id];
      if (!g) continue;

      g.getWorldPosition(iconWorld);

      const occluded = isOccludedBySphere({
        cameraPos: camPos,
        iconPos: iconWorld,
        sphereCenter: sphereCenterWorld,
        sphereRadius: globeRadius + 0.06, // slightly bigger so it hides "behind" cleanly
      });

      hiddenRef.current[svc.id] = occluded;

      const isSelected = selectedId === svc.id;
      const isHovered = hovered === svc.id;

      // smaller overall
      const base = 0.54;
      const target = isSelected ? 0.78 : isHovered ? 0.64 : base;

      const cur = scaleRef.current[svc.id] ?? base;
      scaleRef.current[svc.id] = cur + (target - cur) * Math.min(1, delta * 12);
    }
  });

  return (
    <group ref={ringRef} rotation={[0.22, 0, 0]}>
      {services.map((svc, i) => {
        const a = (i / services.length) * Math.PI * 2;
        const x = Math.cos(a) * radius;
        const z = Math.sin(a) * radius;

        const hidden = hiddenRef.current[svc.id] ?? false;
        const scale = scaleRef.current[svc.id] ?? 0.54;

        const isSelected = selectedId === svc.id;
        const isHovered = hovered === svc.id;
        const active = isSelected || isHovered;

        const borderColor = isSelected
          ? "rgba(125,211,252,0.95)"
          : isHovered
          ? "rgba(125,211,252,0.65)"
          : "rgba(255,255,255,0.18)";

        const boxShadow = isSelected
          ? "0 0 18px rgba(125,211,252,0.42)"
          : isHovered
          ? "0 0 14px rgba(125,211,252,0.28)"
          : "0 0 0 rgba(0,0,0,0)";

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
              distanceFactor={12.5}
              style={{
                opacity: hidden ? 0 : 1,
                pointerEvents: hidden ? "none" : "auto",
                transition: "opacity 140ms ease",
              }}
            >
              <button
                type="button"
                onMouseEnter={() => setHovered(svc.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect(svc.id)}
                title={svc.title}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: `1px solid ${borderColor}`,
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  transform: `scale(${scale})`,
                  boxShadow,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition:
                    "box-shadow 220ms ease, border-color 220ms ease, background 220ms ease",
                }}
              >
                <svc.Icon
                  size={16}
                  strokeWidth={1.7}
                  color={active ? "#c7f0ff" : "#7dd3fc"}
                  style={{
                    filter: active
                      ? "drop-shadow(0 0 10px rgba(125,211,252,0.85))"
                      : "drop-shadow(0 0 6px rgba(125,211,252,0.35))",
                    opacity: active ? 1 : 0.92,
                    transition: "filter 220ms ease, opacity 220ms ease",
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
   GLOBE SYSTEM
----------------------------- */
function GlobeSystem({
  paused,
  services,
  selectedId,
  onSelect,
}: {
  paused: boolean;
  services: Service[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const globeRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!paused && globeRef.current) {
      globeRef.current.rotation.y += delta * 0.12;
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.09 + Math.sin(state.clock.elapsedTime * 1.2) * 0.012;
    }
  });

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[1.45, 96, 96]} />
        <meshStandardMaterial
          color="#061a2d"
          roughness={0.95}
          metalness={0.05}
          emissive="#0b2440"
          emissiveIntensity={0.22}
        />
      </mesh>

      <NetworkShell paused={paused} />

      <mesh ref={glowRef}>
        <sphereGeometry args={[1.62, 96, 96]} />
        <meshStandardMaterial
          color="#7dd3fc"
          transparent
          opacity={0.09}
          roughness={1}
          metalness={0}
          depthWrite={false}
        />
      </mesh>

      <IconRing
        services={services}
        paused={paused}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </group>
  );
}

/* ----------------------------
   MAIN
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

  return (
    <div
      className="h-[680px] w-full rounded-2xl border border-white/10 bg-black/20"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0.35, 6.8], fov: 40 }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[6, 6, 6]} intensity={1.35} />
        <pointLight position={[-5, -2, 5]} intensity={0.85} color="#7dd3fc" />

        <GlobeSystem
          paused={hovered}
          services={services}
          selectedId={selectedId}
          onSelect={onSelect}
        />

        <ParticleField paused={hovered} />

        <OrbitControls
          enabled={hovered}
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.7}
          dampingFactor={0.08}
          enableDamping
        />
      </Canvas>
    </div>
  );
}
