import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Calendar, Clock, Tag, Search, ArrowRight, 
  ChevronLeft, Terminal, Shield, Cpu, GitBranch, Users, 
  Share2, Check, ExternalLink, Bookmark, Edit3, PlusCircle, 
  Copy, Sparkles, Send, Linkedin, Lock, Rss, AlertTriangle,
  Info, ShieldAlert, ChevronDown, ChevronRight, Layers,
  Upload, FileText, CheckCircle2, MessageSquare
} from 'lucide-react';
import { sound } from '../utils/audio';
import { PublishingStudioModal } from './PublishingStudioModal';
import { getAllArticles, buildSyndicationPayload } from '../utils/markdownParser';

// Category icon map
const CATEGORY_ICONS = {
  'OpenShift & K8s': Cpu,
  'GitOps & CI/CD': GitBranch,
  'Security': Shield,
  'Platform Leadership': Users,
};

export const BlogSection = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL'); // 'ALL' | 'PUBLISHED' | 'DRAFT'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [syndicateModalOpen, setSyndicateModalOpen] = useState(false);
  const [syndicateCopied, setSyndicateCopied] = useState(false);
  const [syndicateTab, setSyndicateTab] = useState('devto'); // 'devto' | 'linkedin'
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(null);

  // Load articles from filesystem (.md) + localStorage
  const refreshArticles = () => {
    const all = getAllArticles();
    setArticles(all);
  };

  useEffect(() => {
    refreshArticles();

    // Check URL parameters for direct deep-link (e.g. ?tab=blog&post=openshift-zero-downtime)
    const params = new URLSearchParams(window.location.search);
    const postParam = params.get('post');
    if (postParam) {
      setSelectedArticleId(postParam);
    }
  }, []);

  const categories = ['ALL', 'OpenShift & K8s', 'GitOps & CI/CD', 'Security', 'Platform Leadership'];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'ALL' || article.category === selectedCategory;
    const matchesStatus = selectedStatusFilter === 'ALL' || 
      (selectedStatusFilter === 'PUBLISHED' && article.status !== 'draft') ||
      (selectedStatusFilter === 'DRAFT' && article.status === 'draft');
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const selectedArticle = articles.find(a => a.id === selectedArticleId || a.slug === selectedArticleId);

  // Open article & update URL without full page reload
  const handleOpenArticle = (id) => {
    sound.playBeep(650, 0.05);
    setSelectedArticleId(id);
    const found = articles.find(a => a.id === id || a.slug === id);
    if (found) {
      document.title = `${found.title} | Stefan Bakurdzhiev`;
    }
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('tab', 'blog');
    newUrl.searchParams.set('post', id);
    window.history.pushState({ post: id }, '', newUrl.toString());
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Back to list & restore URL/title
  const handleBack = () => {
    sound.playBeep(450, 0.04);
    setSelectedArticleId(null);
    document.title = 'Stefan Bakurdzhiev | Senior DevOps Engineer & Platform Lead';
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('tab', 'blog');
    newUrl.searchParams.delete('post');
    window.history.pushState({}, '', newUrl.toString());
  };

  const getCanonicalPostUrl = () => {
    if (!selectedArticle) return 'https://sbakurdzhiev.com/';
    return `https://sbakurdzhiev.com/?tab=blog&post=${encodeURIComponent(selectedArticle.id || selectedArticle.slug)}`;
  };

  const handleCopyLink = () => {
    sound.playBeep(700, 0.04);
    const url = getCanonicalPostUrl();
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMarkdown = () => {
    sound.playKey();
    if (!selectedArticle) return;
    const fullMd = [
      `# ${selectedArticle.title}`,
      `> Published: ${selectedArticle.date} • ${selectedArticle.readTime} • Category: ${selectedArticle.category}`,
      `> By Stefan Bakurdzhiev (Senior DevOps & Platform Lead @ DXC Bulgaria)`,
      '',
      `**Summary**: ${selectedArticle.summary}`,
      '',
      selectedArticle.content
    ].join('\n');

    navigator.clipboard?.writeText(fullMd);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  // Social Share Handlers
  const handleShareLinkedIn = () => {
    sound.playKey();
    const url = encodeURIComponent(getCanonicalPostUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    sound.playKey();
    if (!selectedArticle) return;
    const text = encodeURIComponent(`"${selectedArticle.title}" by @sbakurdzhiev`);
    const url = encodeURIComponent(getCanonicalPostUrl());
    const hashtags = 'devops,kubernetes,openshift,cloudnative';
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareReddit = () => {
    sound.playKey();
    if (!selectedArticle) return;
    const title = encodeURIComponent(selectedArticle.title);
    const url = encodeURIComponent(getCanonicalPostUrl());
    window.open(`https://www.reddit.com/submit?title=${title}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  // Copy individual code snippet
  const handleCopyCodeBlock = (codeText, idx) => {
    sound.playKey();
    navigator.clipboard?.writeText(codeText);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Trigger CMS to edit a post
  const handleEditCurrentArticle = (article) => {
    sound.playBeep(600, 0.05);
    setPostToEdit(article);
    setIsCmsOpen(true);
  };

  // Handle post publish or update from studio
  const handlePostPublishedFromStudio = (newOrUpdatedPost) => {
    refreshArticles();
    handleOpenArticle(newOrUpdatedPost.id);
  };

  // Build Dev.to / Medium syndication payload
  const getDevtoPayload = () => {
    if (!selectedArticle) return '';
    return buildSyndicationPayload(selectedArticle, 'https://sbakurdzhiev.com');
  };

  // Build LinkedIn post announcement copy
  const getLinkedInAnnouncement = () => {
    if (!selectedArticle) return '';
    const highlights = selectedArticle.highlights && selectedArticle.highlights.length > 0
      ? selectedArticle.highlights.map(h => `⚡ ${h}`).join('\n')
      : '';
    
    return [
      `🚀 New Field Log: "${selectedArticle.title}"`,
      '',
      selectedArticle.summary,
      '',
      highlights ? `Key Insights:\n${highlights}\n` : '',
      `Read the full architecture breakdown & scripts here (no paywall):`,
      getCanonicalPostUrl(),
      '',
      '#DevOps #Kubernetes #OpenShift #PlatformEngineering #CloudNative #SRE #DXCBulgaria'
    ].filter(Boolean).join('\n');
  };

  const handleCopySyndicate = (text) => {
    sound.playDeploySuccess();
    navigator.clipboard?.writeText(text);
    setSyndicateCopied(true);
    setTimeout(() => setSyndicateCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Section Header with Prominent Publish & RSS Controls */}
      <div className="border border-cyber-border bg-cyber-surface rounded-lg p-5 sm:p-6 relative overflow-hidden corner-bracket">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyber-cyan text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-cyber-cyan" />
              <span>TACTICAL FIELD LOGS // ARCHITECTURE JOURNAL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              DevOps, Kubernetes &amp; Platform Engineering Insights
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Production playbooks, post-mortems, and architectural blueprints written from real-world operations in enterprise banking, OpenShift clustering, and platform team leadership.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* User Requested: "Publish" Button */}
            <button
              onClick={() => {
                sound.playBeep(700, 0.05);
                setPostToEdit(null); // Fresh new post
                setIsCmsOpen(true);
              }}
              className="px-3.5 py-2 rounded bg-gradient-to-r from-cyber-cyan to-cyber-emerald text-black font-bold text-xs flex items-center gap-2 shadow-glow-cyan hover:opacity-90 transition-all cursor-pointer"
              title="Launch On-the-Go Publishing Studio to write and publish dispatches"
            >
              <Upload className="w-3.5 h-3.5 fill-black" />
              <span>PUBLISH</span>
            </button>

            {/* RSS Feed Button */}
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded bg-cyber-bg border border-cyber-border hover:border-amber-400 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Subscribe to RSS 2.0 Feed"
            >
              <Rss className="w-3.5 h-3.5" />
              <span>RSS FEED</span>
            </a>

            <div className="flex items-center gap-1.5 bg-cyber-bg px-2.5 py-2 rounded border border-cyber-border text-xs">
              <span className="text-slate-400">DISPATCHES:</span>
              <span className="text-cyber-cyan font-bold">{articles.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ARTICLE FULL VIEW                                              */}
      {/* ============================================================== */}
      {selectedArticle ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Breadcrumb & Navigation Controls */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-cyber-cyan hover:text-white px-3 py-1.5 rounded bg-cyber-surface border border-cyber-border hover:border-cyber-cyan transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>RETURN TO DISPATCH LIST</span>
            </button>

            {/* Quick Actions (Edit, Syndicate, Copy Link, Social) */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Edit Post Trigger */}
              <button
                onClick={() => handleEditCurrentArticle(selectedArticle)}
                className="px-2.5 py-1.5 rounded bg-cyber-panel border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-all flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
                title="Edit this post in the CMS Studio"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>EDIT POST</span>
              </button>

              {/* Dev.to / Medium Syndication */}
              <button
                onClick={() => {
                  sound.playBeep(600, 0.04);
                  setSyndicateModalOpen(true);
                }}
                className="px-2.5 py-1.5 rounded bg-cyber-surface border border-cyber-border hover:border-purple-400 text-purple-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                title="Syndicate to Dev.to / Medium / Hashnode with SEO canonical link"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>SYNDICATE</span>
              </button>

              {/* Copy Markdown */}
              <button
                onClick={handleCopyMarkdown}
                className="px-2.5 py-1.5 rounded bg-cyber-surface border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                title="Copy formatted markdown"
              >
                {copiedMd ? <Check className="w-3.5 h-3.5 text-cyber-emerald" /> : <Copy className="w-3.5 h-3.5 text-cyber-cyan" />}
                <span>{copiedMd ? 'COPIED MD!' : 'COPY MD'}</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1.5 rounded bg-cyber-surface border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                title="Copy canonical share URL"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-cyber-emerald" /> : <Share2 className="w-3.5 h-3.5 text-cyber-cyan" />}
                <span>{copiedLink ? 'LINK COPIED' : 'SHARE'}</span>
              </button>
            </div>
          </div>

          {/* Main Article Document */}
          <article className="border border-cyber-border bg-cyber-surface rounded-lg p-6 sm:p-8 space-y-6 relative overflow-hidden">
            {/* Header info */}
            <div className="space-y-4 border-b border-cyber-border pb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded bg-cyber-panel border border-cyber-cyan/40 text-cyber-cyan text-xs font-bold uppercase tracking-wider">
                  {selectedArticle.category}
                </span>

                {/* Status chip */}
                {selectedArticle.status === 'draft' ? (
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[10px] font-bold">
                    [DRAFT IN PROGRESS]
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-cyber-emerald/10 border border-cyber-emerald/40 text-cyber-emerald text-[10px] font-bold">
                    [LIVE PRODUCTION DISPATCH]
                  </span>
                )}

                {selectedArticle.isCustom && (
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px]">
                    LOCAL CMS OVERRIDE
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide leading-tight">
                {selectedArticle.title}
              </h1>

              {/* Meta row */}
              <div className="flex items-center gap-4 text-xs text-cyber-muted flex-wrap">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>PUBLISHED: {selectedArticle.date}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-cyber-emerald" />
                  <span>{selectedArticle.readTime}</span>
                </span>
                <span className="text-slate-400">
                  AUTHOR: <strong className="text-white">Stefan Bakurdzhiev</strong>
                </span>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {selectedArticle.tags?.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border/70 text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Executive Summary Callout */}
            {selectedArticle.summary && (
              <div className="p-4 rounded-lg bg-cyber-bg/70 border-l-4 border-cyber-cyan border-t border-r border-b border-cyber-border text-xs sm:text-sm text-slate-200 leading-relaxed space-y-1">
                <span className="text-[11px] font-bold text-cyber-cyan uppercase tracking-wider block">
                  TACTICAL SUMMARY &amp; OPERATIONAL CONTEXT
                </span>
                <p>{selectedArticle.summary}</p>
              </div>
            )}

            {/* Key Architectural Highlights */}
            {selectedArticle.highlights && selectedArticle.highlights.length > 0 && (
              <div className="border border-cyber-border/80 bg-cyber-panel/40 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-cyber-emerald" />
                  <span>KEY ARCHITECTURAL HIGHLIGHTS</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {selectedArticle.highlights.map((item, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 bg-cyber-bg/50 p-2 rounded border border-cyber-border/40">
                      <span className="text-cyber-emerald font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Markdown Body Content with Rich Elements (Callouts, Tables, Interactive Code Copy) */}
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-5 pt-2">
              {selectedArticle.content.split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                // 1. Heading 3 (###)
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-base sm:text-lg font-bold text-white pt-4 pb-1 border-b border-cyber-border/60 flex items-center gap-2">
                      <span className="text-cyber-cyan font-mono">#</span>
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }

                // 2. Heading 2 (##)
                if (trimmed.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-lg sm:text-xl font-bold text-white pt-5 pb-1 border-b border-cyber-border flex items-center gap-2">
                      <span className="text-cyber-emerald font-mono">##</span>
                      {trimmed.replace('## ', '')}
                    </h2>
                  );
                }

                // 3. Callout Boxes (> [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT], > [!CAUTION])
                if (trimmed.startsWith('> [!')) {
                  const calloutTypeMatch = trimmed.match(/^>\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/i);
                  if (calloutTypeMatch) {
                    const calloutType = calloutTypeMatch[1].toUpperCase();
                    const calloutBody = trimmed
                      .replace(/^>\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*\n?/i, '')
                      .replace(/^>\s?/gm, '')
                      .trim();

                    const config = {
                      NOTE: {
                        border: 'border-cyber-cyan',
                        bg: 'bg-cyber-cyan/10',
                        textColor: 'text-cyber-cyan',
                        icon: Info,
                        label: 'OPERATIONAL NOTE'
                      },
                      TIP: {
                        border: 'border-cyber-emerald',
                        bg: 'bg-cyber-emerald/10',
                        textColor: 'text-cyber-emerald',
                        icon: Sparkles,
                        label: 'TACTICAL PRO-TIP'
                      },
                      WARNING: {
                        border: 'border-amber-400',
                        bg: 'bg-amber-500/10',
                        textColor: 'text-amber-400',
                        icon: AlertTriangle,
                        label: 'PRODUCTION WARNING'
                      },
                      CAUTION: {
                        border: 'border-red-400',
                        bg: 'bg-red-500/10',
                        textColor: 'text-red-400',
                        icon: AlertTriangle,
                        label: 'CRITICAL CAUTION'
                      },
                      IMPORTANT: {
                        border: 'border-purple-400',
                        bg: 'bg-purple-500/10',
                        textColor: 'text-purple-300',
                        icon: ShieldAlert,
                        label: 'MANDATORY REQUIREMENT'
                      }
                    }[calloutType] || {
                      border: 'border-cyber-cyan',
                      bg: 'bg-cyber-bg',
                      textColor: 'text-cyber-cyan',
                      icon: Info,
                      label: calloutType
                    };

                    const CalloutIcon = config.icon;

                    return (
                      <div
                        key={idx}
                        className={`my-4 p-4 rounded-lg border-l-4 ${config.border} ${config.bg} border-t border-r border-b border-cyber-border space-y-1`}
                      >
                        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${config.textColor}`}>
                          <CalloutIcon className="w-4 h-4" />
                          <span>{config.label}</span>
                        </div>
                        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                          {calloutBody}
                        </p>
                      </div>
                    );
                  }
                }

                // 4. Code Blocks with Interactive Copy Button & Terminal Frame
                if (trimmed.startsWith('```')) {
                  const lines = trimmed.split('\n');
                  const codeLang = lines[0].replace('```', '').trim() || 'bash';
                  const codeBody = lines.slice(1, -1).join('\n');
                  const isCopied = copiedCodeIdx === idx;

                  return (
                    <div key={idx} className="my-4 rounded-lg overflow-hidden border border-cyber-border bg-[#02050b] shadow-lg">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-cyber-panel border-b border-cyber-border text-[11px] text-cyber-muted">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                          <span className="font-bold text-cyber-cyan ml-2">{codeLang.toUpperCase()} BUFFER</span>
                        </div>

                        {/* Interactive Code Copy Button */}
                        <button
                          onClick={() => handleCopyCodeBlock(codeBody, idx)}
                          className="px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border hover:border-cyber-cyan text-cyber-cyan hover:text-white flex items-center gap-1 transition-all cursor-pointer text-[10px]"
                          title="Copy snippet to clipboard"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-cyber-emerald" />
                              <span className="text-cyber-emerald font-bold">COPIED ✓</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>COPY CODE</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed select-text">
                        {codeBody}
                      </pre>
                    </div>
                  );
                }

                // 5. GFM Markdown Tables
                if (trimmed.includes('|') && trimmed.split('\n').every(l => l.trim().startsWith('|') && l.trim().endsWith('|'))) {
                  const tableLines = trimmed.split('\n').filter(l => l.trim().length > 0);
                  if (tableLines.length >= 2) {
                    const headerRow = tableLines[0].split('|').slice(1, -1).map(c => c.trim());
                    const dataRows = tableLines.slice(2).map(r => r.split('|').slice(1, -1).map(c => c.trim()));

                    return (
                      <div key={idx} className="my-4 overflow-x-auto rounded-lg border border-cyber-border bg-cyber-bg/60">
                        <table className="w-full text-xs font-mono text-left border-collapse">
                          <thead>
                            <tr className="bg-cyber-panel border-b border-cyber-border text-cyber-cyan font-bold">
                              {headerRow.map((cell, cIdx) => (
                                <th key={cIdx} className="px-3 py-2 border-r border-cyber-border/60 last:border-r-0">
                                  {cell}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {dataRows.map((row, rIdx) => (
                              <tr 
                                key={rIdx} 
                                className={`border-b border-cyber-border/40 last:border-b-0 ${
                                  rIdx % 2 === 0 ? 'bg-cyber-surface/30' : 'bg-transparent'
                                } hover:bg-cyber-panel/50 transition-colors`}
                              >
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-3 py-2 border-r border-cyber-border/30 last:border-r-0 text-slate-300">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                }

                // 6. Numbered / Bullet Lists
                if (trimmed.startsWith('1. ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  return (
                    <div key={idx} className="bg-cyber-bg/50 p-3.5 rounded border border-cyber-border/50 text-xs sm:text-sm space-y-1.5 my-2">
                      {trimmed.split('\n').map((line, lIdx) => (
                        <div key={lIdx} className="flex items-start gap-2">
                          <span className="text-cyber-cyan font-bold">▫</span>
                          <span>{line.replace(/^[0-9]\. |- |\* /, '')}</span>
                        </div>
                      ))}
                    </div>
                  );
                }

                // Standard Paragraph
                return (
                  <p key={idx} className="text-slate-300 leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Article Footer & Author Signature */}
            <div className="border-t border-cyber-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-cyber-muted">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-cyber-panel border border-cyber-cyan/50 flex items-center justify-center font-bold text-cyber-cyan">
                  SB
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Stefan Bakurdzhiev</div>
                  <div className="text-[11px] text-slate-400">Senior DevOps &amp; Platform Lead • DXC Bulgaria</div>
                  <div className="text-[10px] text-cyber-emerald">Sofia, Bulgaria 🇧🇬 • OpenShift &amp; K8s Specialist</div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleShareLinkedIn}
                  className="px-3 py-1.5 rounded bg-cyber-bg border border-cyber-border hover:border-[#0a66c2] text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#0a66c2]" />
                  <span>LINKEDIN</span>
                </button>
                <button
                  onClick={handleShareTwitter}
                  className="px-3 py-1.5 rounded bg-cyber-bg border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>X / TWITTER</span>
                </button>
                <button
                  onClick={handleBack}
                  className="px-4 py-1.5 rounded bg-cyber-panel border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan hover:text-black font-bold transition-all cursor-pointer"
                >
                  ← ALL ARTICLES
                </button>
              </div>
            </div>
          </article>
        </div>
      ) : (
        /* ============================================================== */
        /* ARTICLES DIRECTORY VIEW                                        */
        /* ============================================================== */
        <div className="space-y-6">
          {/* Filter Ribbon, Status Filter & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-cyber-surface border border-cyber-border p-3 rounded-lg text-xs">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sound.playBeep(520, 0.03);
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded transition-all whitespace-nowrap cursor-pointer text-xs font-medium ${
                    selectedCategory === cat
                      ? 'bg-cyber-panel text-cyber-cyan border border-cyber-cyan/60 font-bold shadow-xs'
                      : 'text-cyber-muted hover:text-white hover:bg-cyber-bg border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status Filter + Search Input */}
            <div className="flex items-center gap-2">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-cyber-bg border border-cyber-border text-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-cyber-cyan cursor-pointer"
                title="Filter by status"
              >
                <option value="ALL">ALL STATUSES</option>
                <option value="PUBLISHED">LIVE ONLY</option>
                <option value="DRAFT">DRAFTS ONLY</option>
              </select>

              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search logs &amp; topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-cyber-bg border border-cyber-border rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan"
                />
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => {
              return (
                <div
                  key={article.id}
                  onClick={() => handleOpenArticle(article.id)}
                  className="bg-cyber-surface border border-cyber-border hover:border-cyber-cyan/70 rounded-lg p-5 flex flex-col justify-between transition-all duration-200 group cursor-pointer hover:shadow-glow-subtle relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Header meta */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyber-panel border border-cyber-cyan/30 text-cyber-cyan text-[10px] font-bold">
                          {article.category}
                        </span>

                        {article.status === 'draft' ? (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-bold">
                            DRAFT
                          </span>
                        ) : article.status === 'scheduled' ? (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[9px] font-bold">
                            SCHEDULED
                          </span>
                        ) : null}
                      </div>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {article.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white group-hover:text-cyber-cyan transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-cyber-border/60 mt-4 flex items-center justify-between text-xs text-cyber-muted">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </span>

                    <span className="text-cyber-cyan flex items-center gap-1 text-[11px] font-bold group-hover:translate-x-1 transition-transform">
                      <span>READ DISPATCH</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredArticles.length === 0 && (
            <div className="p-8 text-center border border-cyber-border bg-cyber-surface rounded-lg space-y-2">
              <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm text-slate-400 font-bold">No dispatches match the active filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedStatusFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-xs text-cyber-cyan hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SYNDICATION MODAL (DEV.TO / MEDIUM / LINKEDIN)                */}
      {/* ============================================================== */}
      {syndicateModalOpen && selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-cyber-surface border border-purple-500/60 rounded-xl p-5 max-w-2xl w-full max-h-[85vh] flex flex-col space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>CROSS-PLATFORM SYNDICATION ENGINE</span>
              </div>
              <button
                onClick={() => setSyndicateModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Syndicate this dispatch to Dev.to, Hashnode, Medium or LinkedIn with pre-configured SEO canonical tags so Google ranks <strong className="text-white">sbakurdzhiev.com</strong> as the primary authoritative source.
            </p>

            {/* Sub tabs */}
            <div className="flex items-center gap-2 border-b border-cyber-border pb-2 text-xs">
              <button
                onClick={() => setSyndicateTab('devto')}
                className={`px-3 py-1 rounded transition-colors ${
                  syndicateTab === 'devto'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                DEV.TO / HASHNODE / MEDIUM
              </button>
              <button
                onClick={() => setSyndicateTab('linkedin')}
                className={`px-3 py-1 rounded transition-colors ${
                  syndicateTab === 'linkedin'
                    ? 'bg-[#0a66c2]/20 text-blue-300 border border-[#0a66c2]/50 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                LINKEDIN POST COPY
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto">
              <pre className="p-3 bg-[#02050b] border border-cyber-border rounded text-[11px] text-slate-300 font-mono whitespace-pre-wrap select-all leading-relaxed max-h-60 overflow-y-auto">
                {syndicateTab === 'devto' ? getDevtoPayload() : getLinkedInAnnouncement()}
              </pre>
            </div>

            {/* Action footer */}
            <div className="flex items-center justify-between pt-2 border-t border-cyber-border">
              <span className="text-[11px] text-cyber-muted">
                {syndicateTab === 'devto' ? 'Includes canonical_url frontmatter' : 'Includes hashtags & direct URL'}
              </span>

              <button
                onClick={() => handleCopySyndicate(syndicateTab === 'devto' ? getDevtoPayload() : getLinkedInAnnouncement())}
                className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-cyber-cyan text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-glow-subtle"
              >
                {syndicateCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{syndicateCopied ? 'COPIED TO CLIPBOARD!' : 'COPY TO CLIPBOARD'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PUBLISHING STUDIO MODAL (ON-THE-GO CMS)                         */}
      {/* ============================================================== */}
      <PublishingStudioModal
        isOpen={isCmsOpen}
        onClose={() => {
          setIsCmsOpen(false);
          setPostToEdit(null);
        }}
        onPostPublished={handlePostPublishedFromStudio}
        initialPost={postToEdit}
      />
    </div>
  );
};
