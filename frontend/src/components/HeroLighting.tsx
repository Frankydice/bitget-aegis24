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
    let timer: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;

    const tryInit = () => {
      if (!mounted) return;
      if (window.UnicornStudio?.init) {
        try {
          window.UnicornStudio.init();
        } catch (e) {
          console.warn('UnicornStudio lighting init notice:', e);
        }
      } else if (attempts < 20) {
        attempts++;
        timer = setTimeout(tryInit, 200);
      }
    };

    loadUnicornStudio().then(() => {
      if (mounted) {
        tryInit();
      }
    });

    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
      try {
        window.UnicornStudio?.destroy();
      } catch (e) {
        // Safe cleanup
      }
    };
  }, []);

  const maskStyle = {
    maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)'
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

        {/* 2. Layered Electric Lightning Shimmer & Particle Wave (ensures immediate vibrant lighting) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#00e5ff" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.3" />
            </linearGradient>
            <filter id="electricGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur1" />
              <feGaussianBlur stdDeviation="24" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sweeping Electric Arc matching screenshot starlight curve */}
          <path
            d="M 120 180 Q 450 320 620 280 T 1080 340"
            stroke="url(#lightningGrad)"
            strokeWidth="1.5"
            strokeDasharray="8 12"
            filter="url(#electricGlow)"
            className="animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <path
            d="M 80 120 C 320 240, 520 360, 780 260 S 1120 200, 1160 380"
            stroke="url(#lightningGrad)"
            strokeWidth="2"
            strokeDasharray="4 8"
            opacity="0.5"
            filter="url(#electricGlow)"
          />

          {/* Constellation Star Sparkles */}
          <circle cx="280" cy="220" r="2.5" fill="#ffffff" filter="url(#electricGlow)" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="580" cy="290" r="2" fill="#00e5ff" filter="url(#electricGlow)" className="animate-pulse" style={{ animationDuration: '2s' }} />
          <circle cx="820" cy="270" r="2" fill="#60a5fa" filter="url(#electricGlow)" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
          <circle cx="980" cy="320" r="3" fill="#ffffff" filter="url(#electricGlow)" className="animate-ping" style={{ animationDuration: '4s' }} />
        </svg>
      </div>

      {/* 3. Ambient Volumetric Lighting Glows */}
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
