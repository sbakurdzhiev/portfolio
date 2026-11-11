import React, { useState, useEffect } from 'react';
import { HeaderTelemetry } from './components/HeaderTelemetry';
import { NavigationTabs } from './components/NavigationTabs';
import { OverviewSection } from './components/OverviewSection';
import { TelemetrySection } from './components/TelemetrySection';
import { PipelineSimulator } from './components/PipelineSimulator';
import { ProjectsSection } from './components/ProjectsSection';
import { CareerSection } from './components/CareerSection';
import { TerminalCLI } from './components/TerminalCLI';
import { FooterTelemetry } from './components/FooterTelemetry';
import { sound } from './utils/audio';

export function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [isCliOpen, setIsCliOpen] = useState(false);

  // Global key listener for backtick `~` to toggle terminal
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        sound.playBeep(600, 0.05);
        setIsCliOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const handleOpenCli = () => {
    sound.playBeep(750, 0.04);
    setIsCliOpen(true);
  };

  const handleTriggerPipeline = () => {
    setActiveTab('pipeline');
  };

  return (
    <div className={`min-h-screen bg-[#05080f] text-slate-200 bg-tactical-grid flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 ${
      crtEnabled ? 'scanlines' : ''
    }`}>
      <div>
        {/* Tactical Telemetry Ribbon & Header */}
        <HeaderTelemetry
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          crtEnabled={crtEnabled}
          setCrtEnabled={setCrtEnabled}
          onOpenCli={handleOpenCli}
        />

        {/* Dual Mode Navigation Bar */}
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Workspace Buffer */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === 'overview' && (
            <OverviewSection
              onNavigateTab={setActiveTab}
              onOpenCli={handleOpenCli}
            />
          )}

          {activeTab === 'telemetry' && (
            <TelemetrySection />
          )}

          {activeTab === 'pipeline' && (
            <PipelineSimulator />
          )}

          {activeTab === 'projects' && (
            <ProjectsSection />
          )}

          {activeTab === 'career' && (
            <CareerSection />
          )}

          {activeTab === 'terminal' && (
            <div className="space-y-4">
              <div className="p-4 bg-cyber-surface border border-cyber-border rounded-lg text-xs font-mono text-slate-300">
                <span className="text-cyber-cyan font-bold">FULL INTERACTIVE SHELL BUFFER ACTIVATED</span>
                <p className="text-slate-400 mt-1">
                  You can type commands like <code className="text-cyber-emerald">help</code>, <code className="text-cyber-emerald">pipeline run</code>, <code className="text-cyber-emerald">kubectl get nodes</code>, <code className="text-cyber-emerald">skills</code>, or <code className="text-cyber-emerald">contact</code> below.
                </p>
              </div>
              <TerminalCLI
                isOpen={true}
                onClose={() => setActiveTab('overview')}
                onTriggerPipeline={handleTriggerPipeline}
              />
            </div>
          )}
        </main>
      </div>

      {/* Persistent Floating CLI Modal (when launched via shortcut or header) */}
      {activeTab !== 'terminal' && (
        <TerminalCLI
          isOpen={isCliOpen}
          onClose={() => setIsCliOpen(false)}
          onTriggerPipeline={handleTriggerPipeline}
        />
      )}

      {/* Footer & Transmission Terminal */}
      <FooterTelemetry />
    </div>
  );
}

export default App;
