import React from 'react';

export const Logo = ({ size = 40, className = '', showGlow = true }) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
    >
      {showGlow && (
        <div 
          className="absolute inset-0 rounded-full blur-md opacity-40 bg-gradient-to-r from-cyber-cyan to-cyber-emerald pointer-events-none transition-opacity duration-300 group-hover:opacity-75"
        />
      )}

      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="relative z-10 drop-shadow-sm select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-cyan-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--cyber-cyan, #00d4ff)" />
            <stop offset="100%" stopColor="var(--cyber-emerald, #00ff9d)" />
          </linearGradient>

          <linearGradient id="logo-surface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--cyber-panel, #101a2b)" />
            <stop offset="100%" stopColor="var(--cyber-bg, #05080f)" />
          </linearGradient>

          <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="var(--cyber-cyan, #00d4ff)" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Outer Tactical Hexagon Frame */}
        <polygon
          points="50,5 92,28 92,72 50,95 8,72 8,28"
          fill="url(#logo-surface)"
          stroke="var(--cyber-border, #1b2d4b)"
          strokeWidth="3.5"
        />

        {/* Outer Accent Orbit Ring */}
        <polygon
          points="50,9 88,30 88,70 50,91 12,70 12,30"
          fill="none"
          stroke="url(#logo-cyan-emerald)"
          strokeWidth="1.5"
          strokeDasharray="18 8"
          className="opacity-70"
        />

        {/* Tactical Corner Brackets on the Hexagon */}
        <path d="M50 5 L58 9.5 M50 5 L42 9.5" stroke="var(--cyber-emerald, #00ff9d)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M92 28 L84 32.5 M92 28 L92 37" stroke="var(--cyber-cyan, #00d4ff)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M92 72 L84 67.5 M92 72 L92 63" stroke="var(--cyber-cyan, #00d4ff)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M50 95 L58 90.5 M50 95 L42 90.5" stroke="var(--cyber-emerald, #00ff9d)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M8 72 L16 67.5 M8 72 L8 63" stroke="var(--cyber-cyan, #00d4ff)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M8 28 L16 32.5 M8 28 L8 37" stroke="var(--cyber-cyan, #00d4ff)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Stylized "S" & "B" Interlocking Tactical Glyph */}
        {/* Upper S Arc / Terminal Chevron */}
        <path
          d="M32 35 L48 24 L64 35 L50 48 L32 48"
          fill="none"
          stroke="url(#logo-cyan-emerald)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Lower B Node / Kubernetes Container Pod Loop */}
        <path
          d="M32 48 L60 48 C67 48 72 53 72 60 C72 67 67 72 60 72 L32 72 Z"
          fill="none"
          stroke="url(#logo-cyan-emerald)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Vertical Backbone Spine */}
        <line
          x1="32" y1="24"
          x2="32" y2="76"
          stroke="var(--cyber-cyan, #00d4ff)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Central Orchestration Core / Telemetry Pulse */}
        <circle cx="50" cy="48" r="3" fill="var(--cyber-emerald, #00ff9d)" />
        <circle cx="68" cy="35" r="2" fill="var(--cyber-cyan, #00d4ff)" className="animate-ping" style={{ transformOrigin: '68px 35px' }} />
      </svg>
    </div>
  );
};
