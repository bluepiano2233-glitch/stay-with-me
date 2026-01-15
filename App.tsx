
import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float } from '@react-three/drei';
import Scene from './components/Scene';
import UI from './components/UI';
import { CandleState } from './types';
import { GoogleGenAI } from '@google/genai';

const App: React.FC = () => {
  const [candleState, setCandleState] = useState<CandleState>(CandleState.WAITING);
  const [wish, setWish] = useState<string>("Loading a magical wish...");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleBlow = () => {
    if (candleState === CandleState.WAITING) {
      setCandleState(CandleState.BLOWING);
      setTimeout(() => {
        setCandleState(CandleState.EXTINGUISHED);
      }, 800);
    }
  };

  const handleReset = () => {
    setCandleState(CandleState.WAITING);
    generateWish();
  };

  const generateWish = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Generate a short, heartwarming, and poetic birthday wish (under 20 words) for someone special. Format it as a single line of text.",
      });
      setWish(response.text || "May your days be filled with joy and light!");
    } catch (error) {
      console.error("Gemini failed:", error);
      setWish("Wishing you a year full of magic and wonder!");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    generateWish();
  }, []);

  return (
    <div className="relative w-full h-screen bg-slate-950">
      <Canvas shadows camera={{ position: [0, 5, 12], fov: 45 }}>
        <color attach="background" args={['#0a0a15']} />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <Scene state={candleState} />
          </Float>

          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2.4} 
            far={4.5} 
          />
          
          <OrbitControls 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 2}
            autoRotate={candleState === CandleState.WAITING}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      <UI 
        state={candleState} 
        onBlow={handleBlow} 
        onReset={handleReset} 
        wish={wish}
        isAiLoading={isAiLoading}
      />
    </div>
  );
};

export default App;
