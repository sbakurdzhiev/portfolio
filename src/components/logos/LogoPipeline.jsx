import React from 'react';

export const LogoPipeline = ({ size = 48, className = '' }) => {
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
        <linearGradient id="pipe-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--cyber-cyan, #00d4ff)" />
          <stop offset="50%" stopColor="var(--cyber-emerald, #00ff9d)" />
          <stop offset="100%" stopColor="var(--cyber-cyan, #00d4ff)" />
        </linearGradient>
      </defs>

      {/* Hexagonal Outer Frame */}
      <polygon
        points="50,6 90,29 90,71 50,94 10,71 10,29"
        fill="var(--cyber-panel, #101a2b)"
        stroke="var(--cyber-border, #1b2d4b)"
        strokeWidth="3.5"
      />

      {/* Continuous GitOps Delivery Infinity Möbius Path */}
      {/* Left Loop: Source Code, Testing & Build */}
      <path
        d="M50 50 C40 34 22 34 22 50 C22 66 40 66 50 50 Z"
        fill="none"
        stroke="url(#pipe-grad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Loop: Deployment, Observability & GitOps Sync */}
      <path
        d="M50 50 C60 66 78 66 78 50 C78 34 60 34 50 50 Z"
        fill="none"
        stroke="url(#pipe-grad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Intersection Node */}
      <circle cx="50" cy="50" r="3.5" fill="var(--cyber-emerald, #00ff9d)" />

      {/* Directional Flow Chevrons */}
      <path d="M33 38 L37 38 L35 41" stroke="var(--cyber-cyan, #00d4ff)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M67 62 L63 62 L65 59" stroke="var(--cyber-emerald, #00ff9d)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Perimeter Gateway Nodes */}
      <circle cx="50" cy="6" r="3" fill="var(--cyber-emerald, #00ff9d)" />
      <circle cx="90" cy="50" r="2.5" fill="var(--cyber-cyan, #00d4ff)" />
      <circle cx="10" cy="50" r="2.5" fill="var(--cyber-cyan, #00d4ff)" />
      <circle cx="50" cy="94" r="3" fill="var(--cyber-cyan, #00d4ff)" />
    </svg>
  );
};
