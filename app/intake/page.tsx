import React from 'react';
import IntakeFlow from '@/app/components/intake/IntakeFlow';

export default function IntakePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Define Your Path</h1>
          <p className="text-lg text-slate-600">
            Tell us what you want to master. We'll synthesize the noise into a single sequence.
          </p>
        </header>
        <IntakeFlow />
      </div>
    </div>
  );
}
