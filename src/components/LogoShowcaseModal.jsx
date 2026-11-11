import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Layers, ShieldCheck, Compass, GitMerge } from 'lucide-react';
import { LOGO_TEMPLATES } from './Logo';
import { sound } from '../utils/audio';

export const LogoShowcaseModal = ({ isOpen, onClose }) => {
  const [currentId, setCurrentId] = useState('helm');

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-logo-template') || 'helm';
    setCurrentId(saved);
  }, [isOpen]);

  if (!isOpen) return null;

  const selectLogo = (id) => {
    setCurrentId(id);
    localStorage.setItem('portfolio-logo-template', id);
    window.dispatchEvent(new Event('logo-template-changed'));
    sound.playDeploySuccess();
  };

  const getIcon = (id) => {
    switch (id) {
      case 'helm': return Compass;
      case 'monogram': return Layers;
      case 'shield': return ShieldCheck;
      case 'pipeline': return GitMerge;
      default: return Sparkles;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono animate-fadeIn">
      <div className="bg-cyber-surface border-2 border-cyber-cyan rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-glow-cyan corner-bracket relative">
        {/* Modal Header */}
        <div className="sticky top-0 bg-cyber-panel px-6 py-4 border-b border-cyber-border flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-pulse" />
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wider">
                TACTICAL LOGO TEMPLATE SELECTOR // 4 BESPOKE CONCEPTS
              </h3>
            </div>
            <p className="text-xs text-cyber-muted mt-0.5">
              Engineered specifically for Stefan Bakurdzhiev • Senior DevOps & OpenShift / Kubernetes Expert
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded bg-cyber-bg border border-cyber-border text-slate-400 hover:text-white hover:border-slate-400 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {LOGO_TEMPLATES.map((tmpl, idx) => {
            const Icon = getIcon(tmpl.id);
            const Component = tmpl.component;
            const isSelected = currentId === tmpl.id;

            return (
              <div
                key={tmpl.id}
                onClick={() => selectLogo(tmpl.id)}
                className={`p-5 rounded-lg border-2 transition-all cursor-pointer flex flex-col justify-between group relative ${
                  isSelected
                    ? 'bg-cyber-panel/90 border-cyber-cyan shadow-glow-cyan ring-1 ring-cyber-cyan/50'
                    : 'bg-cyber-bg/70 border-cyber-border hover:border-slate-500 hover:bg-cyber-bg'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-cyan font-bold flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-cyber-cyan" />
                    OPTION {idx + 1}
                  </span>

                  {isSelected ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 border border-cyber-emerald text-cyber-emerald font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      ACTIVE LOGO
                    </span>
                  ) : (
                    <span className="text-[10px] text-cyber-muted group-hover:text-slate-300">
                      Click to activate
                    </span>
                  )}
                </div>

                {/* Logo Graphic Center */}
                <div className="py-4 flex justify-center items-center">
                  <div className="p-4 rounded-xl bg-cyber-panel/60 border border-cyber-border/70 group-hover:scale-110 transition-transform duration-300">
                    <Component size={76} />
                  </div>
                </div>

                {/* Concept Info */}
                <div className="mt-3 space-y-2 border-t border-cyber-border/50 pt-3">
                  <h4 className="font-bold text-white text-sm group-hover:text-cyber-cyan transition-colors">
                    {tmpl.name}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tmpl.concept}
                  </p>
                </div>

                {/* Selection Button */}
                <button
                  type="button"
                  className={`mt-4 w-full py-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyber-cyan to-cyber-emerald text-black font-extrabold shadow-glow-cyan'
                      : 'bg-cyber-panel border border-cyber-border text-slate-300 group-hover:border-cyber-cyan group-hover:text-white'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>SELECTED & ACTIVE</span>
                    </>
                  ) : (
                    <span>SELECT THIS TEMPLATE</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="bg-cyber-panel px-6 py-3 border-t border-cyber-border flex items-center justify-between text-xs text-cyber-muted">
          <span>Active selection automatically updates everywhere on the site</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-cyber-cyan text-black font-bold text-xs hover:opacity-90 cursor-pointer"
          >
            CONFIRM & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
