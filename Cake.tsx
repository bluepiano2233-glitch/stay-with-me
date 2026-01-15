
import React from 'react';
import * as THREE from 'three';

const Cake: React.FC = () => {
  return (
    <group>
      {/* Bottom Layer */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 2.5, 1, 64]} />
        <meshStandardMaterial color="#ffc0cb" roughness={0.3} />
      </mesh>
      
      {/* Middle Layer */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 0.8, 64]} />
        <meshStandardMaterial color="#fdfd96" roughness={0.3} />
      </mesh>

      {/* Top Layer */}
      <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.6, 64]} />
        <meshStandardMaterial color="#aec6cf" roughness={0.3} />
      </mesh>

      {/* Frosting / Cream Decoration - Simple sphere ring */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.5, 2.4, Math.sin(angle) * 1.5]} castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
        );
      })}

      {/* Base Plate */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[3, 3.2, 0.1, 64]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.2} roughness={0.1} />
      </mesh>
    </group>
  );
};

export default Cake;
