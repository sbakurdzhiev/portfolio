import React, { useState, useEffect } from 'react';
import { 
  X, Save, Download, Copy, Check, Eye, Edit3, 
  Terminal, Sparkles, FileText, Send, Tag, Clock, 
  FolderPlus, AlertTriangle, Key, ExternalLink
} from 'lucide-react';
import { sound } from '../utils/audio';

const STORAGE_KEY_DRAFT = 'portfolio-blog-draft-v1';
const STORAGE_KEY_GITHUB_TOKEN = 'portfolio-github-pat';

const INITIAL_TEMPLATE = `### Context & Problem Statement
Briefly describe the operational challenge or incident you encountered in production...

### Architectural Solution
Explain the approach, tools, and design decisions...

\`\`\`bash
# Command or manifest example
oc get pods -A | grep Error
\`\`\`

### Verification & Key Takeaways
1. First operational rule or checklist item
2. Second takeaway for production reliability
`;

export const PublishingStudioModal = ({ isOpen, onClose, onPostPublished }) => {
  const [activeSubTab, setActiveSubTab] = useState('editor'); // 'meta' | 'editor' | 'preview'
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('OpenShift & K8s');
  const [tagsInput, setTagsInput] = useState('OpenShift, Kubernetes, Production');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState(INITIAL_TEMPLATE);
  const [githubToken, setGithubToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);

  // Load saved draft and token on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY_DRAFT);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setTitle(parsed.title || '');
        setSlug(parsed.slug || '');
        setCategory(parsed.category || 'OpenShift & K8s');
        setTagsInput(parsed.tagsInput || 'OpenShift, Kubernetes');
        setSummary(parsed.summary || '');
        setContent(parsed.content || INITIAL_TEMPLATE);
      } catch (e) {
        console.error('Failed to parse draft:', e);
      }
    }

    const savedToken = localStorage.getItem(STORAGE_KEY_GITHUB_TOKEN);
    if (savedToken) setGithubToken(savedToken);
  }, []);

  // Autosave draft on change
  useEffect(() => {
    if (!title && !content) return;
    const timeout = setTimeout(() => {
      const draftObj = { title, slug, category, tagsInput, summary, content };
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(draftObj));
    }, 600);
    return () => clearTimeout(timeout);
  }, [title, slug, category, tagsInput, summary, content]);

  // Auto-slugify when title changes
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      const generated = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  const calculatedReadTime = () => {
    const words = (content + summary).trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 180));
    return `${minutes} min read`;
  };

  const buildMarkdownPayload = () => {
    const today = new Date().toISOString().split('T')[0];
    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const frontmatter = [
      '---',
      `title: "${title || 'Untitled Field Log'}"`,
      `slug: "${slug || 'untitled-post'}"`,
      `date: "${today}"`,
      `category: "${category}"`,
      `readTime: "${calculatedReadTime()}"`,
      `tags: [${tagsArray.map(t => `"${t}"`).join(', ')}]`,
      `summary: "${summary || 'Technical field log.'}"`,
      '---',
      '',
      content
    ].join('\n');
    return frontmatter;
  };

  // Instant Publish to local browser state
  const handlePublishLocal = () => {
    if (!title.trim()) {
      setStatusMessage('Error: Title is required before publishing.');
      return;
    }

    sound.playDeploySuccess();
    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const newArticle = {
      id: slug || `post-${Date.now()}`,
      title: title.trim(),
      summary: summary.trim() || 'Technical dispatch.',
      category,
      date: new Date().toISOString().split('T')[0],
      readTime: calculatedReadTime(),
      tags: tagsArray.length > 0 ? tagsArray : ['DevOps', 'Platform'],
      highlights: [
        'Battlefield-tested production insights',
        'Configured for high reliability & zero downtime'
      ],
      content
    };

    // Save into localStorage custom posts list
    const existing = JSON.parse(localStorage.getItem('portfolio-custom-posts') || '[]');
    const updated = [newArticle, ...existing.filter(p => p.id !== newArticle.id)];
    localStorage.setItem('portfolio-custom-posts', JSON.stringify(updated));

    if (onPostPublished) {
      onPostPublished(newArticle);
    }

    setStatusMessage('SUCCESS: Article published live! Ready for sharing.');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Download .md file directly to mobile phone or laptop
  const handleDownloadMd = () => {
    sound.playBeep(700, 0.05);
    const md = buildMarkdownPayload();
    const today = new Date().toISOString().split('T')[0];
    const filename = `${today}-${slug || 'post'}.md`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setStatusMessage(`Saved ${filename} to your downloads.`);
  };

  // Copy raw markdown for LinkedIn Articles or Git commit
  const handleCopyMarkdown = () => {
    sound.playKey();
    const md = buildMarkdownPayload();
    navigator.clipboard?.writeText(md);
    setCopied(true);
    setStatusMessage('Markdown copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  // Direct GitHub API Commit (On-the-go from phone without git CLI)
  const handleDirectGitHubCommit = async () => {
    if (!githubToken.trim()) {
      setShowTokenInput(true);
      setStatusMessage('Enter your GitHub Personal Access Token to commit from phone.');
      return;
    }

    if (!title.trim() || !slug.trim()) {
      setStatusMessage('Title and slug required.');
      return;
    }

    setIsCommitting(true);
    setStatusMessage('Connecting to GitHub API...');

    try {
      localStorage.setItem(STORAGE_KEY_GITHUB_TOKEN, githubToken);
      const today = new Date().toISOString().split('T')[0];
      const filename = `src/content/posts/${today}-${slug}.md`;
      const contentBase64 = btoa(unescape(encodeURIComponent(buildMarkdownPayload())));

      // Check if file exists first to get sha for update
      let sha = null;
      const getRes = await fetch(`https://api.github.com/repos/sbakurdzhiev/portfolio/contents/${filename}`, {
        headers: {
          'Authorization': `Bearer ${githubToken.trim()}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      const putRes = await fetch(`https://api.github.com/repos/sbakurdzhiev/portfolio/contents/${filename}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken.trim()}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `content(blog): publish "${title}" via mobile studio`,
          content: contentBase64,
          sha: sha || undefined
        })
      });

      if (!putRes.ok) {
        const err = await putRes.json();
        throw new Error(err.message || 'GitHub API error');
      }

      sound.playDeploySuccess();
      setStatusMessage(`COMMITTED TO GITHUB: ${filename}`);
      handlePublishLocal();
    } catch (err) {
      console.error(err);
      setStatusMessage(`GitHub Commit Failed: ${err.message}`);
    } finally {
      setIsCommitting(false);
    }
  };

  const insertSnippet = (prefix, suffix = '') => {
    sound.playKey();
    setContent(prev => prev + '\n' + prefix + suffix);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md font-mono select-none overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-cyber-surface border border-cyber-border rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-cyber-bg border-b border-cyber-border shrink-0">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-cyber-cyan" />
            <span className="text-xs sm:text-sm font-bold text-white tracking-wider">
              DISPATCH STUDIO // ON-THE-GO CMS
            </span>
            <span className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald font-bold">
              AUTOSAVED
            </span>
          </div>

          <button
            onClick={() => {
              sound.playBeep(450, 0.04);
              onClose();
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-cyber-panel transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Sub-tabs Navigation */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-cyber-panel/60 border-b border-cyber-border text-xs shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => { sound.playKey(); setActiveSubTab('editor'); }}
              className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'editor'
                  ? 'bg-cyber-cyan text-cyber-bg font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CONTENT</span>
            </button>

            <button
              onClick={() => { sound.playKey(); setActiveSubTab('meta'); }}
              className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'meta'
                  ? 'bg-cyber-cyan text-cyber-bg font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>METADATA & SEO</span>
            </button>

            <button
              onClick={() => { sound.playKey(); setActiveSubTab('preview'); }}
              className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'preview'
                  ? 'bg-cyber-emerald text-cyber-bg font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>PREVIEW</span>
            </button>
          </div>

          <span className="text-[11px] text-cyber-muted hidden sm:inline">
            {calculatedReadTime()}
          </span>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Status Alert Banner */}
          {statusMessage && (
            <div className={`p-2.5 rounded text-xs border flex items-center justify-between ${
              statusMessage.startsWith('SUCCESS') || statusMessage.startsWith('COMMITTED')
                ? 'bg-cyber-emerald/10 border-cyber-emerald/40 text-cyber-emerald'
                : statusMessage.startsWith('Error')
                ? 'bg-red-500/10 border-red-500/40 text-red-300'
                : 'bg-cyber-panel border-cyber-cyan/30 text-cyber-cyan'
            }`}>
              <span>{statusMessage}</span>
              <button onClick={() => setStatusMessage('')} className="text-slate-400 hover:text-white">✕</button>
            </div>
          )}

          {/* TAB 1: CONTENT EDITOR */}
          {activeSubTab === 'editor' && (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase text-cyber-muted tracking-wider block mb-1">
                  ARTICLE TITLE
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zero-Downtime OpenShift 4.14 In-Place Cluster Upgrades"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan font-bold"
                />
              </div>

              {/* Quick Format Snippet Bar */}
              <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="text-[10px] text-cyber-muted uppercase mr-1">SNIPPETS:</span>
                <button
                  type="button"
                  onClick={() => insertSnippet('### New Section Header')}
                  className="px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white cursor-pointer"
                >
                  ### Header
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('```bash\n# Terminal command\noc get nodes -o wide\n```')}
                  className="px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white cursor-pointer"
                >
                  ```bash
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('```yaml\napiVersion: v1\nkind: Pod\n```')}
                  className="px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white cursor-pointer"
                >
                  ```yaml
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('1. Step description\n2. Next step')}
                  className="px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white cursor-pointer"
                >
                  1. List
                </button>
              </div>

              <div>
                <label className="text-[10px] uppercase text-cyber-muted tracking-wider block mb-1">
                  MARKDOWN BODY CONTENT
                </label>
                <textarea
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write in standard Markdown. Use ```bash or ```yaml for syntax-highlighted code blocks..."
                  className="w-full bg-[#02050b] border border-cyber-border rounded p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyber-cyan font-mono leading-relaxed resize-y min-h-[260px]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: METADATA & SEO */}
          {activeSubTab === 'meta' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase text-cyber-muted tracking-wider block mb-1">
                    URL SLUG (PERMALINK)
                  </label>
                  <div className="flex items-center gap-1 bg-cyber-bg border border-cyber-border rounded px-2.5 py-1.5 text-xs">
                    <span className="text-slate-500">/blog/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="openshift-cluster-upgrade"
                      className="w-full bg-transparent text-white focus:outline-none font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Permanent shareable link identifier.
                  </span>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-cyber-muted tracking-wider block mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan font-mono"
                  >
                    <option value="OpenShift & K8s">OpenShift &amp; K8s</option>
                    <option value="GitOps & CI/CD">GitOps &amp; CI/CD</option>
                    <option value="Security">Security</option>
                    <option value="Platform Leadership">Platform Leadership</option>
                    <option value="Architecture">Architecture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-cyber-muted tracking-wider block mb-1">
                  TAGS (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="OpenShift, Kubernetes, High Availability, Banking SLA"
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-cyber-muted tracking-wider block mb-1">
                  EXECUTIVE SUMMARY / SOCIAL PREVIEW SNIPPET
                </label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Appears in social preview cards across LinkedIn, X, and Reddit. Max 180 characters recommended."
                  className="w-full bg-cyber-bg border border-cyber-border rounded p-3 text-xs text-slate-200 focus:outline-none focus:border-cyber-cyan font-mono resize-none"
                />
              </div>

              {/* GitHub PAT Configuration (Optional for direct phone push) */}
              <div className="bg-cyber-panel/40 border border-cyber-border/70 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <Key className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>GITHUB DIRECT COMMIT (OPTIONAL FOR PHONE)</span>
                  </div>
                  <button
                    onClick={() => setShowTokenInput(prev => !prev)}
                    className="text-[10px] text-cyber-cyan hover:underline cursor-pointer"
                  >
                    {showTokenInput ? 'HIDE' : 'CONFIGURE'}
                  </button>
                </div>
                {showTokenInput && (
                  <div className="space-y-1.5 pt-1">
                    <input
                      type="password"
                      placeholder="github_pat_xxxxxxxxxxxxxxxxxxxx"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      className="w-full bg-cyber-bg border border-cyber-border rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-cyan font-mono"
                    />
                    <p className="text-[10px] text-slate-400">
                      Token is saved only in your phone's browser localStorage. Requires <code>repo</code> contents write permissions to commit markdown directly.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE PREVIEW */}
          {activeSubTab === 'preview' && (
            <div className="border border-cyber-border bg-cyber-bg rounded-lg p-4 space-y-4">
              <div className="space-y-1 border-b border-cyber-border pb-3">
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan font-bold">
                    {category}
                  </span>
                  <span className="text-slate-400">{calculatedReadTime()}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {title || 'Untitled Field Log'}
                </h2>
                {summary && (
                  <p className="text-xs text-slate-300 italic border-l-2 border-cyber-cyan pl-2 py-0.5">
                    "{summary}"
                  </p>
                )}
              </div>

              <div className="text-xs text-slate-200 space-y-3 font-mono leading-relaxed">
                {content.split('\n\n').map((block, idx) => {
                  const trimmed = block.trim();
                  if (!trimmed) return null;
                  if (trimmed.startsWith('### ')) {
                    return <h3 key={idx} className="text-sm font-bold text-cyber-cyan pt-2">{trimmed.replace('### ', '# ')}</h3>;
                  }
                  if (trimmed.startsWith('```')) {
                    return (
                      <pre key={idx} className="bg-[#02050b] p-3 rounded border border-cyber-border text-emerald-400 overflow-x-auto text-[11px]">
                        {trimmed.replace(/```[a-z]*\n?/g, '')}
                      </pre>
                    );
                  }
                  return <p key={idx}>{trimmed}</p>;
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-cyber-bg border-t border-cyber-border flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded bg-cyber-panel border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-cyber-emerald" /> : <Copy className="w-3.5 h-3.5 text-cyber-cyan" />}
              <span className="hidden sm:inline">COPY MARKDOWN</span>
            </button>

            <button
              onClick={handleDownloadMd}
              className="px-3 py-1.5 rounded bg-cyber-panel border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-cyber-emerald" />
              <span className="hidden sm:inline">DOWNLOAD .MD</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {githubToken && (
              <button
                onClick={handleDirectGitHubCommit}
                disabled={isCommitting}
                className="px-3.5 py-1.5 rounded bg-purple-600/20 border border-purple-500/60 text-purple-300 hover:bg-purple-600 hover:text-white font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isCommitting ? 'COMMITTING...' : 'COMMIT TO REPO'}</span>
              </button>
            )}

            <button
              onClick={handlePublishLocal}
              className="px-4 py-1.5 rounded bg-gradient-to-r from-cyber-cyan to-cyber-emerald text-black font-bold shadow-glow-cyan hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>PUBLISH LIVE</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
