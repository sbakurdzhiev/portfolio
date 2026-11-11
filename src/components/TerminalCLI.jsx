import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from 'lucide-react';
import { profileData } from '../data/portfolioData';
import { sound } from '../utils/audio';

const AVAILABLE_COMMANDS = [
  'help', 'bio', 'skills', 'projects', 'pipeline run', 
  'kubectl get nodes', 'kubectl get pods', 'kubectl get crds',
  'theme', 'theme cyber', 'theme amber', 'theme tokyonight', 'theme matrix',
  'contact', 'whoami', 'clear', 'sudo rm -rf /', 'matrix', 'exit'
];

export const TerminalCLI = ({ isOpen, onClose, onTriggerPipeline }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [outputLines, setOutputLines] = useState([
    { text: '☸️  Stefan Bakurdzhiev Tactical Kubernetes & OpenShift Interactive Shell [v4.14-k8s]', color: 'text-cyber-cyan font-bold' },
    { text: 'Type "help" to view tactical commands or "theme [cyber|amber|tokyonight|matrix]" to switch visual palettes.', color: 'text-slate-400' },
    { text: '----------------------------------------------------------------------------------', color: 'text-cyber-border' },
  ]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputLines]);

  const handleKeyDown = (e) => {
    sound.playKey();

    if (e.key === 'Enter') {
      executeCommand(input.trim());
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx + 1 < history.length ? historyIdx + 1 : historyIdx;
        setHistoryIdx(nextIdx);
        setInput(history[history.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(history[history.length - 1 - nextIdx] || '');
      } else {
        setHistoryIdx(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = input.toLowerCase();
      const match = AVAILABLE_COMMANDS.find(cmd => cmd.startsWith(current));
      if (match) {
        setInput(match);
      }
    }
  };

  const executeCommand = (cmd) => {
    if (!cmd) {
      setOutputLines(prev => [...prev, { text: `${profileData.terminalPrompt} `, color: 'text-cyber-muted' }]);
      return;
    }

    setHistory(prev => [...prev, cmd]);
    setHistoryIdx(-1);
    setInput('');

    const promptEntry = { text: `${profileData.terminalPrompt} ${cmd}`, color: 'text-white font-bold' };
    const lower = cmd.toLowerCase();

    let responseEntries = [];

    if (lower === 'clear') {
      setOutputLines([]);
      sound.playBeep(450, 0.04);
      return;
    } else if (lower === 'exit') {
      onClose();
      return;
    } else if (lower === 'help') {
      responseEntries = [
        { text: 'AVAILABLE COMMANDS:', color: 'text-cyber-cyan font-bold' },
        { text: '  bio             - View profile summary and engineering philosophy', color: 'text-slate-300' },
        { text: '  skills          - Inspect container, cloud, and SRE proficiency', color: 'text-slate-300' },
        { text: '  projects        - List open-source architectures & handbooks', color: 'text-slate-300' },
        { text: '  pipeline run    - Execute live automated GitOps CI/CD runner', color: 'text-cyber-emerald font-bold' },
        { text: '  theme [name]    - Switch palette: cyber, amber, tokyonight, matrix', color: 'text-cyber-cyan' },
        { text: '  kubectl get nodes - List cluster node status and versions', color: 'text-slate-300' },
        { text: '  kubectl get pods  - List running microservice pods in production', color: 'text-slate-300' },
        { text: '  kubectl get crds  - View active Custom Resource Definitions', color: 'text-slate-300' },
        { text: '  contact         - Display email, LinkedIn, and portfolio link', color: 'text-slate-300' },
        { text: '  clear           - Wipe the terminal buffer', color: 'text-slate-300' },
        { text: '  sudo rm -rf /   - Root access attempt (warning: sandbox)', color: 'text-red-400' },
      ];
    } else if (lower.startsWith('theme')) {
      const parts = lower.split(/\s+/);
      const chosen = parts[1];
      const valid = ['cyber', 'amber', 'tokyonight', 'matrix'];

      if (!chosen) {
        responseEntries = [
          { text: 'CURRENT THEMES AVAILABLE:', color: 'text-cyber-cyan font-bold' },
          { text: '  • cyber      - Tactical Slate, Cyan & Emerald HUD', color: 'text-slate-300' },
          { text: '  • amber      - Vintage Phosphor CRT Monochrome', color: 'text-amber-400' },
          { text: '  • tokyonight - Modern Neovim / Storm Terminal', color: 'text-blue-300' },
          { text: '  • matrix     - Authentic Phosphor Matrix Green', color: 'text-emerald-400' },
          { text: 'Usage: theme <name> (e.g. "theme amber")', color: 'text-cyber-muted' },
        ];
      } else if (valid.includes(chosen)) {
        document.documentElement.setAttribute('data-theme', chosen);
        localStorage.setItem('portfolio-theme', chosen);
        sound.playBeep(750, 0.08);
        responseEntries = [
          { text: `[OK] Theme switched to: ${chosen.toUpperCase()}`, color: 'text-cyber-emerald font-bold' }
        ];
      } else {
        responseEntries = [
          { text: `Error: Unknown theme "${chosen}". Valid options: ${valid.join(', ')}`, color: 'text-red-400' }
        ];
      }
    } else if (lower === 'bio' || lower === 'about') {
      responseEntries = [
        { text: `NAME: ${profileData.name} (Senior DevOps & Platform Engineer)`, color: 'text-cyber-cyan font-bold' },
        { text: `CURRENT ROLE: ${profileData.company} - Squad Lead (8 engineers)`, color: 'text-white' },
        { text: `EXPERIENCE: ${profileData.experience}`, color: 'text-slate-300' },
        { text: `LOCATION: ${profileData.location} (${profileData.availability})`, color: 'text-cyber-emerald' },
        { text: `PHILOSOPHY: "${profileData.motto}"`, color: 'text-amber-300 italic' },
      ];
    } else if (lower === 'skills' || lower === 'stack') {
      responseEntries = [
        { text: 'CORE PLATFORM PROFICIENCY:', color: 'text-cyber-cyan font-bold' },
        { text: '  • OpenShift & Kubernetes: [98%] Enterprise multi-cluster, DR & RBAC', color: 'text-cyber-emerald' },
        { text: '  • CI/CD & GitOps: [95%] ArgoCD, GitHub Actions, Jenkins, Helm', color: 'text-white' },
        { text: '  • Observability: [95%] Prometheus, Grafana, Loki, Nagios, Checkmk', color: 'text-white' },
        { text: '  • IaC & Automation: [92%] Ansible, Terraform, Bash, Python', color: 'text-white' },
        { text: '  • Cloud & Storage: [90%] Azure, Ceph, CrunchyData Postgres Operator', color: 'text-white' },
      ];
    } else if (lower === 'projects' || lower === 'crds') {
      responseEntries = [
        { text: 'DEPLOYED KUBERNETES ARCHITECTURES & HANDBOOKS:', color: 'text-cyber-cyan font-bold' },
        ...profileData.projects.map(p => ({
          text: `  [${p.kind}] ${p.title} -> ${p.repo}`,
          color: 'text-slate-300'
        }))
      ];
    } else if (lower === 'pipeline run' || lower === 'pipeline') {
      responseEntries = [
        { text: '[DISPATCH] Triggering live GitOps pipeline simulator...', color: 'text-cyber-emerald font-bold' },
      ];
      if (onTriggerPipeline) {
        onTriggerPipeline();
      }
    } else if (lower === 'kubectl get nodes') {
      responseEntries = [
        { text: 'NAME                   STATUS   ROLES           AGE     VERSION', color: 'text-cyber-muted font-bold' },
        { text: 'k8s-master-sofia-01    Ready    control-plane   382d    v1.28.4+ocp', color: 'text-white' },
        { text: 'k8s-master-sofia-02    Ready    control-plane   382d    v1.28.4+ocp', color: 'text-white' },
        { text: 'k8s-master-sofia-03    Ready    control-plane   382d    v1.28.4+ocp', color: 'text-white' },
        { text: 'k8s-worker-infra-01    Ready    worker,infra    380d    v1.28.4+ocp', color: 'text-cyber-emerald' },
        { text: 'k8s-worker-infra-02    Ready    worker,infra    380d    v1.28.4+ocp', color: 'text-cyber-emerald' },
        { text: 'k8s-worker-app-01      Ready    worker          380d    v1.28.4+ocp', color: 'text-cyber-emerald' },
        { text: 'k8s-worker-app-02      Ready    worker          380d    v1.28.4+ocp', color: 'text-cyber-emerald' },
      ];
    } else if (lower === 'kubectl get pods') {
      responseEntries = [
        { text: 'NAME                                READY   STATUS    RESTARTS   AGE', color: 'text-cyber-muted font-bold' },
        { text: 'argocd-server-79b8f-5x92k           1/1     Running   0          42d', color: 'text-white' },
        { text: 'prometheus-k8s-0                    2/2     Running   0          98d', color: 'text-white' },
        { text: 'postgres-operator-6dc5-91h2b        1/1     Running   0          65d', color: 'text-white' },
        { text: 'portfolio-edge-84b9c-v7x91          1/1     Running   0          10s', color: 'text-cyber-emerald font-bold' },
      ];
    } else if (lower === 'contact' || lower === 'whoami') {
      responseEntries = [
        { text: 'DIRECT TRANSMISSION CHANNELS:', color: 'text-cyber-cyan font-bold' },
        { text: `  Email:    ${profileData.email}`, color: 'text-white' },
        { text: `  LinkedIn: ${profileData.linkedin}`, color: 'text-blue-400' },
        { text: `  GitHub:   ${profileData.github}`, color: 'text-slate-300' },
        { text: `  Domain:   ${profileData.portfolioUrl}`, color: 'text-cyber-emerald' },
      ];
    } else if (lower === 'sudo rm -rf /' || lower === 'rm -rf /') {
      responseEntries = [
        { text: '[SECURITY AUDIT TRIGGERED] Nice try!', color: 'text-red-400 font-bold' },
        { text: 'Error: Permission denied. Read-only root filesystem enforced by Red Hat Enterprise Linux CoreOS.', color: 'text-red-300' },
        { text: 'Incident has been logged to /var/log/audit/audit.log and sent to Security Operations Center.', color: 'text-amber-300' }
      ];
      sound.playBeep(220, 0.2, 'sawtooth');
    } else {
      responseEntries = [
        { text: `bash: command not found: ${cmd}. Type "help" for a list of tactical commands.`, color: 'text-red-400' }
      ];
    }

    setOutputLines(prev => [...prev, promptEntry, ...responseEntries]);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 transition-all font-mono shadow-2xl ${
      isFullScreen
        ? 'inset-0'
        : 'bottom-0 left-0 right-0 sm:bottom-4 sm:right-4 sm:left-auto sm:w-[650px] sm:max-w-[calc(100vw-2rem)] h-[480px]'
    }`}>
      <div className="h-full flex flex-col bg-cyber-bg border-2 border-cyber-cyan rounded-t-lg sm:rounded-lg overflow-hidden shadow-glow-cyan">
        {/* Terminal Header */}
        <div className="bg-cyber-surface px-4 py-2.5 border-b border-cyber-border flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-cyber-cyan" />
            <span className="text-xs font-bold text-white tracking-wider">
              TACTICAL SHELL // stefan@k8s-master:~#
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(prev => !prev)}
              className="text-slate-400 hover:text-white p-1 rounded"
              title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-red-400 p-1 rounded"
              title="Close Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          onClick={() => inputRef.current?.focus()}
          className="flex-1 p-4 overflow-y-auto space-y-1 text-xs select-text cursor-text"
        >
          {outputLines.map((line, idx) => (
            <div key={idx} className={`${line.color || 'text-slate-300'} leading-relaxed`}>
              {line.text}
            </div>
          ))}

          {/* Active Prompt Line */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-cyber-emerald font-bold select-none shrink-0">
              {profileData.terminalPrompt}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs caret-cyber-cyan"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Footer Quick Bar */}
        <div className="bg-cyber-surface/90 px-4 py-1.5 border-t border-cyber-border/70 flex flex-wrap items-center justify-between text-[10px] text-cyber-muted">
          <div className="flex items-center gap-2">
            <span>QUICK:</span>
            {['help', 'bio', 'skills', 'pipeline run', 'theme amber', 'theme cyber'].map((c) => (
              <button
                key={c}
                onClick={() => executeCommand(c)}
                className="hover:text-cyber-cyan underline cursor-pointer"
              >
                {c}
              </button>
            ))}
          </div>
          <span className="hidden sm:inline">Press [Tab] to complete</span>
        </div>
      </div>
    </div>
  );
};
