import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    UnicornStudio?: {
      init: () => void;
      destroy: () => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadUnicornStudio(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      const existing = document.querySelector('script[src*="unicornStudio"]');
      if (existing) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null;
        script.remove();
        resolve();
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

interface HeroLightingProps {
  projectId?: string;
}

export const HeroLighting: React.FC<HeroLightingProps> = ({
  projectId = 'bKN5upvoulAmWvInmHza'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mounted = true;

    loadUnicornStudio().then(() => {
      if (mounted && window.UnicornStudio) {
        try {
          window.UnicornStudio.init();
        } catch (e) {
          console.warn('UnicornStudio lighting init notice:', e);
        }
      }
    });

    return () => {
      mounted = false;
      try {
        window.UnicornStudio?.destroy();
      } catch (e) {
        // Safe cleanup
      }
    };
  }, []);

  const maskStyle = {
    maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)'
  };

  return (
    <>
      {/* 1. UnicornStudio Interactive Particle Arc / Lightning Shader Canvas */}
      <div
        className="absolute top-0 left-0 right-0 -z-10 h-[920px] w-full overflow-hidden pointer-events-none select-none"
        style={maskStyle}
      >
        <div
          ref={containerRef}
          data-us-project={projectId}
          className="absolute inset-0 h-full w-full pointer-events-none"
        />
      </div>

      {/* 2. Ambient Volumetric Lighting Glows */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        style={maskStyle}
      >
        {/* Subtle background grid guidelines */}
        <div className="grid-lines absolute inset-0 mx-auto max-w-7xl border-r border-l border-white/[0.03]" />

        {/* Central High-Intensity Atmosphere Radial Lighting */}
        <div
          className="absolute top-[-40px] left-1/2 h-[560px] w-[88vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18),rgba(0,229,255,0.06),transparent_70%)] opacity-70 blur-3xl animate-pulse"
          style={{ animationDuration: '6s' }}
        />

        {/* Lateral Cyan Light Spill */}
        <div className="absolute top-[180px] right-[15%] h-[380px] w-[420px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.14),transparent_65%)] opacity-50 blur-3xl" />
      </div>
    </>
  );
};
