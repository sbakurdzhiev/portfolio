import React, { useState } from 'react';
import { Layers, Github, ExternalLink, Code2, Check, ArrowRight, ShieldCheck, Terminal, Server } from 'lucide-react';
import { profileData } from '../data/portfolioData';
import { sound } from '../utils/audio';

export const ProjectsSection = () => {
  const [activeManifestId, setActiveManifestId] = useState(null);

  const toggleManifest = (id) => {
    sound.playBeep(activeManifestId === id ? 400 : 650, 0.04);
    setActiveManifestId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="border border-cyber-border bg-cyber-surface rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyber-cyan" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                ENTERPRISE ARCHITECTURE & PRODUCTION MILESTONES
              </h2>
            </div>
            <p className="text-xs text-cyber-muted mt-1">
              Custom Resource Definitions (CRDs), platform implementations, and open-source operations handbooks.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-cyber-muted">
            <span className="text-cyber-cyan font-bold">4 DEPLOYED CRDs</span>
            <span>•</span>
            <span className="text-cyber-emerald">ALL POLICIES PASSED</span>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {profileData.projects.map((project) => {
          const isManifestOpen = activeManifestId === project.id;

          return (
            <div
              key={project.id}
              className="border border-cyber-border bg-cyber-surface rounded-lg overflow-hidden flex flex-col justify-between hover:border-cyber-cyan/50 transition-all group"
            >
              {/* Card Header (Kubernetes Resource Style) */}
              <div className="bg-cyber-panel/80 px-4 py-2.5 border-b border-cyber-border/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-cyber-cyan" />
                  <span className="text-cyber-cyan font-bold truncate">{project.kind}</span>
                  <span className="text-slate-500 text-[10px] hidden sm:inline">{project.api}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleManifest(project.id)}
                    className={`px-2 py-0.5 rounded text-[10px] border transition-colors flex items-center gap-1 ${
                      isManifestOpen
                        ? 'bg-cyber-cyan text-black font-bold border-cyber-cyan'
                        : 'bg-cyber-bg border-cyber-border text-slate-300 hover:text-white hover:border-slate-400'
                    }`}
                  >
                    <Code2 className="w-3 h-3" />
                    <span>{isManifestOpen ? 'Close YAML' : 'View YAML'}</span>
                  </button>

                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View GitHub Repository"
                    className="p-1 rounded bg-cyber-bg border border-cyber-border text-slate-300 hover:text-white hover:border-cyber-cyan transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyber-cyan transition-colors flex items-center gap-2">
                    {project.title}
                    {project.highlight && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyber-emerald/10 border border-cyber-emerald/40 text-cyber-emerald font-normal">
                        PRIMARY
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.stack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border/70 text-[11px] text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Manifest YAML Inspector view */}
                {isManifestOpen && (
                  <div className="mt-3 bg-[#03060a] border border-cyber-cyan/40 rounded p-3 text-[11px] overflow-x-auto text-slate-300 animate-fadeIn">
                    <pre className="leading-tight">
                      <span className="text-cyber-cyan">apiVersion:</span> {project.api}{'\n'}
                      <span className="text-cyber-cyan">kind:</span> {project.kind}{'\n'}
                      <span className="text-cyber-cyan">metadata:</span>{'\n'}
                      {'  '}<span className="text-cyber-cyan">name:</span> {project.id}{'\n'}
                      {'  '}<span className="text-cyber-cyan">namespace:</span> production{'\n'}
                      {'  '}<span className="text-cyber-cyan">author:</span> Stefan Bakurdzhiev{'\n'}
                      <span className="text-cyber-cyan">spec:</span>{'\n'}
                      {'  '}<span className="text-cyber-cyan">impact:</span> "{project.stats.impact}"{'\n'}
                      {'  '}<span className="text-cyber-cyan">securityTier:</span> "{project.stats.security}"{'\n'}
                      {'  '}<span className="text-cyber-cyan">repository:</span> "{project.repo}"
                    </pre>
                  </div>
                )}
              </div>

              {/* Card Footer Telemetry Bar */}
              <div className="bg-cyber-bg/70 px-5 py-3 border-t border-cyber-border/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-cyber-muted text-[10px]">IMPACT:</span>
                  <span className="text-cyber-emerald font-bold text-[11px]">{project.stats.impact}</span>
                </div>

                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyber-cyan hover:underline flex items-center gap-1 text-[11px] font-bold"
                >
                  <span>Inspect Repo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
