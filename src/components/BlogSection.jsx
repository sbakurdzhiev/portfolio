import React, { useState } from 'react';
import { 
  BookOpen, Calendar, Clock, Tag, Search, ArrowRight, 
  ChevronLeft, Terminal, Shield, Cpu, GitBranch, Users, 
  Share2, Check, ExternalLink, Bookmark
} from 'lucide-react';
import { sound } from '../utils/audio';

const BLOG_ARTICLES = [
  {
    id: 'openshift-zero-downtime-upgrade',
    title: 'Zero-Downtime OpenShift 4.14 In-Place Upgrades in Banking Environments',
    summary: 'A battlefield-tested playbook for sequencing MachineConfigPool pauses, etcd quorum snapshots, and worker node drain automation to maintain 99.99% SLA during major OCP version transitions.',
    category: 'OpenShift & K8s',
    date: '2026-10-18',
    readTime: '7 min read',
    tags: ['OpenShift 4.14', 'Kubernetes', 'Etcd', 'High Availability', 'Banking SLA'],
    icon: Cpu,
    highlights: [
      'MCP (MachineConfigPool) selective node pause strategy',
      'Automated etcd backup snapshot & quorum validation script',
      'Ingress Controller live traffic drain without dropping WebSockets',
      'Post-upgrade cluster operator health verification loops'
    ],
    content: `
### Executive Summary
Upgrading Red Hat OpenShift Container Platform (OCP) across production enterprise clusters hosting financial settlement services allows zero margin for downtime. While the OpenShift Cluster Version Operator (CVO) automates individual operator rollouts, blind execution without manual gate orchestration risks simultaneous worker restarts and brief service degradation.

### Step 1: Pausing Worker MachineConfigPools
Before triggering the payload upgrade via CVO, pause the custom worker MachineConfigPools. This decouples the cluster control plane upgrade from host OS coreOS reboot cycles:

\`\`\`bash
# Pause worker pool to prevent automatic node reboots
oc patch mcp worker --type merge -p '{"spec":{"paused":true}}'
oc patch mcp worker-infra --type merge -p '{"spec":{"paused":true}}'
\`\`\`

### Step 2: Automated Etcd Quorum Verification & Backup
Ensure all three control plane members are synchronized and healthy before starting the upgrade payload:

\`\`\`bash
# Trigger an immediate etcd snapshot on master-01
oc debug node/k8s-master-sofia-01 -- chroot /host /usr/local/bin/cluster-backup.sh /var/home/core/backup/
# Verify quorum endpoint status
oc exec -it -n openshift-etcd etcd-k8s-master-sofia-01 -c etcdctl -- etcdctl endpoint status -w table
\`\`\`

### Step 3: Rolling Canary Node Reboots
Once the master control plane reaches 4.14:
1. Unpause 1 canary worker node pool at a time.
2. Monitor pod eviction and pod disruption budgets (PDBs).
3. Verify synthetic transactions pass before proceeding to subsequent nodes.

\`\`\`bash
# Unpause pool one batch at a time
oc patch mcp worker --type merge -p '{"spec":{"paused":false}}'
oc get mcp -w
\`\`\`

### Key Takeaway
Decoupling control-plane orchestration from worker machine updates combined with strict PDB enforcement is the cornerstone of zero-downtime Kubernetes operations.
    `
  },
  {
    id: 'supply-chain-security-trivy-kyverno-cosign',
    title: 'Hardening Cloud Native Supply Chains: Trivy, Cosign & Kyverno in CI/CD',
    summary: 'Building a zero-trust container delivery pipeline: automated CVE gating, cryptographic image attestation with Sigstore Cosign, and strict Kyverno admission controllers.',
    category: 'Security',
    date: '2026-08-04',
    readTime: '6 min read',
    tags: ['Security', 'Trivy', 'Cosign', 'Kyverno', 'Zero Trust', 'DevSecOps'],
    icon: Shield,
    highlights: [
      'Automated vulnerability scanning with Trivy in GitHub Actions & GitLab CI',
      'Cryptographic keyless signing using Sigstore Cosign & OIDC',
      'Enforcing image signature admission validation via Kyverno ClusterPolicy',
      'Blocking Critical/High CVEs before reaching the internal registry'
    ],
    content: `
### The Challenge
Container registries are vulnerable to image tampering and outdated base image dependencies. Simply scanning images at build time is insufficient if unsigned images can still be deployed to the Kubernetes cluster.

### 1. Build & Scan with Trivy
We configure Trivy to fail pipelines on CRITICAL CVEs with existing vendor fixes:

\`\`\`yaml
- name: Scan Image with Trivy
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'sbakurdzhiev/portfolio:\${{ github.sha }}'
    format: 'table'
    exit-code: '1'
    ignore-unfixed: true
    vuln-type: 'os,library'
    severity: 'CRITICAL,HIGH'
\`\`\`

### 2. Sign with Sigstore Cosign
Immediately after successful scanning and container registry push, we cryptographically sign the container digest:

\`\`\`bash
# Keyless signing via GitHub Actions OIDC token
cosign sign --yes \${CONTAINER_IMAGE}@\${IMAGE_DIGEST}
\`\`\`

### 3. Kyverno In-Cluster Verification Policy
Kyverno validates the signature before admitting any pod into production namespaces:

\`\`\`yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: check-image-signatures
spec:
  validationFailureAction: Enforce
  rules:
  - name: verify-signature
    match:
      any:
      - resources:
          kinds:
          - Pod
    verifyImages:
    - imageReferences:
      - "sbakurdzhiev/*"
      attestors:
      - entries:
        - keyless:
            issuer: "https://token.actions.githubusercontent.com"
            subject: "https://github.com/sbakurdzhiev/*"
\`\`\`
    `
  },
  {
    id: 'gitops-at-scale-argocd-applicationsets',
    title: 'Multi-Cluster GitOps at Scale with ArgoCD ApplicationSets',
    summary: 'Architecting high-scale GitOps repositories, dynamic cluster generators, sync waves, and self-healing configurations across multi-region hybrid OpenShift and vanilla Kubernetes.',
    category: 'GitOps & CI/CD',
    date: '2026-05-22',
    readTime: '8 min read',
    tags: ['ArgoCD', 'GitOps', 'ApplicationSet', 'Helm', 'Multi-Cluster'],
    icon: GitBranch,
    highlights: [
      'Repository layout: App of Apps vs ApplicationSet Matrix Generator',
      'Sync Waves and hooks for graceful database migrations & secret provisioning',
      'Automated cluster onboarding via label selectors and Vault integration',
      'Eliminating GitOps configuration drift with self-healing reconciliation'
    ],
    content: `
### Why ApplicationSets Replaced App-of-Apps
When managing dozens of Kubernetes clusters across staging, DR, and production environments, defining individual \`Application\` manifests creates repetitive boilerplate. ArgoCD ApplicationSets introduce generators that dynamically instantiate applications based on Git repository directories or cluster labels.

### Matrix Generator Configuration
Combine cluster discovery with Git directory scanning:

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: infrastructure-services
  namespace: argocd
spec:
  generators:
  - matrix:
      generators:
      - clusters:
          selector:
            matchLabels:
              environment: production
      - git:
          repoURL: https://github.com/sbakurdzhiev/gitops-manifests.git
          revision: main
          directories:
          - path: "infrastructure/*"
  template:
    metadata:
      name: "{{path.basename}}-{{name}}"
    spec:
      project: default
      source:
        repoURL: https://github.com/sbakurdzhiev/gitops-manifests.git
        targetRevision: main
        path: "{{path}}"
      destination:
        server: "{{server}}"
        namespace: "{{path.basename}}"
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
\`\`\`

### Sync Wave Sequencing
Avoid race conditions by ordering deployments with annotations:
- Wave \`-1\`: CustomResourceDefinitions & Namespaces
- Wave \`0\`: Secrets, ConfigMaps, and Operator subscriptions
- Wave \`1\`: Database migrations (Kubernetes Jobs with pre-sync hooks)
- Wave \`2\`: Application Workloads & Deployments
- Wave \`3\`: Ingress routes and Route monitors
    `
  },
  {
    id: 'leading-8-engineers-platform-engineering',
    title: 'From Ticket Hell to Platform Engineering: Leading 8 DevOps Engineers',
    summary: 'A transparent leadership reflection from DXC Bulgaria on transforming a reactive operations team into a high-impact platform engineering unit with self-service golden paths.',
    category: 'Platform Leadership',
    date: '2026-03-10',
    readTime: '5 min read',
    tags: ['Leadership', 'DXC Bulgaria', 'Team Lead', 'Platform Engineering', 'Culture'],
    icon: Users,
    highlights: [
      'Eliminating 70% of Jira ticket requests through Terraform & Crossplane self-service',
      'Establishing "Golden Paths" for microservice bootstrapping in minutes',
      'Psychological safety, blameless post-mortems, and engineering on-call rotation',
      'Measuring platform velocity: DORA metrics (Deployment Frequency & Lead Time)'
    ],
    content: `
### The Initial State: The Operations Bottleneck
When I stepped into the Team Lead role managing 8 DevOps and platform engineers, our squad was buried under a deluge of 80+ weekly manual requests: "Create this namespace", "Add this DNS record", "Fix this CI/CD YAML". Our talented engineers were functioning as human API routers rather than platform builders.

### Strategy 1: The "Everything as Code" Mandate
We established an ironclad rule: If a task has to be performed twice, it must be codified into a reusable Terraform module, Helm chart, or automated Ansible role. 

### Strategy 2: Self-Service Developer Golden Paths
We created an automated repository template containing:
1. Standardized Dockerfile with rootless security contexts
2. Pre-baked Helm chart with liveness/readiness probes and autoscaling
3. Pre-configured GitHub Actions / GitLab pipeline with Trivy security gates
4. Automatic registration in ArgoCD via label tagging

**Result**: Time to provision a new microservice dropped from **3 weeks** across 4 teams to **under 15 minutes** self-service.

### Strategy 3: Cultivating Blameless Culture & Psychological Safety
High reliability comes from transparent incident post-mortems. When a cluster configuration mistake happened, we focused on systemic safeguards:
- "Why did the admission controller allow this invalid manifest?"
- "How can we add a pre-commit lint check so this is caught locally?"

Leading engineers is not about micromanaging pull requests — it is about removing friction, building consensus, and empowering every engineer to own platform excellence.
    `
  }
];

