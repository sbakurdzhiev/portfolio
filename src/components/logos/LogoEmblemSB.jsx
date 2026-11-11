import React from 'react';

/**
 * Concept 3: The Architectural Chamfered SB Monogram
 * Monolithic, bold, high-contrast interlocking monogram with 45-degree technical chamfers.
 */
export const LogoEmblemSB = ({ size = 48, className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`select-none drop-shadow-md ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="emblem-s-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--cyber-cyan, #00d4ff)" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="emblem-b-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--cyber-emerald, #00ff9d)" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Outer Tactical Diamond/Octagon Ring */}
      <polygon
        points="50,4 96,50 50,96 4,50"
        fill="var(--cyber-panel, #101a2b)"
        stroke="var(--cyber-border, #1b2d4b)"
        strokeWidth="3"
      />

      {/* Thin Technical Inner Guide */}
      <polygon
        points="50,12 88,50 50,88 12,50"
        fill="none"
        stroke="var(--cyber-border-bright, #2a4570)"
        strokeWidth="1"
        strokeDasharray="6 4"
        opacity="0.4"
      />

      {/* The Monogram 'S' (Bold Cyan Facet) */}
      <path
        d="M44 26 L26 26 L20 34 L36 50 L44 50 L34 64 L22 64 L18 72 L38 72 L46 64 L36 50 L28 50 L36 34 L44 34 Z"
        fill="url(#emblem-s-grad)"
        stroke="var(--cyber-cyan, #00d4ff)"
        strokeWidth="1"
      />

      {/* The Monogram 'B' (Bold Emerald Facet with Chamfered Windows) */}
      {/* Outer 'B' Silhouette */}
      <path
        d="M48 24 L72 24 L82 34 L74 48 L82 58 L72 74 L48 74 Z"
        fill="url(#emblem-b-grad)"
        stroke="var(--cyber-emerald, #00ff9d)"
        strokeWidth="1"
      />

      {/* Negative Space Upper Window */}
      <polygon
        points="56,32 68,32 74,38 68,44 56,44"
        fill="var(--cyber-panel, #101a2b)"
      />

      {/* Negative Space Lower Window */}
      <polygon
        points="56,52 68,52 74,58 68,66 56,66"
        fill="var(--cyber-panel, #101a2b)"
      />

      {/* Center Telemetry Pulse */}
      <circle cx="50" cy="50" r="2.5" fill="white" />
      <circle cx="50" cy="4" r="2" fill="var(--cyber-cyan, #00d4ff)" />
      <circle cx="50" cy="96" r="2" fill="var(--cyber-emerald, #00ff9d)" />
    </svg>
  );
};
