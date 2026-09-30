import React, { Suspense } from 'react';
import IntakeFlow from '@/app/components/intake/IntakeFlow';

export default function IntakePage() {
  return (
    <div className="min-h-screen bg-obsidian-base py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white font-display mb-4">Define Your Path</h1>
          <p className="text-lg text-zinc-400 font-mono">
            Tell us what you want to master. We'll synthesize the noise into a single sequence.
          </p>
        </header>
        <Suspense fallback={<div className="text-center text-zinc-500 font-mono animate-pulse">Initializing Architect...</div>}>
          <IntakeFlow />
        </Suspense>
      </div>
    </div>
  );
}
