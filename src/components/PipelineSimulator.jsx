import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCcw, CheckCircle2, AlertTriangle, Terminal, 
  Shield, Server, Layers, Cpu, Check, ArrowRight, Loader2, Sparkles 
} from 'lucide-react';
import { sound } from '../utils/audio';

const PIPELINE_STAGES = [
  {
    id: 'lint',
    name: 'SonarQube Quality Gate',
    sub: 'Static analysis & code complexity',
    duration: 1800,
    logs: [
      '[INFO] Initializing SonarQube Scanner for sbakurdzhiev/portfolio...',
      '[OK] Parsing AST and container configuration manifests...',
      '[OK] Code smells: 0 | Bugs: 0 | Security Hotspots: 0',
      '[PASS] SonarQube Quality Gate status: PASSED (Grade: A+)'
    ]
  },
  {
    id: 'sec',
    name: 'Trivy & Secrets Audit',
    sub: 'CVE vulnerability & RBAC policy audit',
    duration: 2200,
    logs: [
      '[INFO] Executing Trivy vulnerability scanner on base image...',
      '[OK] Checking against NVD & SecLists common exploit patterns...',
      '[OK] Scanning RBAC cluster role bindings for privilege escalation risks...',
      '[PASS] 0 Critical, 0 High vulnerabilities detected. Image signed.'
    ]
  },
  {
    id: 'build',
    name: 'Podman Container Build',
    sub: 'Multi-stage rootless container build',
    duration: 2500,
    logs: [
      '[INFO] Running rootless Podman build: quay.io/sbakurdzhiev/portfolio:latest',
      '[STEP 1/3] Multi-stage build layer 1: NodeJS 24 Alpine cached',
      '[STEP 2/3] Compiling optimized static assets with Vite & Tailwind...',
      '[STEP 3/3] Stripping unnecessary binaries. Final image size: 24.8MB',
      '[OK] Pushed image digest: sha256:4f8e219ba9023...'
    ]
  },
  {
    id: 'validate',
    name: 'Kube-bench & Helm Validate',
    sub: 'Declarative manifest compliance check',
    duration: 2000,
    logs: [
      '[INFO] Rendering Helm templates with values-production.yaml...',
      '[OK] Validating against OpenShift 4.14 API schema constraints...',
      '[OK] Kube-bench CIS benchmark audit passed (100% compliant)',
      '[PASS] Helm chart release package ready for GitOps sync'
    ]
  },
  {
    id: 'deploy',
    name: 'ArgoCD GitOps Sync',
    sub: 'Progressive canary rollout to OpenShift',
    duration: 3000,
    logs: [
      '[INFO] ArgoCD Application "sbakurdzhiev-portfolio" triggered sync...',
      '[SYNC] Commit 9a4bc12 matching origin/main synced cleanly',
      '[ROLLOUT] Pod replica 1/3: [CONTAINER_CREATING] -> [RUNNING 1/1]',
      '[ROLLOUT] Pod replica 2/3: [CONTAINER_CREATING] -> [RUNNING 1/1]',
      '[ROLLOUT] Pod replica 3/3: [CONTAINER_CREATING] -> [RUNNING 1/1]',
      '[SUCCESS] OpenShift Route live: https://sbakurdzhiev.eu [HTTP 200 OK]'
    ]
  }
];

