import React, { useState, useEffect } from 'react';
import { Terminal, Volume2, VolumeX, Monitor, Server, Activity, ExternalLink, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LogoShowcaseModal } from './LogoShowcaseModal';
import { sound } from '../utils/audio';

export const HeaderTelemetry = ({ soundEnabled, setSoundEnabled, crtEnabled, setCrtEnabled, onOpenCli }) => {
  const [time, setTime] = useState('');
  const [ping, setPing] = useState(14);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    const pingInterval = setInterval(() => {
      setPing(Math.floor(12 + Math.random() * 6));
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(pingInterval);
    };
  }, []);

  const handleSoundToggle = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
  };

  const handleCrtToggle = () => {
    setCrtEnabled(prev => !prev);
    sound.playBeep(440, 0.05);
  };

  return (
    <header className="border-b border-cyber-border bg-cyber-surface/90 backdrop-blur sticky top-0 z-30 select-none">
      {/* Top micro telemetry ribbon */}
      <div className="px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px] border-b border-cyber-border/40 text-cyber-muted font-mono gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyber-emerald font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-emerald"></span>
            </span>
            NODE: k8s-master-sofia-01 [READY]
          </span>
          <span className="hidden sm:inline text-cyber-border">|</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-300">
            <Server className="w-3 h-3 text-cyber-cyan" />
            OCP 4.14 / k8s v1.28
          </span>
          <span className="hidden md:inline text-cyber-border">|</span>
          <span className="hidden md:flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyber-emerald" />
            PING: <span className="text-cyber-cyan">{ping}ms</span> (eu-central-1)
          </span>
        </div>

        <div className="flex items-center gap-4 text-right">
          <span className="hidden lg:inline text-slate-400 font-mono">
            SYS: {time || '2026-11-11 09:00:00 UTC'}
          </span>
          <div className="flex items-center gap-1 bg-cyber-bg border border-cyber-border/80 px-2 py-0.5 rounded text-[10px] text-cyber-cyan">
            <span>UPTIME:</span>
            <span className="text-cyber-emerald font-bold">10y 5m (99.99%)</span>
          </div>
        </div>
      </div>

      {/* Main branding & quick controls */}
      <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Clickable Logo opens template selector */}
          <button
            onClick={() => {
              sound.playBeep(650, 0.05);
              setIsLogoModalOpen(true);
            }}
            title="Click to Choose Logo Template"
            className="group relative cursor-pointer"
          >
            <Logo size={42} />
            <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-cyber-panel border border-cyber-cyan/50 text-[8px] text-cyber-cyan font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              CHANGE
            </span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wider flex items-center gap-2">
                STEFAN BAKURDZHIEV
                <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan">
                  LEAD DEVOPS
                </span>
              </h1>
            </div>
            <p className="text-xs text-cyber-muted font-mono flex items-center gap-1.5">
              <span className="text-cyber-emerald">stefan@k8s-master:~$</span>
              <span className="hidden sm:inline">OpenShift & Kubernetes Specialist • Platform Engineer</span>
            </p>
          </div>
        </div>

        {/* Toggles, Logo Picker, Theme Switcher & CLI Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 text-xs font-mono">
          {/* Logo Selector Trigger */}
          <button
            onClick={() => {
              sound.playBeep(650, 0.05);
              setIsLogoModalOpen(true);
            }}
            className="px-2.5 py-1.5 rounded border border-cyber-border bg-cyber-bg hover:border-cyber-cyan text-cyber-text hover:text-white transition-all flex items-center gap-1.5 text-xs shadow-sm cursor-pointer"
            title="Choose from 4 Bespoke Logo Templates"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyber-emerald" />
            <span className="hidden md:inline text-[11px] font-semibold">LOGOS [4]</span>
          </button>

          {/* Theme Selector */}
          <ThemeSwitcher />

          {/* Sound FX */}
          <button
            onClick={handleSoundToggle}
            title={soundEnabled ? "Mute Synthesized Audio FX" : "Enable Retro Audio FX"}
            className={`px-2.5 py-1.5 rounded border transition-colors flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan shadow-glow-subtle'
                : 'bg-cyber-bg border-cyber-border text-cyber-muted hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">SFX: {soundEnabled ? 'ON' : 'MUTED'}</span>
          </button>

          {/* CRT Scanlines */}
          <button
            onClick={handleCrtToggle}
            title={crtEnabled ? "Disable CRT Scanlines" : "Enable CRT Scanlines"}
            className={`px-2.5 py-1.5 rounded border transition-colors flex items-center gap-1.5 ${
              crtEnabled
                ? 'bg-cyber-emerald/15 border-cyber-emerald text-cyber-emerald'
                : 'bg-cyber-bg border-cyber-border text-cyber-muted hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">CRT: {crtEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Launch CLI */}
          <button
            onClick={onOpenCli}
            className="px-3 py-1.5 rounded bg-cyber-panel border border-cyber-cyan/60 text-cyber-cyan hover:bg-cyber-cyan hover:text-black font-semibold transition-all flex items-center gap-1.5 shadow-glow-subtle group cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-cyber-cyan group-hover:text-black" />
            <span className="text-[11px]">CLI</span>
            <kbd className="hidden md:inline text-[9px] bg-cyber-bg text-cyber-muted group-hover:text-black px-1 rounded border border-cyber-border">`</kbd>
          </button>

          {/* Transmit */}
          <a
            href="mailto:stefan.bakurdzhiev@gmail.com"
            className="hidden sm:flex px-3 py-1.5 rounded bg-cyber-emerald/10 border border-cyber-emerald/40 text-cyber-emerald hover:bg-cyber-emerald hover:text-black font-semibold transition-all items-center gap-1 text-[11px]"
          >
            <span>TRANSMIT</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Logo Showcase Modal */}
      <LogoShowcaseModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </header>
  );
};
