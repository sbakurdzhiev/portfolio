import React, { useState, useEffect } from 'react';
import { 
  X, Save, Download, Copy, Check, Eye, Edit3, 
  Terminal, Sparkles, FileText, Send, Tag, Clock, 
  FolderPlus, AlertTriangle, Key, ExternalLink, Lock,
  Unlock, Shield, ShieldAlert, LogOut, EyeOff, Trash2,
  Calendar, Layers, CheckCircle2, RotateCcw, Plus,
  Info, ArrowRight, Upload
} from 'lucide-react';
import { sound } from '../utils/audio';
import { 
  getAllArticles, 
  saveCustomArticle, 
  deleteCustomArticle, 
  buildMarkdownPayload 
} from '../utils/markdownParser';

const STORAGE_KEY_DRAFT = 'portfolio-blog-draft-v1';
const STORAGE_KEY_GITHUB_TOKEN = 'portfolio-github-pat';
const STORAGE_KEY_AUTH_HASH = 'portfolio-cms-auth-hash';
const SESSION_AUTH_KEY = 'portfolio-cms-session-auth';

// Build-time configured access key hash (SHA-256 hex of your passphrase).
// Set VITE_CMS_KEY_HASH in .env.local or as a CI variable; never commit the plaintext key.
// NOTE: this is a client-side UI gate only. The real credential protecting the repo
// is the GitHub token, which is never bundled and only lives in this browser session.
const CONFIGURED_HASH = String(import.meta.env.VITE_CMS_KEY_HASH || '').trim().toLowerCase();

// Strict slug format used for repository file paths (prevents path traversal like "../")
const sanitizeSlug = (value) =>
  String(value || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '').slice(0, 100);

// Length-independent comparison of two hex digests
const safeEqual = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

/**
 * Universal SHA-256 hashing function
 * Uses window.crypto.subtle when available (HTTPS / secure context),
 * and falls back to a pure JS SHA-256 algorithm on plain HTTP / IP addresses.
 */
