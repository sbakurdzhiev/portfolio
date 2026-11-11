import React, { useState, useEffect } from 'react';
import { LogoHelm } from './logos/LogoHelm';
import { LogoMonogram } from './logos/LogoMonogram';
import { LogoShield } from './logos/LogoShield';
import { LogoPipeline } from './logos/LogoPipeline';

export const LOGO_TEMPLATES = [
  { id: 'helm', name: 'Tactical K8s Helm', concept: 'Kubernetes Control Plane & Microservice Hub', component: LogoHelm },
  { id: 'monogram', name: 'Isometric SB Matrix', concept: 'Circuit Monogram & Active Beacons', component: LogoMonogram },
  { id: 'shield', name: 'Hardened SRE Shield', concept: 'Cybersecurity & 3-Node Resilient Topology', component: LogoShield },
  { id: 'pipeline', name: 'GitOps Hex-Fabric', concept: 'Continuous Delivery Möbius & Canary Sync', component: LogoPipeline },
];

export const Logo = ({ size = 42, className = '', templateId = null, showGlow = true }) => {
  const [activeTemplate, setActiveTemplate] = useState('helm');

  useEffect(() => {
    if (templateId) {
      setActiveTemplate(templateId);
      return;
    }

    const saved = localStorage.getItem('portfolio-logo-template') || 'helm';
    setActiveTemplate(saved);

    const handleStorage = () => {
      const updated = localStorage.getItem('portfolio-logo-template') || 'helm';
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
