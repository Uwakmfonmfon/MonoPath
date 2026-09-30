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
    <div className="flex flex-col items-end gap-1">
      <div className="flex justify-between items-center w-full px-1">
        <span className="text-[9px] font-mono text-mutedZinc uppercase tracking-widest">System Load</span>
        <span className={`text-[9px] font-mono font-bold transition-colors ${isOverloaded ? 'text-red-400' : 'text-focusTeal'}`}>
          {currentLoad} / {maxLoad} Units
        </span>
      </div>
      <div className="w-32 h-1 bg-obsidian-base rounded-full overflow-hidden border border-obsidian-border">
        <div
          className={`h-full transition-all duration-1000 ${
            isOverloaded ? 'bg-red-500' : 'bg-focusTeal'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
