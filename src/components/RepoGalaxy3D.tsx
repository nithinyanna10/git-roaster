"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import * as THREE from "three";

interface PlanetProps {
  position: [number, number, number];
  color: string;
  size: number;
  label: string;
  score: number;
}

function Planet({ position, color, size, label, score }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      <Text
        position={[0, size + 0.8, 0]}
        fontSize={0.2}
        color="#a1a1aa"
        anchorX="center"
        anchorY="middle"
      >
        {score}/100
      </Text>
    </group>
  );
}

interface RepoGalaxy3DProps {
  analysis: Analysis;
}

export function RepoGalaxy3D({ analysis }: RepoGalaxy3DProps) {
  const planets = [
    {
      position: [0, 0, 0] as [number, number, number],
      color: "#8b5cf6",
      size: 1,
      label: "Vibe",
      score: analysis.scores.vibeTotal,
    },
    {
      position: [3, 0, 0] as [number, number, number],
      color: "#ec4899",
      size: 0.6,
      label: "Pulse",
      score: analysis.scores.pulse,
    },
    {
      position: [-3, 0, 0] as [number, number, number],
      color: "#06b6d4",
      size: 0.6,
      label: "Bus Factor",
      score: analysis.scores.busFactor,
    },
    {
      position: [0, 3, 0] as [number, number, number],
      color: "#10b981",
      size: 0.5,
      label: "Tests",
      score: analysis.scores.tests,
    },
    {
      position: [0, -3, 0] as [number, number, number],
      color: "#f59e0b",
      size: 0.5,
      label: "Releases",
      score: analysis.scores.releases,
    },
  ];

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-2xl font-bold mb-2">3D Repo Galaxy</h3>
        <p className="text-zinc-400 text-sm">Interactive 3D visualization of repository metrics</p>
      </div>
      <div className="h-[500px] rounded-lg overflow-hidden bg-black">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Stars radius={100} depth={50} count={5000} factor={4} />
            {planets.map((planet, index) => (
              <Planet key={index} {...planet} />
            ))}
            <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
          </Suspense>
        </Canvas>
      </div>
      <p className="text-xs text-zinc-400 mt-4 text-center">
        Drag to rotate • Scroll to zoom • Each planet represents a metric
      </p>
    </Card>
  );
}
