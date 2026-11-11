import React, { useState, useEffect } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

export const THEMES = [
  { id: 'cyber', name: 'Tactical Cyber', tag: 'CYBER', dot: 'bg-[#00d4ff]' },
  { id: 'amber', name: 'Amber Phosphor CRT', tag: 'AMBER', dot: 'bg-[#ffb000]' },
  { id: 'tokyonight', name: 'Tokyo Night Neovim', tag: 'TOKYO', dot: 'bg-[#7dcfff]' },
  { id: 'matrix', name: 'Matrix Terminal', tag: 'MATRIX', dot: 'bg-[#00ff41]' },
];

export const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState('cyber');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') || 'cyber';
    setTheme(saved, false);
  }, []);

  const setTheme = (themeId, playSfx = true) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('portfolio-theme', themeId);
    if (playSfx) {
      sound.playBeep(700, 0.04);
    }
  };

  const handleNextTheme = () => {
    const idx = THEMES.findIndex(t => t.id === currentTheme);
    const nextIdx = (idx + 1) % THEMES.length;
    setTheme(THEMES[nextIdx].id, true);
  };

  const activeThemeObj = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="px-2.5 py-1.5 rounded border border-cyber-border bg-cyber-bg hover:border-cyber-cyan text-cyber-text hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono shadow-sm group"
        title="Toggle Color Theme"
      >
        <span className={`w-2 h-2 rounded-full ${activeThemeObj.dot} ring-1 ring-white/30`} />
        <Palette className="w-3.5 h-3.5 text-cyber-cyan" />
        <span className="hidden md:inline text-[11px] font-semibold">THEME: {activeThemeObj.tag}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-1.5 w-52 bg-cyber-surface border border-cyber-border rounded-lg shadow-2xl py-1 z-50 font-mono text-xs animate-fadeIn">
            <div className="px-3 py-1.5 border-b border-cyber-border/70 text-[10px] text-cyber-muted uppercase tracking-wider flex items-center justify-between">
              <span>COLOR PALETTE</span>
              <button 
                onClick={handleNextTheme} 
                className="text-cyber-cyan hover:underline text-[9px]"
              >
                Next &gt;
              </button>
            </div>

            <div className="p-1 space-y-0.5">
              {THEMES.map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setTheme(theme.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-cyber-panel text-cyber-cyan font-bold border border-cyber-cyan/40 shadow-glow-subtle'
                        : 'text-slate-300 hover:bg-cyber-bg hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`} />
                      <span>{theme.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyber-emerald" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
