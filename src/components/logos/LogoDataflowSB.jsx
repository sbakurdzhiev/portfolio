import React from 'react';

/**
 * Concept 4: The Circuit & Dataflow Monogram
 * Flowing network and circuit topology lines tracing 'S' and 'B' with illuminated node terminals.
 */
export const LogoDataflowSB = ({ size = 48, className = '' }) => {
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
        <linearGradient id="flow-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--cyber-cyan, #00d4ff)" />
          <stop offset="100%" stopColor="var(--cyber-emerald, #00ff9d)" />
        </linearGradient>
      </defs>

      {/* Hexagonal PCB Chassis */}
      <polygon
        points="50,6 90,29 90,71 50,94 10,71 10,29"
        fill="var(--cyber-panel, #101a2b)"
        stroke="var(--cyber-border, #1b2d4b)"
        strokeWidth="3.5"
      />

      {/* Circuit Grid Grounding Pattern */}
      <path
        d="M26 18 L26 82 M74 18 L74 82"
        stroke="var(--cyber-border, #1b2d4b)"
        strokeWidth="1"
        strokeDasharray="4 6"
        opacity="0.3"
      />

      {/* S Line - Ingress Flow */}
      <path
        d="M44 26 L26 26 L20 34 L20 44 L44 52 L44 64 L38 72 L18 72"
        stroke="url(#flow-grad-1)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* S Node Terminals */}
      <circle cx="44" cy="26" r="3.5" fill="var(--cyber-cyan, #00d4ff)" />
      <circle cx="18" cy="72" r="3.5" fill="var(--cyber-emerald, #00ff9d)" />

      {/* B Line - Dual HA Cluster Mesh */}
      {/* Central Spine */}
      <line
        x1="52" y1="22"
        x2="52" y2="78"
        stroke="url(#flow-grad-1)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Upper Loop */}
      <path
        d="M52 26 L70 26 L78 34 L78 44 L70 50 L52 50"
        stroke="url(#flow-grad-1)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Lower Loop */}
      <path
        d="M52 50 L72 50 L80 58 L80 68 L72 74 L52 74"
        stroke="url(#flow-grad-1)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cluster Nodes inside B */}
      <circle cx="78" cy="38" r="3.5" fill="var(--cyber-cyan, #00d4ff)" />
      <circle cx="80" cy="64" r="3.5" fill="var(--cyber-emerald, #00ff9d)" />
      <circle cx="52" cy="50" r="3" fill="white" />
    </svg>
  );
};
