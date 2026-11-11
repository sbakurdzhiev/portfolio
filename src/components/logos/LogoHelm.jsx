import React from 'react';

export const LogoHelm = ({ size = 48, className = '' }) => {
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
        <linearGradient id="helm-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--cyber-cyan, #00d4ff)" />
          <stop offset="100%" stopColor="var(--cyber-emerald, #00ff9d)" />
        </linearGradient>
        <radialGradient id="helm-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--cyber-cyan, #00d4ff)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Ambient center glow */}
      <circle cx="50" cy="50" r="30" fill="url(#helm-glow)" />

      {/* Outer Orbit Track */}
      <circle
        cx="50" cy="50" r="42"
        stroke="var(--cyber-border, #1b2d4b)"
        strokeWidth="2"
        strokeDasharray="6 4"
      />

      {/* 7 Tactical Kubernetes Helm Spokes */}
      {[0, 51.4, 102.8, 154.2, 205.7, 257.1, 308.5].map((angle, i) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const x1 = 50 + 16 * Math.cos(rad);
        const y1 = 50 + 16 * Math.sin(rad);
        const x2 = 50 + 38 * Math.cos(rad);
        const y2 = 50 + 38 * Math.sin(rad);
        const pegX = 50 + 44 * Math.cos(rad);
        const pegY = 50 + 44 * Math.sin(rad);

        return (
          <g key={i}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="url(#helm-accent)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Outer Handle / Pod Node */}
            <circle
              cx={pegX} cy={pegY} r="3"
              fill={i === 0 ? "var(--cyber-emerald, #00ff9d)" : "var(--cyber-bg, #05080f)"}
              stroke="var(--cyber-cyan, #00d4ff)"
              strokeWidth="2"
            />
          </g>
        );
      })}

      {/* Inner Central Wheel Ring */}
      <circle
        cx="50" cy="50" r="18"
        fill="var(--cyber-panel, #101a2b)"
        stroke="url(#helm-accent)"
        strokeWidth="2.5"
      />

      {/* Hexagonal Core Hub */}
      <polygon
        points="50,38 60,44 60,56 50,62 40,56 40,44"
        fill="var(--cyber-bg, #05080f)"
        stroke="var(--cyber-cyan, #00d4ff)"
        strokeWidth="2"
      />

      {/* Command Prompt Chevron at Center */}
      <path
        d="M47 46 L52 50 L47 54"
        stroke="var(--cyber-emerald, #00ff9d)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="55" cy="53" r="1.2" fill="var(--cyber-cyan, #00d4ff)" />
    </svg>
  );
};
