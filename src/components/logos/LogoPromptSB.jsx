import React from 'react';

/**
 * Concept 2: Terminal Prompt & Cursor SB
 * Modern, crisp tech branding where 'S' is built from command chevrons and 'B' from dual container pod blocks.
 */
export const LogoPromptSB = ({ size = 48, className = '' }) => {
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
        <linearGradient id="prompt-s-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--cyber-cyan, #00d4ff)" />
          <stop offset="100%" stopColor="var(--cyber-emerald, #00ff9d)" />
        </linearGradient>
        <linearGradient id="prompt-b-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--cyber-emerald, #00ff9d)" />
          <stop offset="100%" stopColor="var(--cyber-cyan, #00d4ff)" />
        </linearGradient>
      </defs>

      {/* Subtle Dark Rounded Backdrop with Tactical Border */}
      <rect
        x="8" y="8"
        width="84" height="84"
        rx="20"
        fill="var(--cyber-panel, #101a2b)"
        stroke="var(--cyber-border, #1b2d4b)"
        strokeWidth="3"
      />

      {/* Top and Bottom Corner Accents */}
      <path d="M16 8 L8 16 M84 8 L92 16 M8 84 L16 92 M92 84 L84 92" stroke="var(--cyber-cyan, #00d4ff)" strokeWidth="2" />

      {/* Letter 'S' - Dynamic Double Chevron Flow */}
      <path
        d="M44 26 L22 26 C17 26 15 30 15 35 C15 41 18 45 25 47 L35 50 C42 52 46 56 46 62 C46 69 41 74 34 74 L14 74"
        stroke="url(#prompt-s-grad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Embedded Terminal Chevrons in the 'S' Curve */}
      <path d="M22 36 L27 40 L22 44" stroke="var(--cyber-cyan, #00d4ff)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M33 56 L38 60 L33 64" stroke="var(--cyber-emerald, #00ff9d)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Letter 'B' - Solid Vertical Spine with Terminal Notch */}
      <line
        x1="55" y1="23"
        x2="55" y2="77"
        stroke="url(#prompt-b-grad)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Top Chamber of 'B' */}
      <path
        d="M55 26 L70 26 C77 26 83 30 83 37 C83 44 77 49 70 49 L55 49"
        stroke="url(#prompt-b-grad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom Chamber of 'B' */}
      <path
        d="M55 49 L72 49 C79 49 85 54 85 62 C85 70 79 74 72 74 L55 74"
        stroke="url(#prompt-b-grad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Blinking Prompt Cursor Accent inside 'B' */}
      <rect x="63" y="34" width="4" height="6" rx="1" fill="var(--cyber-cyan, #00d4ff)" />
      <rect x="63" y="58" width="4" height="6" rx="1" fill="var(--cyber-emerald, #00ff9d)" />
    </svg>
  );
};
