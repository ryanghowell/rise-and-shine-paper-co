import React from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="bg-paper-grain py-24">
      <main className="text-center p-12 max-w-3xl mx-auto border-4 border-double border-charcoal/20 bg-off-white/80 backdrop-blur-sm shadow-xl rounded-lg">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-charcoal mb-6 tracking-tight">
          Rise and Shine: Digital Reform
        </h1>
        <p className="text-lg md:text-xl text-charcoal/80 mb-8 font-sans max-w-xl mx-auto">
          Crafting digital experiences with the tangible quality of fine paper.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary">Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </main>
    </div>
  );
}
