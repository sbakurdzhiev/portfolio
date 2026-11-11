import React, { useState } from 'react';
import { FileCode, Shield, GraduationCap, Cpu, Calendar, CheckCircle2, ChevronRight, Terminal } from 'lucide-react';
import { profileData } from '../data/portfolioData';
import { sound } from '../utils/audio';

export const CareerSection = () => {
  const [filter, setFilter] = useState('ALL');

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="border border-cyber-border bg-cyber-surface rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyber-cyan" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                SYSTEM JOURNAL & AUDIT TRAIL [journalctl -u career.service]
              </h2>
            </div>
            <p className="text-xs text-cyber-muted mt-1">
              Chronological execution log: From freelance IT foundations to leading enterprise DevOps platforms.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-cyber-muted text-[11px]">TIMELINE:</span>
            <span className="px-2 py-0.5 rounded bg-cyber-panel border border-cyber-border text-cyber-cyan font-bold">
              2010 → 2026+ (10+ YRS)
            </span>
          </div>
        </div>
      </div>

      {/* Main Career Log Timeline */}
      <div className="border border-cyber-border bg-cyber-surface rounded-lg p-5 sm:p-7 space-y-6">
        <h3 className="text-xs font-bold text-cyber-muted uppercase tracking-wider flex items-center gap-2 border-b border-cyber-border/70 pb-2">
          <Terminal className="w-3.5 h-3.5 text-cyber-emerald" />
          ENTERPRISE EXPERIENCE & LEADERSHIP MILESTONES
        </h3>

        <div className="relative border-l-2 border-cyber-border/80 pl-6 ml-2 space-y-8">
          {profileData.careerTimeline.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-cyber-panel border-2 border-cyber-cyan group-hover:bg-cyber-cyan group-hover:shadow-glow-cyan transition-all" />

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border text-cyber-cyan font-bold">
                    {item.period}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald font-bold">
                    {item.badge}
                  </span>
                </div>

                <div className="pt-1">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    {item.role}
                    <span className="text-xs font-normal text-slate-400">@ {item.company}</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
                    {item.details}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Academic Certification Logs */}
      <div className="border border-cyber-border bg-cyber-surface rounded-lg p-5 sm:p-7 space-y-4">
        <h3 className="text-xs font-bold text-cyber-muted uppercase tracking-wider flex items-center gap-2 border-b border-cyber-border/70 pb-2">
          <GraduationCap className="w-4 h-4 text-cyber-cyan" />
          ACADEMIC QUALIFICATIONS & FORMAL SPECIALIZATION
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {profileData.education.map((edu, idx) => (
            <div
              key={idx}
              className="p-4 bg-cyber-bg border border-cyber-border/80 rounded hover:border-cyber-cyan/50 transition-colors space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-cyber-muted text-[10px] mb-1">
                  <span className="text-cyber-cyan font-bold">{edu.year}</span>
                  <span className="px-1.5 py-0.2 rounded bg-cyber-panel border border-cyber-border text-slate-300">
                    VERIFIED
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{edu.degree}</h4>
                <p className="text-slate-400 text-xs mt-1">{edu.school}</p>
              </div>

              <div className="pt-2 border-t border-cyber-border/40 flex items-center gap-1.5 text-[11px] text-cyber-emerald">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Credential Conferred</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