export const BlogSection = () => {
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = ['ALL', 'OpenShift & K8s', 'GitOps & CI/CD', 'Security', 'Platform Leadership'];

  const filteredArticles = BLOG_ARTICLES.filter(article => {
    const matchesCategory = selectedCategory === 'ALL' || article.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const selectedArticle = BLOG_ARTICLES.find(a => a.id === selectedArticleId);

  const handleOpenArticle = (id) => {
    sound.playBeep(650, 0.05);
    setSelectedArticleId(id);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleBack = () => {
    sound.playBeep(450, 0.04);
    setSelectedArticleId(null);
  };

  const handleCopyLink = () => {
    sound.playBeep(700, 0.04);
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Section Header */}
      <div className="border border-cyber-border bg-cyber-surface rounded-lg p-5 sm:p-6 relative overflow-hidden corner-bracket">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyber-cyan text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-cyber-cyan" />
              <span>TACTICAL FIELD LOGS // ARCHITECTURE JOURNAL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              DevOps, Kubernetes & Platform Engineering Insights
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Production playbooks, post-mortems, and architectural blueprints written from real-world operations in enterprise banking, OpenShift clustering, and platform team leadership.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-cyber-bg p-2 rounded border border-cyber-border text-xs">
            <span className="text-slate-400">STATUS:</span>
            <span className="text-cyber-emerald font-bold">4 PUBLISHED DISPATCHES</span>
          </div>
        </div>
      </div>

      {/* SINGLE ARTICLE READER VIEW */}
      {selectedArticle ? (
        <div className="space-y-4">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between bg-cyber-surface border border-cyber-border p-3 rounded-lg text-xs">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-cyber-cyan hover:text-white px-2.5 py-1 rounded bg-cyber-bg border border-cyber-border hover:border-cyber-cyan transition-colors cursor-pointer font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>RETURN TO DISPATCH LIST</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 hidden sm:inline">{selectedArticle.readTime}</span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyber-bg border border-cyber-border hover:border-cyber-cyan text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
                title="Copy share link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-cyber-emerald" /> : <Share2 className="w-3.5 h-3.5 text-cyber-cyan" />}
                <span>{copiedLink ? 'COPIED' : 'SHARE'}</span>
              </button>
            </div>
          </div>

          {/* Article Container */}
          <article className="border border-cyber-border bg-cyber-surface rounded-lg p-6 sm:p-8 space-y-6">
            {/* Meta header */}
            <div className="space-y-3 border-b border-cyber-border pb-5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-cyber-cyan/15 border border-cyber-cyan/50 text-cyber-cyan font-bold">
                  {selectedArticle.category}
                </span>
                <span className="text-cyber-border">•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {selectedArticle.date}
                </span>
                <span className="text-cyber-border">•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {selectedArticle.readTime}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {selectedArticle.title}
              </h1>

              <p className="text-sm text-slate-300 italic border-l-2 border-cyber-cyan pl-3 bg-cyber-bg/40 py-1.5 rounded-r">
                "{selectedArticle.summary}"
              </p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {selectedArticle.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border text-slate-400"
                  >
                    <Tag className="w-3 h-3 text-cyber-emerald" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Technical Highlights Checklist */}
            <div className="bg-cyber-bg border border-cyber-border rounded-lg p-4 space-y-2">
              <div className="text-xs font-bold text-cyber-emerald flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyber-emerald" />
                <span>ARCHITECTURAL HIGHLIGHTS & OPERATIONAL CHECKPOINTS</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                {selectedArticle.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyber-cyan font-bold">▶</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Markdown Body Content */}
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-4 pt-2">
              {selectedArticle.content.split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-base sm:text-lg font-bold text-white pt-3 pb-1 border-b border-cyber-border/60 flex items-center gap-2">
                      <span className="text-cyber-cyan font-mono">#</span>
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }

                if (trimmed.startsWith('```')) {
                  const lines = trimmed.split('\n');
                  const codeLang = lines[0].replace('```', '') || 'bash';
                  const codeBody = lines.slice(1, -1).join('\n');
                  return (
                    <div key={idx} className="my-3 rounded-lg overflow-hidden border border-cyber-border bg-[#02050b]">
                      <div className="flex items-center justify-between px-3 py-1 bg-cyber-panel border-b border-cyber-border text-[10px] text-cyber-muted">
                        <span className="font-bold text-cyber-cyan">{codeLang.toUpperCase()}</span>
                        <span>TERMINAL BUFFER</span>
                      </div>
                      <pre className="p-3 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                        {codeBody}
                      </pre>
                    </div>
                  );
                }

                if (trimmed.startsWith('1. ') || trimmed.startsWith('- ')) {
                  return (
                    <div key={idx} className="bg-cyber-bg/50 p-3 rounded border border-cyber-border/50 text-xs sm:text-sm space-y-1">
                      {trimmed.split('\n').map((line, lIdx) => (
                        <div key={lIdx} className="flex items-start gap-2">
                          <span className="text-cyber-cyan font-bold">▫</span>
                          <span>{line.replace(/^[0-9]\. |- /, '')}</span>
                        </div>
                      ))}
                    </div>
                  );
                }

                return (
                  <p key={idx} className="text-slate-300 leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Article Footer & Author Signature */}
            <div className="border-t border-cyber-border pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-cyber-muted">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-cyber-panel border border-cyber-cyan/50 flex items-center justify-center font-bold text-cyber-cyan">
                  SB
                </div>
                <div>
                  <div className="font-bold text-white">Stefan Bakurdzhiev</div>
                  <div className="text-[11px]">Senior DevOps & Platform Engineer • DXC Bulgaria</div>
                </div>
              </div>

              <button
                onClick={handleBack}
                className="px-4 py-2 rounded bg-cyber-panel border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan hover:text-black font-bold transition-all cursor-pointer"
              >
                ← BACK TO ALL ARTICLES
              </button>
            </div>
          </article>
        </div>
      ) : (
        /* ARTICLES DIRECTORY VIEW */
        <div className="space-y-6">
          {/* Filter Ribbon & Search Bar */}
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

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search logs & topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cyber-bg border border-cyber-border rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan"
              />
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => {
              const Icon = article.icon;
              return (
                <div
                  key={article.id}
                  onClick={() => handleOpenArticle(article.id)}
                  className="bg-cyber-surface border border-cyber-border hover:border-cyber-cyan/70 rounded-lg p-5 flex flex-col justify-between transition-all duration-200 group cursor-pointer hover:shadow-glow-subtle relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Header meta */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-cyber-panel border border-cyber-cyan/30 text-cyber-cyan text-[10px] font-bold">
                        {article.category}
                      </span>
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

                  {/* Footer Tags & Read Trigger */}
                  <div className="pt-4 mt-2 border-t border-cyber-border/60 flex items-center justify-between text-xs">
                    <div className="flex flex-wrap items-center gap-1 max-w-[70%]">
                      {article.tags.slice(0, 2).map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] text-slate-400 bg-cyber-bg px-1.5 py-0.5 rounded border border-cyber-border">
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 2 && (
                        <span className="text-[10px] text-slate-500">+{article.tags.length - 2}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-cyber-cyan text-xs font-bold group-hover:translate-x-1 transition-transform">
                      <span>READ LOG</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredArticles.length === 0 && (
            <div className="bg-cyber-surface border border-cyber-border rounded-lg p-8 text-center text-xs text-cyber-muted space-y-2">
              <Terminal className="w-6 h-6 mx-auto text-slate-500" />
              <div className="text-white font-bold">NO DISPATCHES MATCH YOUR FILTER</div>
              <p>Try resetting the category filter or searching for another keyword.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
