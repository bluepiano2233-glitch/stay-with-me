
import React from 'react';
import Cake from './Cake';
import Candle from './Candle';
import { CandleState } from '../types';

interface SceneProps {
  state: CandleState;
}

const Scene: React.FC<SceneProps> = ({ state }) => {
  return (
    <group position={[0, -1, 0]}>
      {/* The Birthday Cake */}
      <Cake />
      
      {/* Multiple Candles arranged in a circle */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        const radius = 1.2;
        return (
          <Candle 
            key={i} 
            position={[Math.cos(angle) * radius, 2.3, Math.sin(angle) * radius]} 
            state={state}
            delay={i * 0.1}
          />
        );
      })}
      
      {/* Center Candle */}
      <Candle position={[0, 2.3, 0]} state={state} delay={0.5} scale={1.2} />
    </group>
  );
};

export default Scene;
