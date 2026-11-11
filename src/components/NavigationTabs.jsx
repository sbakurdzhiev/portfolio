import React, { useEffect } from 'react';
import { LayoutDashboard, Cpu, GitBranch, Layers, FileCode, Terminal } from 'lucide-react';
import { sound } from '../utils/audio';

export const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'OVERVIEW', num: '1', icon: LayoutDashboard },
    { id: 'telemetry', label: 'TELEMETRY & STACK', num: '2', icon: Cpu },
    { id: 'pipeline', label: 'CI/CD RUNNER', num: '3', icon: GitBranch, badge: 'LIVE' },
    { id: 'projects', label: 'ARCHITECTURE & WORK', num: '4', icon: Layers },
    { id: 'career', label: 'CAREER LOGS', num: '5', icon: FileCode },
    { id: 'terminal', label: 'INTERACTIVE CLI', num: '6', icon: Terminal },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= tabs.length) {
        sound.playBeep(520 + num * 40, 0.04);
        setActiveTab(tabs[num - 1].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tabs, setActiveTab]);

  const handleTabClick = (id) => {
    sound.playBeep(620, 0.04);
    setActiveTab(id);
  };

  return (
    <nav className="border-b border-cyber-border bg-cyber-surface/60 px-4 py-2 select-none overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-2">
        <div className="flex items-center gap-1 sm:gap-2 flex-nowrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-mono font-medium transition-all whitespace-nowrap relative ${
                  isActive
                    ? 'bg-cyber-panel text-cyber-cyan border border-cyber-cyan/50 shadow-glow-subtle'
                    : 'text-cyber-muted hover:text-slate-200 hover:bg-cyber-panel/40 border border-transparent'
                }`}
              >
                <span className="text-[10px] text-cyber-muted/80 opacity-70">[{tab.num}]</span>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyber-cyan' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="relative flex h-2 w-2 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-emerald opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-emerald"></span>
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyber-cyan to-cyber-emerald" />
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[11px] text-cyber-muted font-mono pl-4">
          <span className="text-slate-500">SHORTCUTS:</span>
          <kbd className="px-1.5 py-0.5 bg-cyber-panel border border-cyber-border rounded text-[10px] text-slate-300">1-6</kbd>
          <span className="text-slate-600">to switch</span>
        </div>
      </div>
    </nav>
  );
};
