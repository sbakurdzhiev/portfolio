import React from 'react';

export const LogoMonogram = ({ size = 48, className = '' }) => {
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
        <linearGradient id="mono-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--cyber-cyan, #00d4ff)" />
          <stop offset="100%" stopColor="var(--cyber-emerald, #00ff9d)" />
        </linearGradient>
      </defs>

      {/* Hexagonal Outer Boundary Frame */}
      <polygon
        points="50,6 88,28 88,72 50,94 12,72 12,28"
        fill="var(--cyber-panel, #101a2b)"
        stroke="var(--cyber-border, #1b2d4b)"
        strokeWidth="3"
      />

      {/* Isometric Grid Accent Guidelines */}
      <path
        d="M50 6 L50 94 M12 28 L88 72 M12 72 L88 28"
        stroke="var(--cyber-border, #1b2d4b)"
        strokeWidth="1"
        strokeDasharray="4 6"
        opacity="0.4"
      />

      {/* The "S" Path - Top Section */}
      <path
        d="M66 26 L38 26 L26 38 L54 50 L74 50"
        stroke="url(#mono-grad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* The "B" Path - Bottom Section with Double Pod Loop */}
      <path
        d="M26 38 L26 76 L62 76 L74 66 L62 50 L74 50"
        stroke="url(#mono-grad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Crossbar divider connecting the clusters */}
      <line
        x1="26" y1="50"
        x2="60" y2="50"
        stroke="var(--cyber-cyan, #00d4ff)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Active Cluster Beacons */}
      <circle cx="66" cy="26" r="3" fill="var(--cyber-emerald, #00ff9d)" />
      <circle cx="74" cy="66" r="3" fill="var(--cyber-cyan, #00d4ff)" />
      <circle cx="26" cy="76" r="3" fill="var(--cyber-cyan, #00d4ff)" />

      {/* Corner bracket ticks */}
      <path d="M50 6 L56 9.5" stroke="var(--cyber-cyan, #00d4ff)" strokeWidth="2.5" />
      <path d="M50 94 L44 90.5" stroke="var(--cyber-emerald, #00ff9d)" strokeWidth="2.5" />
    </svg>
  );
};
