"use client";
import React from 'react';

interface LoadMeterProps {
  currentLoad: number;
  maxLoad: number;
}

export default function LoadMeter({ currentLoad, maxLoad }: LoadMeterProps) {
  const percentage = Math.min((currentLoad / maxLoad) * 100, 100);
  const isOverloaded = currentLoad > maxLoad * 0.8;

  return (
    <div className="flex flex-col items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-surface/50 border border-obsidian-border backdrop-blur-sm">
      <div className="flex justify-between items-center w-full px-2">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System Load</span>
        <span className={`text-[10px] font-mono font-bold ${isOverloaded ? 'text-red-400 animate-pulse' : 'text-neonBlue-accent'}`}>
          {currentLoad} / {maxLoad} Units
        </span>
      </div>
      <div className="w-48 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
        <div
          className={`h-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,240,255,0.3)] ${
            isOverloaded ? 'bg-red-500 shadow-red-500/50' : 'bg-neonBlue-glow'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
