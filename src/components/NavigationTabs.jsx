import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Cpu, GitBranch, Layers, FileCode, Terminal, ChevronDown } from 'lucide-react';
import { sound } from '../utils/audio';

export const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const allTabs = [
    { id: 'overview', label: 'OVERVIEW', shortLabel: 'OVERVIEW', num: '1', icon: LayoutDashboard },
    { id: 'telemetry', label: 'TELEMETRY & STACK', shortLabel: 'TELEMETRY', num: '2', icon: Cpu },
    { id: 'pipeline', label: 'CI/CD RUNNER', shortLabel: 'CI/CD', num: '3', icon: GitBranch, badge: 'LIVE' },
    { id: 'projects', label: 'ARCHITECTURE & WORK', shortLabel: 'WORK', num: '4', icon: Layers },
    { id: 'career', label: 'CAREER LOGS', shortLabel: 'CAREER', num: '5', icon: FileCode },
    { id: 'terminal', label: 'INTERACTIVE CLI', shortLabel: 'CLI', num: '6', icon: Terminal },
  ];

  // Mobile primary tabs
  const mobilePrimaryIds = ['overview', 'projects', 'career'];
  const mobilePrimaryTabs = allTabs.filter(t => mobilePrimaryIds.includes(t.id));
  const mobileNestedTabs = allTabs.filter(t => !mobilePrimaryIds.includes(t.id));

  const isNestedActive = mobileNestedTabs.some(t => t.id === activeTab);
  const activeNestedTab = mobileNestedTabs.find(t => t.id === activeTab);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= allTabs.length) {
        sound.playBeep(520 + num * 40, 0.04);
        setActiveTab(allTabs[num - 1].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allTabs, setActiveTab]);

  const handleTabClick = (id) => {
    sound.playBeep(620, 0.04);
    setActiveTab(id);
    setDropdownOpen(false);
  };

  return (
    <nav className="border-b border-cyber-border bg-cyber-surface/60 px-3 sm:px-4 py-2 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* DESKTOP VIEW (md and up): All 6 tabs visible */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2 flex-wrap">
          {allTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-mono font-medium transition-all whitespace-nowrap relative cursor-pointer ${
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

        {/* MOBILE VIEW (< md): Only Overview, Architecture & Work, Career Logs + Nested Dropdown */}
        <div className="flex md:hidden items-center justify-between w-full gap-1">
          <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
            {mobilePrimaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-cyber-panel text-cyber-cyan border border-cyber-cyan/60 shadow-glow-subtle'
                      : 'text-cyber-muted hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${isActive ? 'text-cyber-cyan' : 'text-slate-400'}`} />
                  <span>{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Nested Dropdown for Mobile (Telemetry, CI/CD, CLI) */}
          <div className="relative shrink-0">
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-mono font-medium border transition-all cursor-pointer ${
                isNestedActive
                  ? 'bg-cyber-panel text-cyber-emerald border-cyber-emerald/60 shadow-glow-emerald'
                  : 'bg-cyber-bg text-cyber-muted border-cyber-border hover:border-slate-500 hover:text-white'
              }`}
            >
              <span>{isNestedActive ? activeNestedTab?.shortLabel : 'MORE'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-1.5 w-48 bg-cyber-surface border border-cyber-border rounded-lg shadow-2xl py-1 z-50 font-mono text-xs animate-fadeIn">
                  <div className="px-3 py-1 text-[10px] text-cyber-muted uppercase border-b border-cyber-border/60">
                    ADDITIONAL TOOLS
                  </div>
                  {mobileNestedTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-cyber-panel text-cyber-cyan font-bold border-l-2 border-cyber-cyan'
                            : 'text-slate-300 hover:bg-cyber-bg hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-cyber-muted">[{tab.num}]</span>
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </div>
                        {tab.badge && (
                          <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop Keyboard Shortcut Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-cyber-muted font-mono pl-4 shrink-0">
          <span className="text-slate-500">SHORTCUTS:</span>
          <kbd className="px-1.5 py-0.5 bg-cyber-panel border border-cyber-border rounded text-[10px] text-slate-300">1-6</kbd>
          <span className="text-slate-600">to switch</span>
        </div>
      </div>
    </nav>
  );
};
