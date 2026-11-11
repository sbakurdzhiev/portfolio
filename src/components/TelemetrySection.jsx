import React, { useState, useEffect } from 'react';
import { Cpu, Server, HardDrive, Network, Filter, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { profileData } from '../data/portfolioData';
import { sound } from '../utils/audio';

export const TelemetrySection = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loadJitter, setLoadJitter] = useState({ cpu: 42, ram: 68, net: 1.2 });

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadJitter({
        cpu: Math.floor(38 + Math.random() * 8),
        ram: Math.floor(66 + Math.random() * 4),
        net: (1.1 + Math.random() * 0.4).toFixed(1)
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const categories = ['ALL', ...profileData.skillCategories.map(c => c.tag)];

  const filteredCategories = selectedCategory === 'ALL'
    ? profileData.skillCategories
    : profileData.skillCategories.filter(c => c.tag === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Top htop/btop style hardware header */}
      <div className="border border-cyber-border bg-cyber-surface rounded-lg p-5 font-mono">
        <div className="flex flex-wrap items-center justify-between border-b border-cyber-border pb-3 mb-4 gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyber-cyan" />
            <span className="text-sm font-bold text-white tracking-wide">
              CLUSTER TELEMETRY & RESOURCE ALLOCATION (HTOP MODE)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-cyber-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-ping" />
              SENSORS ONLINE
            </span>
          </div>
        </div>

        {/* Live Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Gauge 1: CPU */}
          <div className="bg-cyber-bg p-3 rounded border border-cyber-border/70 space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1 text-cyber-cyan font-bold">
                <Cpu className="w-3.5 h-3.5" /> CPU LOAD
              </span>
              <span className="text-cyber-cyan font-bold">{loadJitter.cpu}%</span>
            </div>
            <div className="h-2.5 bg-cyber-panel rounded overflow-hidden flex">
              <div 
                className="bg-gradient-to-r from-cyber-emerald via-cyber-cyan to-blue-500 transition-all duration-700"
                style={{ width: `${loadJitter.cpu}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-cyber-muted">
              <span>8 Nodes / 64 vCPUs</span>
              <span>Load: 2.14, 1.98, 1.85</span>
            </div>
          </div>

          {/* Gauge 2: RAM */}
          <div className="bg-cyber-bg p-3 rounded border border-cyber-border/70 space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1 text-purple-400 font-bold">
                <HardDrive className="w-3.5 h-3.5" /> MEMORY POOL
              </span>
              <span className="text-purple-400 font-bold">{loadJitter.ram}%</span>
            </div>
            <div className="h-2.5 bg-cyber-panel rounded overflow-hidden flex">
              <div 
                className="bg-gradient-to-r from-purple-500 to-cyber-cyan transition-all duration-700"
                style={{ width: `${loadJitter.ram}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-cyber-muted">
              <span>174.2 GiB / 256 GiB</span>
              <span>Buffers/Cache: 32 GiB</span>
            </div>
          </div>

          {/* Gauge 3: NET */}
          <div className="bg-cyber-bg p-3 rounded border border-cyber-border/70 space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1 text-cyber-emerald font-bold">
                <Network className="w-3.5 h-3.5" /> INGRESS / EGRESS
              </span>
              <span className="text-cyber-emerald font-bold">{loadJitter.net} Gbps</span>
            </div>
            <div className="h-2.5 bg-cyber-panel rounded overflow-hidden flex">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-cyber-emerald transition-all duration-700"
                style={{ width: `${(loadJitter.net / 2.5) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-cyber-muted">
              <span>BGP Anycast Ingress</span>
              <span>0 Drops / 100% SLA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-xs select-none">
        <Filter className="w-3.5 h-3.5 text-cyber-muted shrink-0 ml-1" />
        <span className="text-cyber-muted text-[11px] shrink-0 mr-1">SUBSYSTEM:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sound.playBeep(480, 0.03);
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1 rounded border transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-bold shadow-glow-subtle'
                : 'bg-cyber-surface border-cyber-border text-slate-400 hover:text-white hover:border-slate-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skill Clusters with progress telemetry bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {filteredCategories.map((group, groupIdx) => (
          <div 
            key={groupIdx}
            className="border border-cyber-border bg-cyber-surface rounded-lg p-5 space-y-4 hover:border-cyber-cyan/40 transition-colors"
          >
            <div className="flex items-center justify-between border-b border-cyber-border/70 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-cyber-cyan rounded-full" />
                <h3 className="font-bold text-white text-sm">{group.name}</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border text-cyber-cyan font-bold">
                {group.tag}
              </span>
            </div>

            <div className="space-y-3">
              {group.skills.map((skill, sIdx) => {
                // Generate simulated bracket bar e.g. [||||||||||..........]
                const totalBlocks = 20;
                const filledBlocks = Math.round((skill.level / 100) * totalBlocks);
                const barString = '[' + '|'.repeat(filledBlocks) + '.'.repeat(totalBlocks - filledBlocks) + ']';

                return (
                  <div key={sIdx} className="space-y-1 group">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`flex items-center gap-1.5 ${
                        skill.highlight ? 'text-white font-bold' : 'text-slate-300'
                      }`}>
                        {skill.highlight && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald" />
                        )}
                        {skill.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-cyber-muted font-mono hidden sm:inline text-opacity-80">
                          {barString}
                        </span>
                        <span className={`text-xs font-bold ${
                          skill.level >= 95 ? 'text-cyber-emerald' : 'text-cyber-cyan'
                        }`}>
                          {skill.level}%
                        </span>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="h-2 bg-cyber-bg rounded border border-cyber-border/60 overflow-hidden flex">
                      <div 
                        className={`h-full rounded-sm transition-all duration-500 ${
                          skill.level >= 95 
                            ? 'bg-gradient-to-r from-emerald-500 to-cyber-emerald group-hover:brightness-125'
                            : 'bg-gradient-to-r from-blue-500 to-cyber-cyan group-hover:brightness-125'
                        }`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Cluster Namespaces & Operators Map */}
      <div className="border border-cyber-border bg-cyber-surface rounded-lg p-5 font-mono">
        <h4 className="text-xs font-bold text-cyber-muted uppercase tracking-wider mb-3">
          ACTIVE DEPLOYED KUBERNETES OPERATORS & CRDS IN PRODUCTION
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 bg-cyber-bg border border-cyber-border/80 rounded flex flex-col justify-between">
            <span className="text-cyber-muted text-[10px]">OPENSHIFT OPERATOR</span>
            <span className="text-white font-bold">Red Hat OCP 4.x</span>
            <span className="text-cyber-emerald text-[10px] mt-1">STATUS: SYNCED</span>
          </div>
          <div className="p-2.5 bg-cyber-bg border border-cyber-border/80 rounded flex flex-col justify-between">
            <span className="text-cyber-muted text-[10px]">GITOPS CONTROLLER</span>
            <span className="text-white font-bold">ArgoCD ApplicationSet</span>
            <span className="text-cyber-emerald text-[10px] mt-1">STATUS: HEALTHY</span>
          </div>
          <div className="p-2.5 bg-cyber-bg border border-cyber-border/80 rounded flex flex-col justify-between">
            <span className="text-cyber-muted text-[10px]">DATABASE OPERATOR</span>
            <span className="text-white font-bold">Crunchy PGO v5</span>
            <span className="text-cyber-emerald text-[10px] mt-1">HA PATRONI: OK</span>
          </div>
          <div className="p-2.5 bg-cyber-bg border border-cyber-border/80 rounded flex flex-col justify-between">
            <span className="text-cyber-muted text-[10px]">OBSERVABILITY</span>
            <span className="text-white font-bold">Prometheus Operator</span>
            <span className="text-cyber-emerald text-[10px] mt-1">TARGETS: 100% UP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