async function computeSha256(str) {
  // Try native SubtleCrypto if running in a secure context (HTTPS or localhost)
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle && window.isSecureContext) {
    try {
      const enc = new TextEncoder();
      const buf = await window.crypto.subtle.digest('SHA-256', enc.encode(str));
      return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (e) {
      // Fall through to pure JS implementation
    }
  }

  // Pure JavaScript SHA-256 (RFC 6234 compliant, works everywhere over HTTP/IP)
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length';
  var i, j;
  var result = '';
  var words = [];
  var asciiBitLength = str[lengthProperty] * 8;
  var hash = [];
  var k = [];
  var primeCounter = 0;
  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  hash = hash.slice(0, 8);
  var ascii = str + '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;
  for (j = 0; j < words[lengthProperty]; ) {
    var w = words.slice(j, (j += 16));
    var oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      var i2 = i + j;
      var w15 = w[i - 15],
        w2 = w[i - 2];
      var a = hash[0],
        e = hash[4];
      var temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      var temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  for (i = 0; i < 8; i++) {
    for (var i2 = 3; i2 >= 0; i2--) {
      var b = (hash[i] >> (i2 * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

const INITIAL_TEMPLATE = `### Context & Problem Statement
Briefly describe the operational challenge or incident you encountered in production...

> [!NOTE]
> Add architectural context or background constraints here.

### Architectural Solution
Explain the approach, tools, and design decisions...

\`\`\`bash
# Operational command or verification script
oc get pods -A | grep -v Running
\`\`\`

| Component | Target State | Failure Strategy |
| :--- | :--- | :--- |
| **Control Plane** | Healthy Quorum | Automatic failover |
| **Worker Nodes** | Ready & Drainable | Eviction with PDB enforcement |

> [!TIP]
> Add a battlefield-tested pro-tip for cluster operators.

### Verification & Key Takeaways
1. First operational rule or checklist item
2. Second takeaway for production reliability
`;

export const PublishingStudioModal = ({ isOpen, onClose, onPostPublished, initialPost = null }) => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Security Lockout Countdown
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockoutRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  // Password Change state
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // Editor states
  const [activeSubTab, setActiveSubTab] = useState('editor'); // 'manager' | 'editor' | 'preview' | 'security'
  const [editingPostId, setEditingPostId] = useState(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('OpenShift & K8s');
  const [status, setStatus] = useState('published'); // 'published' | 'draft' | 'scheduled'
  const [scheduledDate, setScheduledDate] = useState('');
  const [tagsInput, setTagsInput] = useState('OpenShift, Kubernetes, Production');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState(INITIAL_TEMPLATE);
  const [githubToken, setGithubToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);

  // Manager state
  const [managerArticles, setManagerArticles] = useState([]);
  const [managerFilter, setManagerFilter] = useState('ALL'); // 'ALL' | 'PUBLISHED' | 'DRAFT' | 'SCHEDULED'
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Load all articles for manager
  const reloadManagerArticles = () => {
    const list = getAllArticles();
    setManagerArticles(list);
  };

  // Check session authentication on mount or when opened
  useEffect(() => {
    if (isOpen) {
      const isSessionAuthed = sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
      setIsAuthenticated(isSessionAuthed);
      setAuthError('');
      setAuthPassword('');
      reloadManagerArticles();

      // If initialPost is passed, load it directly into editor
      if (initialPost) {
        loadArticleIntoEditor(initialPost);
        setActiveSubTab('editor');
      }
    }
  }, [isOpen, initialPost]);

  // Load saved token on mount (session-scoped; purge any legacy persistent copy)
  useEffect(() => {
    const legacyToken = localStorage.getItem(STORAGE_KEY_GITHUB_TOKEN);
    if (legacyToken) localStorage.removeItem(STORAGE_KEY_GITHUB_TOKEN);
    const savedToken = sessionStorage.getItem(STORAGE_KEY_GITHUB_TOKEN);
    if (savedToken) setGithubToken(savedToken);
  }, []);

  // Autosave draft on change (only when creating a new draft)
  useEffect(() => {
    if (editingPostId) return; // Do not overwrite new draft buffer when editing existing post
    if (!title && !content) return;
    const timeout = setTimeout(() => {
      const draftObj = { title, slug, category, status, scheduledDate, tagsInput, summary, content };
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(draftObj));
    }, 600);
    return () => clearTimeout(timeout);
  }, [title, slug, category, status, scheduledDate, tagsInput, summary, content, editingPostId]);

  // Load an article into the editor
  const loadArticleIntoEditor = (article) => {
    setEditingPostId(article.id);
    setTitle(article.title || '');
    setSlug(article.slug || article.id || '');
    setCategory(article.category || 'OpenShift & K8s');
    setStatus(article.status || 'published');
    setScheduledDate(article.scheduledDate || '');
    setTagsInput(Array.isArray(article.tags) ? article.tags.join(', ') : (article.tags || ''));
    setSummary(article.summary || '');
    setContent(article.content || INITIAL_TEMPLATE);
    setStatusMessage(`Loaded: "${article.title}"`);
    setActiveSubTab('editor');
  };

  // Reset editor to clean new post
  const handleResetToNew = () => {
    sound.playBeep(450, 0.04);
    setEditingPostId(null);
    setTitle('');
    setSlug('');
    setCategory('OpenShift & K8s');
    setStatus('published');
    setScheduledDate('');
    setTagsInput('OpenShift, Kubernetes, Production');
    setSummary('');
    setContent(INITIAL_TEMPLATE);
    setStatusMessage('Cleared editor: ready for new dispatch.');
    setActiveSubTab('editor');
  };

  // Handle password login verification with rate limiting & brute-force defense
  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    if (!authPassword.trim()) {
      setAuthError('Please enter operator access key.');
      return;
    }

    // Artificial constant-time delay against timing side-channel attacks
    await new Promise(r => setTimeout(r, 180));

    const expectedHash = (localStorage.getItem(STORAGE_KEY_AUTH_HASH) || CONFIGURED_HASH).toLowerCase();
    if (!expectedHash) {
      setAuthError('STUDIO NOT CONFIGURED: set VITE_CMS_KEY_HASH at build time.');
      return;
    }

    try {
      const inputHash = await computeSha256(authPassword.trim());

      if (safeEqual(inputHash, expectedHash)) {
        sound.playDeploySuccess();
        sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
        setIsAuthenticated(true);
        setFailedAttempts(0);
        setLockoutRemaining(0);
        setAuthError('');
        setAuthPassword('');
        reloadManagerArticles();
      } else {
        sound.playBeep(220, 0.15); // Buzz error sound
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        if (nextFailed >= 5) {
          setLockoutRemaining(60);
          setAuthError('SECURITY LOCKOUT: Excessive failed attempts. Locked for 60 seconds.');
        } else if (nextFailed >= 3) {
          setLockoutRemaining(15);
          setAuthError('RATE LIMIT EXCEEDED: Security cooldown active (15 seconds).');
        } else {
          setAuthError(`ACCESS DENIED: Invalid operator key. (${nextFailed}/3 attempts before cooldown)`);
        }
      }
    } catch (err) {
      console.error(err);
      setAuthError('ACCESS DENIED: Invalid operator key.');
    }
  };

  // Emergency Purge Stored Credentials
  const handlePurgeAllSecrets = () => {
    if (window.confirm('Revoke all stored GitHub tokens, custom password hashes, and active sessions from this browser?')) {
      localStorage.removeItem(STORAGE_KEY_GITHUB_TOKEN);
      sessionStorage.removeItem(STORAGE_KEY_GITHUB_TOKEN);
      localStorage.removeItem(STORAGE_KEY_AUTH_HASH);
      sessionStorage.removeItem(SESSION_AUTH_KEY);
      setGithubToken('');
      setIsAuthenticated(false);
      sound.playBeep(350, 0.1);
      setStatusMessage('ALL STORED SECRETS PURGED.');
      onClose();
    }
  };

  // Handle setting a new custom master password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.trim().length < 6) {
      setStatusMessage('Error: New key must be at least 6 characters.');
      return;
    }

    try {
      const newHash = await computeSha256(newPassword.trim());
      localStorage.setItem(STORAGE_KEY_AUTH_HASH, newHash);
      sound.playDeploySuccess();
      setNewPassword('');
      setPasswordChangeSuccess(true);
      setStatusMessage('SUCCESS: Operator Access Key updated.');
      setTimeout(() => setPasswordChangeSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage('Failed to update password hash.');
    }
  };

  const handleLogout = () => {
    sound.playBeep(450, 0.05);
    sessionStorage.removeItem(SESSION_AUTH_KEY);
    setIsAuthenticated(false);
    setStatusMessage('Logged out of Publishing Studio.');
  };

  // Auto-slugify when title changes
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!editingPostId && (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))) {
      const generated = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  const calculatedReadTime = () => {
    const words = (content + summary).trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 180));
    return `${minutes} min read`;
  };

  // Assemble full article object
  const buildCurrentArticleObject = (overrideStatus = null) => {
    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const postSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `post-${Date.now()}`;
    const postId = editingPostId || postSlug;
    const finalStatus = overrideStatus || status;

    return {
      id: postId,
      slug: postSlug,
      title: title.trim() || 'Untitled Field Log',
      summary: summary.trim() || 'Technical field log dispatch.',
      category,
      date: new Date().toISOString().split('T')[0],
      readTime: calculatedReadTime(),
      status: finalStatus,
      scheduledDate: finalStatus === 'scheduled' ? scheduledDate : null,
      tags: tagsArray.length > 0 ? tagsArray : ['DevOps', 'Platform'],
      highlights: [
        'Battlefield-tested production insights',
        'Configured for high reliability & zero downtime'
      ],
      content
    };
  };

  // Save / Publish locally to browser state
  const handleSaveArticle = (targetStatus = 'published') => {
    if (!title.trim()) {
      setStatusMessage('Error: Title is required before publishing.');
      return;
    }

    sound.playDeploySuccess();
    const article = buildCurrentArticleObject(targetStatus);
    saveCustomArticle(article);
    reloadManagerArticles();

    if (onPostPublished) {
      onPostPublished(article);
    }

    setStatusMessage(`SUCCESS: Post saved as [${targetStatus.toUpperCase()}]!`);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  // Delete article from manager
  const handleDeleteArticle = (id) => {
    sound.playBeep(300, 0.1);
    deleteCustomArticle(id);
    reloadManagerArticles();
    setDeleteConfirmId(null);
    setStatusMessage('Article removed from local posts.');
    if (editingPostId === id) {
      handleResetToNew();
    }
  };

  // Duplicate an article
  const handleDuplicateArticle = (article) => {
    sound.playKey();
    const clone = {
      ...article,
      id: `${article.slug}-copy-${Date.now().toString().slice(-4)}`,
      slug: `${article.slug}-copy`,
      title: `${article.title} (Copy)`,
      status: 'draft'
    };
    loadArticleIntoEditor(clone);
    setEditingPostId(null); // Save as new
    setStatusMessage(`Duplicated "${article.title}" as draft.`);
  };

  // Download .md file directly to mobile phone or laptop
  const handleDownloadMd = () => {
    sound.playBeep(700, 0.05);
    const article = buildCurrentArticleObject();
    const md = buildMarkdownPayload(article);
    const today = new Date().toISOString().split('T')[0];
    const filename = `${today}-${article.slug}.md`;

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

  // Copy raw markdown
  const handleCopyMarkdown = () => {
    sound.playKey();
    const article = buildCurrentArticleObject();
    const md = buildMarkdownPayload(article);
    navigator.clipboard?.writeText(md);
    setCopied(true);
    setStatusMessage('Markdown with YAML frontmatter copied!');
    setTimeout(() => setCopied(false), 2500);
  };

  // Direct GitHub API Commit (On-the-go from phone without git CLI)
  const handleDirectGitHubCommit = async () => {
    if (!githubToken.trim()) {
      setActiveSubTab('security');
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
      sessionStorage.setItem(STORAGE_KEY_GITHUB_TOKEN, githubToken);
      const article = buildCurrentArticleObject('published');
      const safeSlug = sanitizeSlug(article.slug);
      if (!safeSlug) throw new Error('Invalid slug: use letters, numbers and dashes only.');
      const today = new Date().toISOString().split('T')[0];
      const filename = `src/content/posts/${today}-${safeSlug}.md`;
      const mdPayload = buildMarkdownPayload(article);
      const contentBase64 = btoa(unescape(encodeURIComponent(mdPayload)));

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
          message: `content(blog): publish "${article.title}" via mobile publishing studio`,
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
      handleSaveArticle('published');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md font-mono select-none overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-cyber-surface border border-cyber-border rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-cyber-bg border-b border-cyber-border shrink-0">
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Unlock className="w-4 h-4 text-cyber-emerald" />
            ) : (
              <Lock className="w-4 h-4 text-cyber-cyan" />
            )}
            <span className="text-xs sm:text-sm font-bold text-white tracking-wider">
              PUBLISHING STUDIO // ON-THE-GO CMS
            </span>
            {isAuthenticated ? (
              <span className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald font-bold">
                OPERATOR AUTHENTICATED
              </span>
            ) : (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold">
                SECURITY GATE
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                title="Lock Studio & End Session"
                className="text-[11px] text-cyber-muted hover:text-white px-2 py-0.5 rounded border border-cyber-border hover:border-red-400/50 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-3 h-3 text-red-400" />
                <span className="hidden sm:inline">LOCK</span>
              </button>
            )}

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
        </div>

        {/* ============================================================== */}
        {/* CASE 1: NOT AUTHENTICATED -> PASSWORD CHALLENGE SCREEN        */}
        {/* ============================================================== */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 my-auto">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-cyber-panel border-2 border-cyber-cyan/60 flex items-center justify-center shadow-glow-cyan animate-pulse">
                <Shield className="w-8 h-8 text-cyber-cyan" />
              </div>
              <Lock className="w-5 h-5 text-cyber-emerald absolute -bottom-1 -right-1 bg-cyber-bg rounded-full p-0.5 border border-cyber-border" />
            </div>

            <div className="space-y-2 max-w-md">
              <div className="text-xs text-cyber-cyan font-bold tracking-widest uppercase">
                SECURITY VERIFICATION REQUIRED
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Stefan Bakurdzhiev Dispatch Studio
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This publishing console commits directly to production. Enter your operator access key to unlock post authoring, editing, and publishing controls.
              </p>
            </div>

            <form onSubmit={handleVerifyPassword} className="w-full max-w-sm space-y-4">
              <div className="relative">
                <input
                  type={showAuthPassword ? 'text' : 'password'}
                  placeholder={lockoutRemaining > 0 ? `Locked for ${lockoutRemaining}s...` : "Enter Operator Security Key..."}
                  value={authPassword}
                  disabled={lockoutRemaining > 0}
                  autoComplete="current-password"
                  onChange={(e) => {
                    setAuthPassword(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  autoFocus
                  className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none pr-10 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowAuthPassword(!showAuthPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <div className="text-xs text-red-400 flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/30 p-2 rounded text-center leading-relaxed">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={lockoutRemaining > 0}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-emerald text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-glow-cyan cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {lockoutRemaining > 0 ? (
                  <>
                    <Lock className="w-4 h-4 text-black" />
                    <span>LOCKED: COOLDOWN ({lockoutRemaining}s)</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 fill-black" />
                    <span>AUTHENTICATE &amp; UNLOCK STUDIO</span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
                <Shield className="w-3 h-3 text-cyber-cyan" />
                <span>Brute-force protected • Constant-time SHA-256 verification</span>
              </div>
            </form>
          </div>
        ) : (
          /* ============================================================== */
          /* CASE 2: AUTHENTICATED -> FULL PUBLISHING STUDIO & POST MANAGER */
          /* ============================================================== */
          <>
            {/* Sub Tabs Navigation */}
            <div className="flex items-center justify-between px-4 py-2 bg-cyber-surface border-b border-cyber-border text-xs shrink-0 overflow-x-auto no-scrollbar gap-2">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => {
                    sound.playKey();
                    setActiveSubTab('manager');
                    reloadManagerArticles();
                  }}
                  className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeSubTab === 'manager'
                      ? 'bg-cyber-panel text-cyber-cyan border border-cyber-cyan/50 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>ALL POSTS ({managerArticles.length})</span>
                </button>

                <button
                  onClick={() => {
                    sound.playKey();
                    setActiveSubTab('editor');
                  }}
                  className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeSubTab === 'editor'
                      ? 'bg-cyber-panel text-cyber-cyan border border-cyber-cyan/50 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{editingPostId ? 'EDITING POST' : 'DRAFT EDITOR'}</span>
                </button>

                <button
                  onClick={() => {
                    sound.playKey();
                    setActiveSubTab('preview');
                  }}
                  className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeSubTab === 'preview'
                      ? 'bg-cyber-panel text-cyber-cyan border border-cyber-cyan/50 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>PREVIEW</span>
                </button>

                <button
                  onClick={() => {
                    sound.playKey();
                    setActiveSubTab('security');
                  }}
                  className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeSubTab === 'security'
                      ? 'bg-cyber-panel text-cyber-cyan border border-cyber-cyan/50 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>SECURITY</span>
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-[11px] text-cyber-emerald shrink-0">
                {statusMessage && (
                  <span className="text-cyber-cyan font-mono animate-fadeIn hidden md:inline">
                    {statusMessage}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border text-slate-300">
                  {calculatedReadTime()}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">

              {/* -------------------------------------------------------- */}
              {/* SUBTAB 1: POST MANAGER & LIFECYCLE                      */}
              {/* -------------------------------------------------------- */}
              {activeSubTab === 'manager' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyber-border pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyber-cyan" />
                        <span>POST LIFECYCLE MANAGER</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        View, edit, duplicate, and manage all articles and published field logs.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetToNew}
                        className="px-3 py-1.5 rounded bg-gradient-to-r from-cyber-cyan to-cyber-emerald text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-glow-subtle"
                      >
                        <Plus className="w-3.5 h-3.5 fill-black" />
                        <span>NEW DISPATCH</span>
                      </button>
                    </div>
                  </div>

                  {/* Status filter bar */}
                  <div className="flex items-center gap-2 text-xs">
                    {['ALL', 'PUBLISHED', 'DRAFT', 'SCHEDULED'].map(f => (
                      <button
                        key={f}
                        onClick={() => setManagerFilter(f)}
                        className={`px-2.5 py-1 rounded transition-colors ${
                          managerFilter === f
                            ? 'bg-cyber-panel text-cyber-cyan border border-cyber-cyan/50 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  {/* Articles Table */}
                  <div className="space-y-2">
                    {managerArticles
                      .filter(a => {
                        if (managerFilter === 'ALL') return true;
                        if (managerFilter === 'PUBLISHED') return a.status === 'published' || !a.status;
                        if (managerFilter === 'DRAFT') return a.status === 'draft';
                        if (managerFilter === 'SCHEDULED') return a.status === 'scheduled';
                        return true;
                      })
                      .map(article => (
                        <div
                          key={article.id}
                          className="p-3 bg-cyber-bg border border-cyber-border hover:border-cyber-cyan/60 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-colors"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap text-xs">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-panel border border-cyber-cyan/30 text-cyber-cyan font-bold">
                                {article.category}
                              </span>

                              {article.status === 'draft' ? (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                                  DRAFT
                                </span>
                              ) : article.status === 'scheduled' ? (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                                  SCHEDULED: {article.scheduledDate || 'TBD'}
                                </span>
                              ) : (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald font-bold">
                                  PUBLISHED
                                </span>
                              )}

                              <span className="text-[11px] text-slate-400">{article.date}</span>
                            </div>

                            <div className="font-bold text-white text-xs sm:text-sm truncate">
                              {article.title}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {article.summary}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Edit Button */}
                            <button
                              onClick={() => {
                                sound.playKey();
                                loadArticleIntoEditor(article);
                              }}
                              className="px-2.5 py-1 rounded bg-cyber-panel border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              title="Edit in CMS Editor"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>EDIT</span>
                            </button>

                            {/* Duplicate Button */}
                            <button
                              onClick={() => handleDuplicateArticle(article)}
                              className="px-2.5 py-1 rounded bg-cyber-surface border border-cyber-border hover:border-slate-400 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1 cursor-pointer"
                              title="Duplicate as new draft"
                            >
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span className="hidden sm:inline">CLONE</span>
                            </button>

                            {/* Delete Button (Only for custom/localStorage posts) */}
                            {article.isCustom && (
                              deleteConfirmId === article.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDeleteArticle(article.id)}
                                    className="px-2 py-1 rounded bg-red-600 text-white text-[11px] font-bold"
                                  >
                                    CONFIRM
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-1 rounded bg-cyber-surface border border-cyber-border text-slate-400 text-[11px]"
                                  >
                                    CANCEL
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirmId(article.id)}
                                  className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                  title="Delete custom post"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* SUBTAB 2: EDITOR TAB                                    */}
              {/* -------------------------------------------------------- */}
              {activeSubTab === 'editor' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Active Edit Status Banner */}
                  {editingPostId && (
                    <div className="flex items-center justify-between p-2.5 bg-cyber-cyan/10 border border-cyber-cyan/40 rounded-lg text-xs text-cyber-cyan">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-3.5 h-3.5 shrink-0" />
                        <span>Editing Post: <strong>{title || editingPostId}</strong></span>
                      </div>
                      <button
                        onClick={handleResetToNew}
                        className="text-[11px] underline hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Switch to New Post</span>
                      </button>
                    </div>
                  )}

                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1">
                        <FileText className="w-3 h-3 text-cyber-cyan" />
                        <span>Dispatch Title *</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Zero-Downtime OpenShift 4.14 Upgrades in Banking"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded p-2 text-white text-xs placeholder-slate-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 uppercase tracking-wider text-[11px]">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. openshift-zero-downtime"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded p-2 text-cyber-cyan text-xs placeholder-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Category, Status & Scheduled Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-400 uppercase tracking-wider text-[11px]">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded p-2 text-white text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="OpenShift & K8s">OpenShift &amp; K8s</option>
                        <option value="GitOps & CI/CD">GitOps &amp; CI/CD</option>
                        <option value="Security">Security / DevSecOps</option>
                        <option value="Platform Leadership">Platform Leadership</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyber-emerald" />
                        <span>Lifecycle Status</span>
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded p-2 text-cyber-emerald font-bold text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="published">Published (Live Production)</option>
                        <option value="draft">Draft (Work in Progress)</option>
                        <option value="scheduled">Scheduled Release</option>
                      </select>
                    </div>

                    {status === 'scheduled' ? (
                      <div className="space-y-1 animate-fadeIn">
                        <label className="text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-cyan-400" />
                          <span>Release Date</span>
                        </label>
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full bg-cyber-bg border border-cyan-500/60 rounded p-2 text-white text-xs focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1">
                          <Tag className="w-3 h-3 text-cyber-cyan" />
                          <span>Tags (Comma-separated)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="OpenShift, Kubernetes, ArgoCD"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded p-2 text-white text-xs placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-400 uppercase tracking-wider text-[11px]">
                      Tactical Summary (Used for card excerpt &amp; SEO description)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Battlefield-tested playbook for sequencing MachineConfigPool pauses..."
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan rounded p-2 text-white text-xs placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Snippet Toolbar */}
                  <div className="flex items-center gap-1 flex-wrap text-[11px] bg-cyber-bg/80 p-2 rounded border border-cyber-border">
                    <span className="text-slate-500 text-[10px] font-bold uppercase mr-1">SNIPPETS:</span>
                    <button
                      type="button"
                      onClick={() => insertSnippet('### Heading Title')}
                      className="px-2 py-0.5 rounded bg-cyber-surface hover:bg-cyber-panel text-cyber-cyan border border-cyber-border/70 cursor-pointer"
                    >
                      # H3
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('```bash\n# command example\noc get nodes\n```')}
                      className="px-2 py-0.5 rounded bg-cyber-surface hover:bg-cyber-panel text-cyber-emerald border border-cyber-border/70 cursor-pointer"
                    >
                      &lt;/&gt; Code
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('> [!NOTE]\n> Operational context note.')}
                      className="px-2 py-0.5 rounded bg-cyber-surface hover:bg-cyber-panel text-cyber-cyan border border-cyber-border/70 cursor-pointer"
                    >
                      [!NOTE]
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('> [!TIP]\n> Battlefield-tested pro-tip.')}
                      className="px-2 py-0.5 rounded bg-cyber-surface hover:bg-cyber-panel text-emerald-300 border border-cyber-border/70 cursor-pointer"
                    >
                      [!TIP]
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('> [!WARNING]\n> Production risk warning.')}
                      className="px-2 py-0.5 rounded bg-cyber-surface hover:bg-cyber-panel text-amber-300 border border-cyber-border/70 cursor-pointer"
                    >
                      [!WARNING]
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('> [!IMPORTANT]\n> Mandatory SLA requirement.')}
                      className="px-2 py-0.5 rounded bg-cyber-surface hover:bg-cyber-panel text-purple-300 border border-cyber-border/70 cursor-pointer"
                    >
                      [!IMPORTANT]
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('| Component | Status | SLA |\n| :--- | :--- | :--- |\n| Etcd | Nominal | 99.99% |')}
                      className="px-2 py-0.5 rounded bg-cyber-surface hover:bg-cyber-panel text-slate-300 border border-cyber-border/70 cursor-pointer"
                    >
                      ▦ Table
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('1. Step item\n2. Next step item')}
                      className="px-2 py-0.5 rounded bg-cyber-surface hover:bg-cyber-panel text-slate-300 border border-cyber-border/70 cursor-pointer"
                    >
                      1. List
                    </button>
                  </div>

                  {/* Markdown Content Textarea */}
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-400 uppercase tracking-wider text-[11px] flex items-center justify-between">
                      <span>Article Markdown Body *</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Words: {(content + summary).trim().split(/\s+/).filter(Boolean).length}
                      </span>
                    </label>
                    <textarea
                      rows={12}
                      placeholder="Write your article in markdown..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full bg-[#02050b] border border-cyber-border focus:border-cyber-cyan rounded p-3 text-white text-xs font-mono placeholder-slate-700 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* SUBTAB 3: PREVIEW TAB                                   */}
              {/* -------------------------------------------------------- */}
              {activeSubTab === 'preview' && (
                <div className="p-4 bg-[#02050b] border border-cyber-border rounded-lg space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-cyber-panel text-cyber-cyan border border-cyber-cyan/30 text-[10px] font-bold">
                      {category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30 text-[10px] font-bold">
                      STATUS: {status.toUpperCase()}
                    </span>
                    <span className="text-slate-400 text-[11px]">{calculatedReadTime()}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {title || 'Untitled Field Log'}
                  </h2>

                  {summary && (
                    <div className="p-3 rounded bg-cyber-bg border-l-4 border-cyber-cyan text-xs text-slate-300 leading-relaxed">
                      {summary}
                    </div>
                  )}

                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono pt-2 border-t border-cyber-border/60">
                    {content}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* SUBTAB 4: SECURITY TAB                                  */}
              {/* -------------------------------------------------------- */}
              {activeSubTab === 'security' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Master Password Change */}
                  <div className="bg-cyber-bg p-4 sm:p-5 border border-cyber-border rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                      <Key className="w-4 h-4 text-cyber-cyan" />
                      <span>Update Operator Security Access Key</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This key is hashed using SHA-256 and stored securely in your browser to restrict publishing access to you.
                    </p>

                    <form onSubmit={handleChangePassword} className="flex flex-col sm:flex-row gap-2 max-w-md">
                      <input
                        type="password"
                        placeholder="Enter new master passphrase..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="flex-1 bg-cyber-surface border border-cyber-border rounded p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded bg-cyber-panel border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan hover:text-black font-bold text-xs transition-colors cursor-pointer"
                      >
                        SAVE NEW KEY
                      </button>
                    </form>

                    {passwordChangeSuccess && (
                      <div className="text-xs text-cyber-emerald flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Master key successfully updated and hashed.</span>
                      </div>
                    )}
                  </div>

                  {/* GitHub Personal Access Token */}
                  <div className="bg-cyber-bg p-4 sm:p-5 border border-cyber-border rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                      <Terminal className="w-4 h-4 text-cyber-emerald" />
                      <span>Direct GitHub API Publisher (For Phone Commits)</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Store your fine-grained GitHub Personal Access Token (`github_pat_...` scoped to this repository only, with `Contents: Read and write`; kept for this browser session only) to push new `.md` field log commits straight from mobile browsers to `sbakurdzhiev/portfolio`.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 max-w-lg">
                      <input
                        type="password"
                        placeholder="github_pat_xxxxxxxxxxxxxxxxxxxx"
                        value={githubToken}
                        onChange={(e) => {
                          setGithubToken(e.target.value);
                          sessionStorage.setItem(STORAGE_KEY_GITHUB_TOKEN, e.target.value);
                        }}
                        className="flex-1 bg-cyber-surface border border-cyber-border rounded p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          sessionStorage.setItem(STORAGE_KEY_GITHUB_TOKEN, githubToken);
                          setStatusMessage('GitHub Token saved for this browser session only.');
                          sound.playDeploySuccess();
                        }}
                        className="px-4 py-2 rounded bg-cyber-emerald/15 border border-cyber-emerald/50 text-cyber-emerald hover:bg-cyber-emerald hover:text-black font-bold text-xs transition-colors cursor-pointer"
                      >
                        SAVE TOKEN
                      </button>
                    </div>
                  </div>

                  {/* Emergency Secret Purge */}
                  <div className="bg-cyber-bg p-4 sm:p-5 border border-red-500/40 rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <span>Emergency Purge Stored Credentials &amp; Sessions</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Immediately revokes and purges saved GitHub access tokens, custom password hashes, and active sessions from this device.
                    </p>
                    <button
                      type="button"
                      onClick={handlePurgeAllSecrets}
                      className="px-3.5 py-1.5 rounded bg-red-500/15 border border-red-500/60 text-red-300 hover:bg-red-500 hover:text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      PURGE ALL STORED SECRETS
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-3 sm:p-4 bg-cyber-bg border-t border-cyber-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="px-3 py-1.5 rounded bg-cyber-surface border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Copy formatted markdown with frontmatter"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-cyber-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED!' : 'COPY MD'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadMd}
                  className="px-3 py-1.5 rounded bg-cyber-surface border border-cyber-border hover:border-cyber-emerald text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Download .md file directly"
                >
                  <Download className="w-3.5 h-3.5 text-cyber-emerald" />
                  <span>DOWNLOAD .MD</span>
                </button>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Save Draft */}
                <button
                  type="button"
                  onClick={() => handleSaveArticle('draft')}
                  className="px-3 py-2 rounded bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Save as draft without setting live"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>SAVE DRAFT</span>
                </button>

                {/* Publish Live */}
                <button
                  type="button"
                  onClick={() => handleSaveArticle(status === 'scheduled' ? 'scheduled' : 'published')}
                  className="px-4 py-2 rounded bg-gradient-to-r from-cyber-cyan to-cyber-emerald text-black font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan hover:opacity-90 transition-all cursor-pointer"
                  title="Publish immediately to the site"
                >
                  <Upload className="w-3.5 h-3.5 fill-black" />
                  <span>{status === 'scheduled' ? 'SCHEDULE' : 'PUBLISH LIVE'}</span>
                </button>

                {/* Commit to GitHub API (If token present) */}
                {githubToken && (
                  <button
                    type="button"
                    onClick={handleDirectGitHubCommit}
                    disabled={isCommitting}
                    className="px-3 py-2 rounded bg-cyber-panel border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    title="Commit directly to GitHub repo from mobile"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isCommitting ? 'PUSHING...' : 'GITHUB PUSH'}</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
