import React from 'react';

export const HeroLighting: React.FC = React.memo(() => {
  const maskStyle: React.CSSProperties = {
    maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%)'
  };

  return (
    <>
      {/* 1. Electric Starlight Particle Arc & Dynamic Laser Filaments */}
      <div
        className="absolute top-0 left-0 right-0 -z-10 h-[880px] w-full overflow-hidden pointer-events-none select-none"
        style={maskStyle}
      >
        <svg
          className="absolute inset-0 w-full h-full opacity-70 pointer-events-none"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMin slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="laserGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.2" />
              <stop offset="30%" stopColor="#2563eb" stopOpacity="0.8" />
              <stop offset="55%" stopColor="#00e5ff" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="laserGradSecondary" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
              <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#60a5fa" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
            </linearGradient>

            <filter id="electricLaserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="16" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Primary Sweeping Electric Arc matching screenshot starlight curve */}
          <path
            d="M 60 180 C 380 320, 680 180, 980 310 S 1380 240, 1440 380"
            stroke="url(#laserGradPrimary)"
            strokeWidth="2"
            strokeDasharray="6 10"
            filter="url(#electricLaserGlow)"
            className="animate-pulse"
            style={{ animationDuration: '3.5s' }}
          />

          {/* Secondary Higher Contrast Laser Line */}
          <path
            d="M 120 120 C 440 260, 780 360, 1080 260 S 1360 160, 1440 280"
            stroke="url(#laserGradSecondary)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            opacity="0.6"
            filter="url(#electricLaserGlow)"
          />

          {/* Fine Starlight Cyan Horizon Laser Filament */}
          <path
            d="M 0 240 Q 720 180 1440 290"
            stroke="#00e5ff"
            strokeWidth="1"
            opacity="0.3"
            filter="url(#electricLaserGlow)"
          />

          {/* Pulsing Constellation Starlight Sparkles */}
          <circle cx="340" cy="240" r="2.5" fill="#ffffff" filter="url(#electricLaserGlow)" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="680" cy="210" r="2" fill="#00e5ff" filter="url(#electricLaserGlow)" className="animate-pulse" style={{ animationDuration: '2s' }} />
          <circle cx="980" cy="310" r="2.5" fill="#60a5fa" filter="url(#electricLaserGlow)" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
          <circle cx="1180" cy="230" r="3" fill="#ffffff" filter="url(#electricLaserGlow)" className="animate-ping" style={{ animationDuration: '4s' }} />
          <circle cx="520" cy="280" r="1.5" fill="#93c5fd" opacity="0.8" />
          <circle cx="840" cy="290" r="1.5" fill="#38bdf8" opacity="0.8" />
        </svg>
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
          className="absolute top-[-60px] left-1/2 h-[560px] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18),rgba(0,229,255,0.06),transparent_70%)] opacity-70 blur-3xl pointer-events-none"
        />

        {/* Lateral Cyan Light Spill */}
        <div className="absolute top-[180px] right-[12%] h-[380px] w-[420px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.14),transparent_65%)] opacity-50 blur-3xl pointer-events-none" />

        {/* Deep Bottom Royal Blue Ground Spill */}
        <div className="absolute bottom-[10%] left-[10%] h-[320px] w-[460px] bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.15),transparent_70%)] opacity-40 blur-3xl pointer-events-none" />
      </div>
    </>
  );
});
