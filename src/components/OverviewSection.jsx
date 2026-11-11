import React, { useState } from 'react';
import { 
  Terminal, ShieldCheck, Server, GitBranch, 
  MapPin, Users, Layers, ExternalLink, Play, Github, Linkedin
} from 'lucide-react';
import { Logo } from './Logo';
import { TypewriterText } from './TypewriterText';
import { profileData } from '../data/portfolioData';
import { sound } from '../utils/audio';

// Mini 4-line column-aligned ASCII art for STEFAN (28 cols, centered)
const ASCII_MINI = [
  " ___ _____ ___ ___ _   _  _ ",
  "/ __|_   _| __| __/_\\ | \\| |",
  "\\__ \\ | | | _|| _/ _ \\| .` |",
  "|___/ |_| |___|_/_/ \\_\\_|\\_|"
].join("\n");

export const OverviewSection = ({ onNavigateTab, onOpenCli }) => {
  const [viewMode, setViewMode] = useState('human'); // 'human' | 'yaml'

  return (
    <div className="space-y-6">
      {/* Hero Tactical HUD Banner */}
      <div className="border border-cyber-border bg-cyber-surface rounded-lg p-5 sm:p-7 relative overflow-hidden corner-bracket">
        {/* Subtle grid background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-cyan-glow rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyber-emerald-glow rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-6 justify-between items-start">
          <div className="space-y-4 max-w-3xl">
            {/* Status chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-panel border border-cyber-cyan/30 text-xs font-mono text-cyber-cyan">
              <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse" />
              <span>CLUSTER NODE ONLINE</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">OPEN TO REMOTE WORLDWIDE</span>
            </div>

            {/* Title / Headline with Locked Brand Logo & Typewriter */}
            <div className="flex items-start gap-4">
              <div className="hidden sm:block pt-1 shrink-0">
                <Logo size={68} />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-mono flex items-baseline gap-3">
                  {profileData.name}
                  <span className="text-sm font-normal text-cyber-emerald hidden sm:inline">
                    [k8s-master]
                  </span>
                </h2>

                <div className="text-base sm:text-xl text-cyber-cyan font-mono mt-1 font-semibold min-h-[30px] flex items-center">
                  <TypewriterText />
                </div>
              </div>
            </div>

            {/* Philosophy quote */}
            <div className="border-l-2 border-cyber-cyan pl-3.5 py-1 text-slate-300 text-xs sm:text-sm font-mono italic bg-cyber-bg/50 rounded-r">
              "{profileData.motto}"
            </div>

            {/* Current Position Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-1">
              <div className="flex items-center gap-2 bg-cyber-bg/80 border border-cyber-border/70 p-2.5 rounded">
                <Users className="w-4 h-4 text-cyber-cyan shrink-0" />
                <span>
                  <strong className="text-white">DXC Bulgaria:</strong> Team Lead (8 Engineers)
                </span>
              </div>
              <div className="flex items-center gap-2 bg-cyber-bg/80 border border-cyber-border/70 p-2.5 rounded">
                <MapPin className="w-4 h-4 text-cyber-emerald shrink-0" />
                <span>
                  <strong className="text-white">Location:</strong> Sofia, Bulgaria (UTC+2)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => {
                  sound.playBeep(700, 0.05);
                  onNavigateTab('pipeline');
                }}
                className="px-4 py-2.5 rounded bg-gradient-to-r from-cyber-cyan to-cyber-emerald text-black font-bold font-mono text-xs flex items-center gap-2 shadow-glow-cyan hover:opacity-90 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>TRIGGER LIVE CI/CD PIPELINE</span>
              </button>

              <button
                onClick={() => {
                  sound.playBeep(550, 0.05);
                  onOpenCli();
                }}
                className="px-4 py-2.5 rounded bg-cyber-panel border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan hover:text-black font-bold font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>INTERACTIVE TERMINAL</span>
              </button>

              <a
                href={profileData.github}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded bg-cyber-bg border border-cyber-border hover:border-cyber-cyan text-slate-200 hover:text-white font-mono text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Github className="w-3.5 h-3.5 text-white" />
                <span>GitHub</span>
              </a>

              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded bg-cyber-bg border border-cyber-border hover:border-cyber-cyan text-slate-200 hover:text-white font-mono text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-cyber-cyan">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* ASCII Banner & Cluster Status Widget */}
          <div className="flex flex-col gap-3 w-full lg:w-80 shrink-0">
            <div className="bg-cyber-bg border border-cyber-border rounded p-3 text-xs font-mono select-none overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-cyber-muted pb-1 mb-2 border-b border-cyber-border text-[9px]">
                <span className="text-slate-400 font-semibold">SYS_BANNER.ASCII</span>
                <span className="text-cyber-emerald font-bold">UTF-8 // MINI</span>
              </div>

              {/* Mathematically Centered Terminal Display */}
              <div className="flex justify-center items-center w-full py-2.5 px-1 bg-cyber-surface/50 rounded border border-cyber-border/40 overflow-hidden text-center">
                <pre className="text-cyber-cyan font-bold whitespace-pre font-mono leading-none tracking-normal inline-block text-left text-[10px] sm:text-[10.5px] drop-shadow-[0_0_8px_rgba(0,212,255,0.35)]">
                  {ASCII_MINI}
                </pre>
              </div>
            </div>

            <div className="bg-cyber-bg border border-cyber-border rounded p-3 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-cyber-muted text-[10px]">
                <span>CLUSTER SPECIFICATIONS</span>
                <span className="text-cyber-emerald">HEALTHY</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kubernetes Engine:</span>
                  <span className="text-white">v1.28.4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">OpenShift Platform:</span>
                  <span className="text-white">OCP 4.14 EUS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GitOps Engine:</span>
                  <span className="text-cyber-cyan">ArgoCD v2.10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security Gate:</span>
                  <span className="text-cyber-emerald">Trivy + Sonar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Bio View: Human Readable vs Raw YAML Manifest */}
      <div className="border border-cyber-border bg-cyber-surface rounded-lg p-5 font-mono">
        <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyber-cyan" />
            <span className="text-sm font-bold text-white">OPERATIONAL PROFILE & PHILOSOPHY</span>
          </div>

          <div className="flex items-center gap-1 bg-cyber-bg p-1 rounded border border-cyber-border text-xs">
            <button
              onClick={() => {
                sound.playBeep(450, 0.04);
                setViewMode('human');
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'human'
                  ? 'bg-cyber-panel text-cyber-cyan font-bold border border-cyber-cyan/40'
                  : 'text-cyber-muted hover:text-white'
              }`}
            >
              Formatted
            </button>
            <button
              onClick={() => {
                sound.playBeep(450, 0.04);
                setViewMode('yaml');
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'yaml'
                  ? 'bg-cyber-panel text-cyber-cyan font-bold border border-cyber-cyan/40'
                  : 'text-cyber-muted hover:text-white'
              }`}
            >
              profile.yaml
            </button>
          </div>
        </div>

        {viewMode === 'human' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-3">
              <h3 className="text-cyber-cyan font-bold text-sm flex items-center gap-1.5">
                <Server className="w-4 h-4" />
                Cluster & Platform Engineering
              </h3>
              <p>
                Specialized in architecting, hardening, and maintaining mission-critical <strong className="text-white">Red Hat OpenShift</strong> and vanilla Kubernetes clusters. Deep expertise with multi-tenant namespaces, ingress controllers, RBAC policies, and service meshes.
              </p>
              <p>
                Author of operational playbooks and admin handbooks for zero-downtime upgrades, DR backups, and cluster failover protocols.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-cyber-emerald font-bold text-sm flex items-center gap-1.5">
                <GitBranch className="w-4 h-4" />
                GitOps & Pipeline Modernization
              </h3>
              <p>
                Pioneer of declarative infrastructure and continuous delivery pipelines utilizing <strong className="text-white">ArgoCD</strong>, <strong className="text-white">GitHub Actions</strong>, Helm charts, and Jenkins declarative pipelines.
              </p>
              <p>
                Proven track record converting legacy error-prone manual deployments into automated, auditable, and repeatable Git-driven releases.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-cyber-amber font-bold text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Leadership & Reliability Engineering
              </h3>
              <p>
                Leading an 8-engineer DevOps squad at <strong className="text-white">DXC Bulgaria</strong> since 2024. Fostering a blameless culture, rigorous postmortems, comprehensive telemetry via Prometheus & Grafana, and SLA defense.
              </p>
              <p>
                Formal background in <strong className="text-white">Cybersecurity</strong> ensures secure container images, secret management, and adherence to security baselines.
              </p>
            </div>
          </div>
        ) : (
          <pre className="text-xs bg-cyber-bg p-4 rounded border border-cyber-border/70 overflow-x-auto text-slate-300 font-mono leading-relaxed">
            <span className="text-cyber-muted"># Stefan Bakurdzhiev - Platform & DevOps Architecture Specification</span>{'\n'}
            <span className="text-cyber-cyan">apiVersion:</span> <span className="text-white">platform.engineer/v1</span>{'\n'}
            <span className="text-cyber-cyan">kind:</span> <span className="text-white">DevOpsEngineer</span>{'\n'}
            <span className="text-cyber-cyan">metadata:</span>{'\n'}
            {'  '}<span className="text-cyber-cyan">name:</span> <span className="text-cyber-emerald">stefan-bakurdzhiev</span>{'\n'}
            {'  '}<span className="text-cyber-cyan">location:</span> <span className="text-amber-300">"Sofia, Bulgaria (UTC+2)"</span>{'\n'}
            {'  '}<span className="text-cyber-cyan">status:</span> <span className="text-cyber-emerald">ReadyForRemote</span>{'\n'}
            <span className="text-cyber-cyan">spec:</span>{'\n'}
            {'  '}<span className="text-cyber-cyan">role:</span> <span className="text-white">Senior DevOps Engineer / Team Lead</span>{'\n'}
            {'  '}<span className="text-cyber-cyan">currentOrg:</span> <span className="text-white">DXC Bulgaria</span>{'\n'}
            {'  '}<span className="text-cyber-cyan">teamSize:</span> <span className="text-purple-400">8</span>{'\n'}
            {'  '}<span className="text-cyber-cyan">specializations:</span>{'\n'}
            {'    '}- <span className="text-white">OpenShift 4.x & Kubernetes Multi-Cluster Operations</span>{'\n'}
            {'    '}- <span className="text-white">ArgoCD GitOps & Progressive Delivery</span>{'\n'}
            {'    '}- <span className="text-white">Prometheus / Grafana / Loki Unified Telemetry</span>{'\n'}
            {'    '}- <span className="text-white">Cloud-Native PostgreSQL Operators (PGO)</span>{'\n'}
            {'    '}- <span className="text-white">Infrastructure as Code (Terraform, Ansible)</span>{'\n'}
            <span className="text-cyber-cyan">contacts:</span>{'\n'}
            {'  '}<span className="text-cyber-cyan">email:</span> <span className="text-cyber-cyan">stefan.bakurdzhiev@gmail.com</span>{'\n'}
            {'  '}<span className="text-cyber-cyan">github:</span> <span className="text-cyber-cyan">https://github.com/sbakurdzhiev</span>{'\n'}
            {'  '}<span className="text-cyber-cyan">portfolio:</span> <span className="text-cyber-cyan">https://sbakurdzhiev.com</span>
          </pre>
        )}
      </div>

      {/* Telemetry Panels Moved to the End, Right Above Footer */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-mono px-1">
          <span className="text-cyber-muted font-bold tracking-wider uppercase">
            LIVE SYSTEM TELEMETRY & CLUSTER METRICS
          </span>
          <span className="text-cyber-cyan text-[11px]">6 GAUGES ONLINE</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {profileData.metrics.map((metric, idx) => (
            <div 
              key={idx}
              className="bg-cyber-surface border border-cyber-border hover:border-cyber-cyan/50 p-3.5 rounded-lg transition-all font-mono group"
            >
              <div className="flex items-center justify-between text-[10px] text-cyber-muted mb-1">
                <span>{metric.label}</span>
                <span className="text-[9px] px-1 rounded bg-cyber-bg border border-cyber-border text-cyber-cyan">
                  {metric.status}
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white group-hover:text-cyber-cyan transition-colors">
                {metric.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                {metric.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
