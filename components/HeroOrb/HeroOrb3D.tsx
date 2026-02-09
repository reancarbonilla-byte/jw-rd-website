"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function NetworkSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const sphereGeometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.2, 2);
    return geo;
  }, []);

  const linesGeometry = useMemo(() => {
    const positions: number[] = [];
    const geo = new THREE.IcosahedronGeometry(1.2, 2);
    const posAttr = geo.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
      for (let j = i + 1; j < posAttr.count; j++) {
        const dist = new THREE.Vector3(
          posAttr.getX(i),
          posAttr.getY(i),
          posAttr.getZ(i)
        ).distanceTo(
          new THREE.Vector3(posAttr.getX(j), posAttr.getY(j), posAttr.getZ(j))
        );
        if (dist < 0.5) {
          positions.push(
            posAttr.getX(i),
            posAttr.getY(i),
            posAttr.getZ(i),
            posAttr.getX(j),
            posAttr.getY(j),
            posAttr.getZ(j)
          );
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return lineGeo;
  }, []);

  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const radius = 1.5 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group>
      <Float speed={0.5} floatIntensity={0.2}>
        <points ref={pointsRef} geometry={sphereGeometry}>
          <pointsMaterial
            size={0.035}
            color="#7dd3fc"
            sizeAttenuation
            transparent
            opacity={0.9}
          />
        </points>

        <lineSegments geometry={linesGeometry}>
          <lineBasicMaterial
            color="#7dd3fc"
            transparent
            opacity={0.4}
          />
        </lineSegments>

        <mesh ref={meshRef}>
          <sphereGeometry args={[1.15, 32, 32]} />
          <meshBasicMaterial
            color="#0e7490"
            transparent
            opacity={0.15}
          />
        </mesh>

        <Points ref={particlesRef} positions={particles} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color="#7dd3fc"
            size={0.015}
            sizeAttenuation
            depthWrite={false}
            opacity={0.5}
          />
        </Points>
      </Float>
    </group>
  );
}

export default function HeroOrb3D() {
  return (
    <div className="relative h-full min-h-[320px] w-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="h-full w-full"
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[2, 2, 2]} intensity={1} color="#7dd3fc" />
        <pointLight position={[-2, -2, 2]} intensity={0.5} color="#38bdf8" />
        <NetworkSphere />
      </Canvas>
    </div>
  );
}
