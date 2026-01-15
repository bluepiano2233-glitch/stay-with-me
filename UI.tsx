
import React from 'react';
import { CandleState } from '../types';

interface UIProps {
  state: CandleState;
  onBlow: () => void;
  onReset: () => void;
  wish: string;
  isAiLoading: boolean;
}

const UI: React.FC<UIProps> = ({ state, onBlow, onReset, wish, isAiLoading }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-8">
      {/* Header */}
      <div className="text-center mt-12 animate-fade-in pointer-events-auto">
        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg tracking-tight">
          Happy Birthday!
        </h1>
        <div className="h-1 w-24 bg-pink-500 mx-auto rounded-full mb-4"></div>
      </div>

      {/* Message Box */}
      <div className="max-w-md w-full bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center animate-slide-up pointer-events-auto transition-all">
        {isAiLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-.5s]"></div>
          </div>
        ) : (
          <p className="text-white text-lg italic font-light leading-relaxed">
            "{wish}"
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="mb-12 flex flex-col items-center space-y-4 pointer-events-auto">
        {state === CandleState.WAITING && (
          <button
            onClick={onBlow}
            className="group relative px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full text-white font-bold text-xl shadow-2xl hover:scale-105 transition-transform active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              💨 Blow Out the Candles
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        )}

        {(state === CandleState.EXTINGUISHED || state === CandleState.BLOWING) && (
          <div className="text-center animate-bounce-in">
            <p className="text-pink-400 font-medium mb-4 text-lg">Make a wish! ✨</p>
            <button
              onClick={onReset}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors backdrop-blur-sm"
            >
              Reset Scene
            </button>
          </div>
        )}
        
        <p className="text-white/40 text-xs">AI-Powered Magic & 3D WebGL Interaction</p>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default UI;
