import React from 'react';
import { LogoPromptSB } from './logos/LogoPromptSB';

export const Logo = ({ size = 42, className = '', showGlow = true }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
      title="Stefan Bakurdzhiev // Senior DevOps Engineer"
    >
      {showGlow && (
        <div 
          className="absolute inset-0 rounded-full blur-md opacity-35 bg-gradient-to-r from-cyber-cyan to-cyber-emerald pointer-events-none transition-opacity duration-300 group-hover:opacity-75"
        />
      )}
      <LogoPromptSB size={size} />
    </div>
  );
};
