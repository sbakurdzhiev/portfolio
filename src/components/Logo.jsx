import React, { useState, useEffect } from 'react';
import { LogoCyberHexSB } from './logos/LogoCyberHexSB';
import { LogoPromptSB } from './logos/LogoPromptSB';
import { LogoEmblemSB } from './logos/LogoEmblemSB';
import { LogoDataflowSB } from './logos/LogoDataflowSB';

export const LOGO_TEMPLATES = [
  { 
    id: 'cyberhex', 
    name: 'Continuous Hex-Ribbon SB', 
    concept: 'Seamless geometric ribbon where S flows directly into dual B chambers inside a sleek hex badge.',
    badge: 'OPTION 1',
    component: LogoCyberHexSB 
  },
  { 
    id: 'prompt', 
    name: 'Terminal Prompt & Cursor SB', 
    concept: 'Double terminal chevrons (S) paired with dual container pod blocks & blinking cursor (B).',
    badge: 'OPTION 2',
    component: LogoPromptSB 
  },
  { 
    id: 'emblem', 
    name: 'Architectural Chamfered SB', 
    concept: 'Monolithic, bold interlocking monogram with 45° technical chamfers and diamond framing.',
    badge: 'OPTION 3',
    component: LogoEmblemSB 
  },
  { 
    id: 'dataflow', 
    name: 'Circuit Dataflow & Cluster SB', 
    concept: 'Illuminated network topology lines forming SB with high-availability cluster nodes.',
    badge: 'OPTION 4',
    component: LogoDataflowSB 
  },
];

export const Logo = ({ size = 42, className = '', templateId = null, showGlow = true }) => {
  const [activeTemplate, setActiveTemplate] = useState('cyberhex');

  useEffect(() => {
    if (templateId) {
      setActiveTemplate(templateId);
      return;
    }

    const saved = localStorage.getItem('portfolio-logo-template') || 'cyberhex';
    setActiveTemplate(saved);

    const handleStorage = () => {
      const updated = localStorage.getItem('portfolio-logo-template') || 'cyberhex';
      setActiveTemplate(updated);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('logo-template-changed', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('logo-template-changed', handleStorage);
    };
  }, [templateId]);

  const currentObj = LOGO_TEMPLATES.find(t => t.id === activeTemplate) || LOGO_TEMPLATES[0];
  const Component = currentObj.component;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105 cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      title={`Active Logo: ${currentObj.name} (${currentObj.concept})`}
    >
      {showGlow && (
        <div 
          className="absolute inset-0 rounded-full blur-md opacity-35 bg-gradient-to-r from-cyber-cyan to-cyber-emerald pointer-events-none transition-opacity duration-300 group-hover:opacity-75"
        />
      )}
      <Component size={size} />
    </div>
  );
};
