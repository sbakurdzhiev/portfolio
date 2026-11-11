import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Shield, Github, Linkedin, ExternalLink, Terminal, MapPin } from 'lucide-react';
import { profileData } from '../data/portfolioData';
import { sound } from '../utils/audio';

export const FooterTelemetry = () => {
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [transmitted, setTransmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!senderEmail || !message) return;

    sound.playDeploySuccess();
    setTransmitted(true);

    // Create mailto link as fallback to ensure delivery
    const subject = encodeURIComponent(`[DevOps Inquiry from Portfolio] Contact from ${senderEmail}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${profileData.email}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setSenderEmail('');
      setMessage('');
      setTransmitted(false);
    }, 4000);
  };

  return (
    <footer className="mt-12 border-t border-cyber-border bg-cyber-surface/90 pt-10 pb-8 px-4 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Transmission & Contact Panel */}
        <div className="border border-cyber-border bg-cyber-bg rounded-lg p-6 sm:p-8 corner-bracket relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Contact Info & Protocol */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-cyber-panel border border-cyber-cyan/30 text-xs text-cyber-cyan">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-ping" />
                TRANSMISSION CHANNEL READY
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                INITIATE DIRECT COMMUNICATION
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Whether you need senior platform leadership, Kubernetes/OpenShift cluster architecture, GitOps automation, or a dedicated DevOps squad lead — transmit your message directly.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Mail className="w-4 h-4 text-cyber-cyan shrink-0" />
                  <a href={`mailto:${profileData.email}`} className="text-white hover:text-cyber-cyan hover:underline">
                    {profileData.email}
                  </a>
                </div>

                <div className="flex items-center gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-cyber-emerald shrink-0" />
                  <span>{profileData.location} • {profileData.availability}</span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-300">
                  <Shield className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>SLA: Typical response within &lt; 4 hours</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <a
                  href={profileData.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-cyber-panel border border-cyber-border text-slate-200 hover:text-white hover:border-cyber-cyan text-xs flex items-center gap-2 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>

                <a
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-cyber-panel border border-cyber-border text-slate-200 hover:text-white hover:border-cyber-cyan text-xs flex items-center gap-2 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={profileData.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-cyber-panel border border-cyber-border text-slate-200 hover:text-white hover:border-cyber-cyan text-xs flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>sbakurdzhiev.com</span>
                </a>
              </div>
            </div>

            {/* Right: Interactive Dispatch Form */}
            <form onSubmit={handleSubmit} className="space-y-4 bg-cyber-surface p-5 rounded-lg border border-cyber-border/80">
              <div className="flex items-center justify-between border-b border-cyber-border/60 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyber-emerald" />
                  TRANSMIT DISPATCH
                </span>
                <span className="text-[10px] text-cyber-muted">PROTOCOL: SMTP / TLS</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-cyber-muted block">YOUR SENDER ADDRESS</label>
                <input
                  type="email"
                  required
                  placeholder="recruiter@enterprise.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-cyber-muted block">DISPATCH CONTENT / MISSION BRIEF</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Looking for a Senior DevOps / Platform Engineer for our Kubernetes & OpenShift infrastructure..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan font-mono resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded bg-gradient-to-r from-cyber-cyan to-cyber-emerald text-black font-bold text-xs flex items-center justify-center gap-2 shadow-glow-cyan hover:opacity-90 transition-all cursor-pointer"
              >
                {transmitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 fill-black" />
                    <span>DISPATCH SENT VIA MAIL CLIENT</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>SEND SECURE TRANSMISSION</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright / telemetry stamp */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-cyber-muted gap-3 pt-2">
          <div>
            © {new Date().getFullYear()} Stefan Bakurdzhiev // Senior DevOps Engineer
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>ENGINEERED WITH REACT + VITE + TAILWIND</span>
            <span>•</span>
            <span className="text-cyber-emerald">ZERO AI SLOP</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
