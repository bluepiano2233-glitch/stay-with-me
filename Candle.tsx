
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CandleState } from '../types';

interface CandleProps {
  position: [number, number, number];
  state: CandleState;
  delay?: number;
  scale?: number;
}

const Candle: React.FC<CandleProps> = ({ position, state, delay = 0, scale = 1 }) => {
  const flameRef = useRef<THREE.Mesh>(null);
  const smokeRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Smoke particles logic
  const particleCount = 20;
  const [positions, opacities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const op = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 1] = i * 0.05;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
      op[i] = 0;
    }
    return [pos, op];
  }, []);

  useFrame((stateFrame) => {
    const time = stateFrame.clock.getElapsedTime();

    // Flame animation (Flicker)
    if (flameRef.current && state === CandleState.WAITING) {
      const flicker = Math.sin(time * 10 + delay) * 0.1 + 0.9;
      flameRef.current.scale.set(flicker, flicker + Math.sin(time * 15) * 0.1, flicker);
      flameRef.current.position.y = 0.5 + Math.sin(time * 20) * 0.02;
      flameRef.current.visible = true;
      if (lightRef.current) lightRef.current.intensity = 2 + Math.random() * 0.5;
    } else if (flameRef.current && state === CandleState.BLOWING) {
      // Transition blow
      flameRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.2);
      if (lightRef.current) lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 0, 0.2);
    } else if (flameRef.current) {
      flameRef.current.visible = false;
      if (lightRef.current) lightRef.current.intensity = 0;
    }

    // Smoke animation
    if (smokeRef.current && state === CandleState.EXTINGUISHED) {
      const positionsAttr = smokeRef.current.geometry.attributes.position;
      const opacityAttr = smokeRef.current.geometry.attributes.opacity as THREE.BufferAttribute;
      
      for (let i = 0; i < particleCount; i++) {
        // Rise and spread
        positionsAttr.setY(i, (positionsAttr.getY(i) + 0.01) % 1);
        positionsAttr.setX(i, positionsAttr.getX(i) + Math.sin(time * 2 + i) * 0.002);
        
        // Fade out
        const life = 1.0 - (positionsAttr.getY(i) / 1.0);
        opacityAttr.setX(i, life * 0.4);
      }
      positionsAttr.needsUpdate = true;
      opacityAttr.needsUpdate = true;
      smokeRef.current.visible = true;
    } else if (smokeRef.current) {
      smokeRef.current.visible = false;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Candle Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#fff" emissive="#ffddaa" emissiveIntensity={0.1} />
      </mesh>
      
      {/* Wick */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} scale={[1, 2, 1]} />
        <meshStandardMaterial 
          color="#ffaa00" 
          emissive="#ff4400" 
          emissiveIntensity={10} 
          transparent 
          opacity={0.9} 
        />
        <pointLight ref={lightRef} intensity={2} color="#ffaa00" distance={5} />
      </mesh>

      {/* Smoke Particles */}
      <points ref={smokeRef} position={[0, 0.4, 0]} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-opacity"
            count={particleCount}
            array={opacities}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#888"
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default Candle;