export const PipelineSimulator = () => {
  const [status, setStatus] = useState('IDLE'); // 'IDLE' | 'RUNNING' | 'SUCCESS' | 'CANCELLED'
  const [currentStageIdx, setCurrentStageIdx] = useState(-1);
  const [logs, setLogs] = useState([
    `[SYSTEM] GitOps Pipeline Runner ready for target: OpenShift Cluster "k8s-master-sofia"`,
    `[SYSTEM] Branch: origin/main • Strategy: Automated Canary Rollout (ArgoCD)`,
    `[SYSTEM] Click "START PIPELINE" or run command 'pipeline run' in CLI to trigger deployment.`
  ]);
  const [deployedPods, setDeployedPods] = useState([]);
  const logsEndRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (text) => {
    const timestamp = new Date().toISOString().substring(11, 19);
    setLogs(prev => [...prev, `[${timestamp}] ${text}`]);
  };

  const startPipeline = () => {
    if (status === 'RUNNING') return;
    sound.playBeep(800, 0.08);
    setStatus('RUNNING');
    setCurrentStageIdx(0);
    setDeployedPods([]);
    setLogs([
      `[${new Date().toISOString().substring(11, 19)}] [INIT] Triggering Automated GitOps Pipeline...`,
      `[${new Date().toISOString().substring(11, 19)}] [INIT] Target Namespace: production-sbakurdzhiev`
    ]);

    runStage(0);
  };

  const runStage = (index) => {
    if (index >= PIPELINE_STAGES.length) {
      // Completed all stages!
      setStatus('SUCCESS');
      setCurrentStageIdx(PIPELINE_STAGES.length);
      sound.playDeploySuccess();
      addLog(`✨ [DEPLOYMENT COMPLETE] 100% traffic shifted to healthy cluster pods.`);
      setDeployedPods([
        { name: 'portfolio-edge-84b9c-v7x91', ready: '1/1', status: 'Running', restarts: 0, age: '10s' },
        { name: 'portfolio-edge-84b9c-k2p44', ready: '1/1', status: 'Running', restarts: 0, age: '8s' },
        { name: 'portfolio-edge-84b9c-m5n19', ready: '1/1', status: 'Running', restarts: 0, age: '5s' },
      ]);
      return;
    }

    const currentStage = PIPELINE_STAGES[index];
    setCurrentStageIdx(index);
    sound.playBeep(500 + index * 100, 0.06);

    // Stream stage logs one by one
    let lineIdx = 0;
    const lineInterval = currentStage.duration / currentStage.logs.length;

    const logTimer = setInterval(() => {
      if (lineIdx < currentStage.logs.length) {
        addLog(currentStage.logs[lineIdx]);
        sound.playKey();
        lineIdx++;
      } else {
        clearInterval(logTimer);
        // Advance to next stage after short pause
        timerRef.current = setTimeout(() => {
          runStage(index + 1);
        }, 400);
      }
    }, lineInterval);
  };

  const resetPipeline = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    sound.playBeep(350, 0.05);
    setStatus('IDLE');
    setCurrentStageIdx(-1);
    setDeployedPods([]);
    setLogs([
      `[SYSTEM] Pipeline reset to IDLE state. Ready for next dispatch.`
    ]);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner and Controls */}
      <div className="border border-cyber-border bg-cyber-surface rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-pulse" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                INTERACTIVE GITOPS CI/CD PIPELINE RUNNER
              </h2>
            </div>
            <p className="text-xs text-cyber-muted mt-0.5">
              Simulated end-to-end delivery: Commit → SonarQube → Trivy → Podman → Helm → OpenShift
            </p>
          </div>

          <div className="flex items-center gap-3">
            {status !== 'RUNNING' ? (
              <button
                onClick={startPipeline}
                className="px-4 py-2 rounded bg-gradient-to-r from-cyber-cyan to-cyber-emerald text-black font-bold text-xs flex items-center gap-2 shadow-glow-cyan hover:opacity-90 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>START PIPELINE</span>
              </button>
            ) : (
              <div className="px-4 py-2 rounded bg-cyber-cyan/15 border border-cyber-cyan text-cyber-cyan font-bold text-xs flex items-center gap-2 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>EXECUTING STAGES...</span>
              </div>
            )}

            <button
              onClick={resetPipeline}
              disabled={status === 'IDLE'}
              className="px-3 py-2 rounded bg-cyber-bg border border-cyber-border text-slate-400 hover:text-white disabled:opacity-40 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* Visual Pipeline Stages */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isCompleted = currentStageIdx > idx || status === 'SUCCESS';
            const isCurrent = currentStageIdx === idx && status === 'RUNNING';
            const isPending = currentStageIdx < idx && status !== 'SUCCESS';

            return (
              <div
                key={stage.id}
                className={`p-3 rounded border transition-all relative ${
                  isCurrent
                    ? 'bg-cyber-panel border-cyber-cyan text-cyber-cyan shadow-glow-subtle ring-1 ring-cyber-cyan/40'
                    : isCompleted
                    ? 'bg-cyber-bg border-cyber-emerald/60 text-slate-200'
                    : 'bg-cyber-bg/60 border-cyber-border/70 text-cyber-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold">
                    STAGE {idx + 1}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyber-cyan animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-cyber-border" />
                  )}
                </div>

                <div className="text-xs font-bold truncate">
                  {stage.name}
                </div>
                <div className="text-[10px] text-cyber-muted mt-0.5 truncate">
                  {stage.sub}
                </div>

                {isCurrent && (
                  <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-cyber-cyan animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Terminal Log Streamer */}
      <div className="border border-cyber-border bg-cyber-bg rounded-lg overflow-hidden shadow-2xl">
        <div className="bg-cyber-surface px-4 py-2.5 border-b border-cyber-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="font-bold text-white">ARGO_WORKFLOW_POD_LOGS // live-stream</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-cyber-muted">
            <span className="hidden sm:inline">FORMAT: text/plain</span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                status === 'RUNNING' ? 'bg-cyber-cyan animate-ping' : status === 'SUCCESS' ? 'bg-cyber-emerald' : 'bg-slate-600'
              }`} />
              {status}
            </span>
          </div>
        </div>

        <div className="p-4 h-64 overflow-y-auto space-y-1 text-xs font-mono select-text bg-[#03060a]">
          {logs.map((log, idx) => {
            const isError = log.includes('[FAIL]') || log.includes('[ERROR]');
            const isPass = log.includes('[PASS]') || log.includes('[OK]') || log.includes('[SUCCESS]');
            const isInfo = log.includes('[INFO]') || log.includes('[STEP]');
            const isSys = log.includes('[SYSTEM]') || log.includes('[INIT]');

            return (
              <div 
                key={idx}
                className={`leading-relaxed ${
                  isError ? 'text-red-400 font-bold' :
                  isPass ? 'text-cyber-emerald' :
                  isInfo ? 'text-cyber-cyan' :
                  isSys ? 'text-amber-300' :
                  'text-slate-300'
                }`}
              >
                {log}
              </div>
            );
          })}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* Deployed Pods Status (Appears upon success or in progress) */}
      {status === 'SUCCESS' && deployedPods.length > 0 && (
        <div className="border border-cyber-emerald/50 bg-cyber-surface rounded-lg p-5 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-cyber-border/70 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyber-emerald" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                DEPLOYED REPLICAS: namespace/production-sbakurdzhiev
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-cyber-emerald border border-cyber-emerald/30 font-bold">
              ROUTING ACTIVE (100% HEALTHY)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-cyber-muted border-b border-cyber-border/50 text-[10px]">
                  <th className="py-1">POD NAME</th>
                  <th className="py-1">READY</th>
                  <th className="py-1">STATUS</th>
                  <th className="py-1">RESTARTS</th>
                  <th className="py-1">AGE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/30">
                {deployedPods.map((pod, pIdx) => (
                  <tr key={pIdx} className="hover:bg-cyber-panel/40">
                    <td className="py-2 text-white font-bold">{pod.name}</td>
                    <td className="py-2 text-cyber-cyan">{pod.ready}</td>
                    <td className="py-2">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        {pod.status}
                      </span>
                    </td>
                    <td className="py-2 text-slate-400">{pod.restarts}</td>
                    <td className="py-2 text-slate-400">{pod.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
