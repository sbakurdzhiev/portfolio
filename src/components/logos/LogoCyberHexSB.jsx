import React from 'react';

/**
 * Concept 1: The Continuous Hex-Ribbon SB Monogram
 * A continuous precision-cut ribbon where S folds seamlessly into B within a sleek hexagonal profile.
 */
export const LogoCyberHexSB = ({ size = 48, className = '' }) => {
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
        <linearGradient id="hex-sb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--cyber-cyan, #00d4ff)" />
          <stop offset="100%" stopColor="var(--cyber-emerald, #00ff9d)" />
        </linearGradient>
        <linearGradient id="hex-sb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--cyber-panel, #101a2b)" />
          <stop offset="100%" stopColor="var(--cyber-bg, #05080f)" />
        </linearGradient>
      </defs>

      {/* Hexagonal Base Badge */}
      <polygon
        points="50,4 92,27 92,73 50,96 8,73 8,27"
        fill="url(#hex-sb-bg)"
        stroke="var(--cyber-border, #1b2d4b)"
        strokeWidth="3"
      />

      {/* Outer Accent Glow Ring */}
      <polygon
        points="50,9 87,29 87,71 50,91 13,71 13,29"
        fill="none"
        stroke="var(--cyber-border-bright, #2a4570)"
        strokeWidth="1"
        strokeDasharray="4 6"
        opacity="0.5"
      />

      {/* Monogram 'S' Path (Top-Left Flow) */}
      <path
        d="M48 24 L24 24 L24 46 L50 46"
        stroke="url(#hex-sb-grad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50 46 L24 46 L24 74 L48 74"
        stroke="url(#hex-sb-grad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Monogram 'B' Spine and Dual Loops (Right Side Flow) */}
      <line
        x1="52" y1="22"
        x2="52" y2="76"
        stroke="var(--cyber-cyan, #00d4ff)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Top B Chamber */}
      <path
        d="M52 24 L68 24 C76 24 80 29 80 36 C80 43 75 48 66 48 L52 48"
        stroke="url(#hex-sb-grad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom B Chamber */}
      <path
        d="M52 48 L70 48 C78 48 82 54 82 62 C82 70 76 76 66 76 L52 76"
        stroke="url(#hex-sb-grad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Prompt Accent Dot */}
      <circle cx="52" cy="48" r="2.5" fill="var(--cyber-emerald, #00ff9d)" />
      <circle cx="48" cy="24" r="2" fill="var(--cyber-cyan, #00d4ff)" />
      <circle cx="48" cy="74" r="2" fill="var(--cyber-emerald, #00ff9d)" />
    </svg>
  );
};
