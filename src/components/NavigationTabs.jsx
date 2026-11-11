import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileCode, Layers, Cpu, GitBranch, 
  Terminal, BookOpen, ChevronDown 
} from 'lucide-react';
import { sound } from '../utils/audio';

export const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Exact requested order:
  // 1. Overview 2. Career Logs 3. Work & Projects 4. Stack & Telemetry 5. CI/CD Runner 6. Interactive CLI; 7. Blog Posts
  const allTabs = [
    { id: 'overview', label: 'OVERVIEW', shortLabel: 'OVERVIEW', num: '1', icon: LayoutDashboard },
    { id: 'career', label: 'CAREER LOGS', shortLabel: 'CAREER', num: '2', icon: FileCode },
    { id: 'projects', label: 'WORK & PROJECTS', shortLabel: 'WORK', num: '3', icon: Layers },
    { id: 'telemetry', label: 'STACK & TELEMETRY', shortLabel: 'STACK', num: '4', icon: Cpu },
    { id: 'pipeline', label: 'CI/CD RUNNER', shortLabel: 'CI/CD', num: '5', icon: GitBranch, badge: 'LIVE' },
    { id: 'terminal', label: 'INTERACTIVE CLI', shortLabel: 'CLI', num: '6', icon: Terminal },
    { id: 'blog', label: 'BLOG POSTS', shortLabel: 'BLOG', num: '7', icon: BookOpen },
  ];

  // Mobile primary tabs: Overview -> Career -> Work -> Blog (User requested Blog after Work)
  const mobilePrimaryIds = ['overview', 'career', 'projects', 'blog'];
  const mobilePrimaryTabs = mobilePrimaryIds
    .map(id => allTabs.find(t => t.id === id))
    .filter(Boolean);
  const mobileNestedTabs = allTabs.filter(t => !mobilePrimaryIds.includes(t.id));

  const isNestedActive = mobileNestedTabs.some(t => t.id === activeTab);
  const activeNestedTab = mobileNestedTabs.find(t => t.id === activeTab);

  // Keyboard shortcut listener (1-7) without visible hints
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= allTabs.length) {
        sound.playBeep(520 + num * 35, 0.04);
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
    <nav className="border-b border-cyber-border bg-cyber-surface/60 px-3 sm:px-4 py-1.5 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* DESKTOP VIEW (md and up): All 7 tabs on 1 clean line without shortcut hints */}
        <div className="hidden md:flex items-center gap-1 lg:gap-1.5 w-full justify-between flex-nowrap overflow-x-auto no-scrollbar">
          {allTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded text-xs font-mono font-medium transition-all whitespace-nowrap relative cursor-pointer ${
                  isActive
                    ? 'bg-cyber-panel text-cyber-cyan border border-cyber-cyan/50 shadow-glow-subtle'
                    : 'text-cyber-muted hover:text-slate-200 hover:bg-cyber-panel/40 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyber-cyan' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="relative flex h-1.5 w-1.5 ml-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-emerald opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyber-emerald"></span>
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyber-cyan to-cyber-emerald" />
                )}
              </button>
            );
          })}
        </div>

        {/* MOBILE VIEW (< md): Primary tabs + Nested Dropdown */}
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

          {/* Nested Dropdown for Mobile (Stack, CI/CD, CLI, Blog) */}
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
      </div>
    </nav>
  );
};
