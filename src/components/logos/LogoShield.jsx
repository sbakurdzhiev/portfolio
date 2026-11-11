import React from 'react';

export const LogoShield = ({ size = 48, className = '' }) => {
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
        <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--cyber-cyan, #00d4ff)" />
          <stop offset="100%" stopColor="var(--cyber-emerald, #00ff9d)" />
        </linearGradient>
        <linearGradient id="shield-bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--cyber-panel, #101a2b)" />
          <stop offset="100%" stopColor="var(--cyber-bg, #05080f)" />
        </linearGradient>
      </defs>

      {/* Tactical Ballistic Shield Outer Contour */}
      <path
        d="M50 8 L86 22 L86 52 C86 72 50 92 50 92 C50 92 14 72 14 52 L14 22 Z"
        fill="url(#shield-bg)"
        stroke="var(--cyber-border, #1b2d4b)"
        strokeWidth="3.5"
      />

      {/* Inner Accent Inset Border */}
      <path
        d="M50 14 L80 26 L80 50 C80 66 50 84 50 84 C50 84 20 66 20 50 L20 26 Z"
        fill="none"
        stroke="url(#shield-grad)"
        strokeWidth="1.5"
        strokeDasharray="14 6"
        opacity="0.75"
      />

      {/* 3-Node Kubernetes Cluster Topology */}
      {/* Node 1: Master Node (Top) */}
      <circle cx="50" cy="32" r="5" fill="var(--cyber-panel, #101a2b)" stroke="var(--cyber-emerald, #00ff9d)" strokeWidth="2.5" />
      <circle cx="50" cy="32" r="2" fill="var(--cyber-emerald, #00ff9d)" />

      {/* Node 2: Worker Node Left */}
      <circle cx="34" cy="58" r="4.5" fill="var(--cyber-panel, #101a2b)" stroke="var(--cyber-cyan, #00d4ff)" strokeWidth="2" />
      <circle cx="34" cy="58" r="1.5" fill="var(--cyber-cyan, #00d4ff)" />

      {/* Node 3: Worker Node Right */}
      <circle cx="66" cy="58" r="4.5" fill="var(--cyber-panel, #101a2b)" stroke="var(--cyber-cyan, #00d4ff)" strokeWidth="2" />
      <circle cx="66" cy="58" r="1.5" fill="var(--cyber-cyan, #00d4ff)" />

      {/* Encrypted Data Mesh Interconnects */}
      <line x1="50" y1="37" x2="34" y2="53.5" stroke="var(--cyber-cyan, #00d4ff)" strokeWidth="2" strokeDasharray="3 3" />
      <line x1="50" y1="37" x2="66" y2="53.5" stroke="var(--cyber-cyan, #00d4ff)" strokeWidth="2" strokeDasharray="3 3" />
      <line x1="38.5" y1="58" x2="61.5" y2="58" stroke="var(--cyber-cyan, #00d4ff)" strokeWidth="2" strokeDasharray="3 3" />

      {/* Tactical Center Command Prompt Chevron */}
      <path
        d="M45 44 L52 48 L45 52"
        stroke="var(--cyber-emerald, #00ff9d)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="54" y1="52" x2="58" y2="52" stroke="var(--cyber-cyan, #00d4ff)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Shield Bottom Anchor Dot */}
      <circle cx="50" cy="74" r="2" fill="var(--cyber-emerald, #00ff9d)" />
    </svg>
  );
};
