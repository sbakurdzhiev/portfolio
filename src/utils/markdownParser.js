/**
 * Frontmatter parser and File-Based Markdown Loader for Portfolio Technical Field Logs
 * Uses Vite's import.meta.glob to load all markdown posts dynamically from /src/content/posts/
 */

const STORAGE_CUSTOM_POSTS = 'portfolio-custom-posts';

/**
 * Parse YAML-style frontmatter from a raw markdown string without heavy external dependencies
 */
export function parseMarkdownWithFrontmatter(rawMarkdown, fallbackId = '') {
  if (!rawMarkdown || typeof rawMarkdown !== 'string') {
    return {
      id: fallbackId || `post-${Date.now()}`,
      title: 'Untitled Dispatch',
      slug: fallbackId || 'untitled',
      date: new Date().toISOString().split('T')[0],
      category: 'OpenShift & K8s',
      readTime: '5 min read',
      status: 'published',
      tags: ['DevOps'],
      highlights: [],
      summary: '',
      content: ''
    };
  }

  const lines = rawMarkdown.replace(/\r\n/g, '\n').split('\n');
  if (lines[0].trim() !== '---') {
    return {
      id: fallbackId,
      title: fallbackId,
      slug: fallbackId,
      date: new Date().toISOString().split('T')[0],
      category: 'General',
      readTime: '3 min read',
      status: 'published',
      tags: [],
      highlights: [],
      summary: '',
      content: rawMarkdown.trim()
    };
  }

  const meta = {
    id: fallbackId,
    tags: [],
    highlights: [],
    status: 'published'
  };

  let inFrontmatter = true;
  let bodyStartIndex = 1;
  let currentArrayKey = null;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '---') {
      bodyStartIndex = i + 1;
      inFrontmatter = false;
      break;
    }

    if (inFrontmatter) {
      // Check for array item continuation
      const arrayItemMatch = line.match(/^\s*-\s*["']?(.*?)["']?$/);
      if (arrayItemMatch && currentArrayKey) {
        if (!meta[currentArrayKey]) meta[currentArrayKey] = [];
        meta[currentArrayKey].push(arrayItemMatch[1]);
        continue;
      }

      // Check for key: value
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.substring(0, colonIndex).trim();
        const rawValue = line.substring(colonIndex + 1).trim();

        if (rawValue === '') {
          // Multiline array follows
          currentArrayKey = key;
          meta[key] = [];
        } else if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
          // Inline array: [ "item1", "item2" ]
          currentArrayKey = null;
          const items = rawValue
            .slice(1, -1)
            .split(',')
            .map(item => item.trim().replace(/^["']|["']$/g, ''))
            .filter(Boolean);
          meta[key] = items;
        } else {
          currentArrayKey = null;
          // Clean quotes
          meta[key] = rawValue.replace(/^["']|["']$/g, '');
        }
      }
    }
  }

  const content = lines.slice(bodyStartIndex).join('\n').trim();

  // Ensure slug & id are set
  const slug = meta.slug || fallbackId || (meta.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = slug || `post-${Date.now()}`;

  // Estimate read time if missing
  const words = (content + (meta.summary || '')).trim().split(/\s+/).length;
  const estimatedReadTime = meta.readTime || `${Math.max(1, Math.ceil(words / 180))} min read`;

  return {
    id,
    slug,
    title: meta.title || 'Untitled Dispatch',
    date: meta.date || new Date().toISOString().split('T')[0],
    category: meta.category || 'OpenShift & K8s',
    readTime: estimatedReadTime,
    status: meta.status || 'published',
    scheduledDate: meta.scheduledDate || null,
    tags: Array.isArray(meta.tags) && meta.tags.length > 0 ? meta.tags : ['DevOps'],
    highlights: Array.isArray(meta.highlights) ? meta.highlights : [],
    summary: meta.summary || '',
    content,
    isFromFile: true
  };
}

/**
 * Load all static .md files from src/content/posts using Vite's glob import
 */
export function loadStaticMarkdownArticles() {
  const postFiles = import.meta.glob('/src/content/posts/*.md', { query: '?raw', eager: true });
  const articles = [];

  for (const path in postFiles) {
    const rawContent = postFiles[path]?.default || postFiles[path];
    // extract filename without extension (e.g. 2026-10-18-openshift-zero-downtime-upgrade)
    const filename = path.split('/').pop().replace(/\.md$/, '');
    const cleanSlug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const article = parseMarkdownWithFrontmatter(rawContent, cleanSlug);
    articles.push(article);
  }

  return articles;
}

/**
 * Get all merged articles (Static .md files + localStorage custom / edited posts)
 */
export function getAllArticles() {
  const staticArticles = loadStaticMarkdownArticles();
  let customArticles = [];

  try {
    const stored = localStorage.getItem(STORAGE_CUSTOM_POSTS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        customArticles = parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse localStorage custom posts:', err);
  }

  // Merge custom articles over static ones by ID/slug
  const mergedMap = new Map();

  // 1. Put static articles first
  for (const article of staticArticles) {
    mergedMap.set(article.id, article);
  }

  // 2. Put custom articles (overwrites static if same ID, or prepends new ones)
  for (const custom of customArticles) {
    mergedMap.set(custom.id, { ...custom, isCustom: true });
  }

  const allList = Array.from(mergedMap.values());

  // Sort descending by date
  allList.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  return allList;
}

/**
 * Save or update custom article in localStorage
 */
export function saveCustomArticle(article) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_CUSTOM_POSTS) || '[]');
    const filtered = existing.filter(p => p.id !== article.id);
    const updated = [{ ...article, isCustom: true }, ...filtered];
    localStorage.setItem(STORAGE_CUSTOM_POSTS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save article to localStorage', e);
    return null;
  }
}

/**
 * Delete a custom article from localStorage
 */
export function deleteCustomArticle(id) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_CUSTOM_POSTS) || '[]');
    const updated = existing.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_CUSTOM_POSTS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete custom article', e);
    return null;
  }
}

/**
 * Convert an article object into full YAML Frontmatter + Markdown string
 */
export function buildMarkdownPayload(article) {
  const {
    title = 'Untitled Field Log',
    slug = 'untitled-post',
    date = new Date().toISOString().split('T')[0],
    category = 'OpenShift & K8s',
    readTime = '5 min read',
    status = 'published',
    scheduledDate = null,
    tags = ['DevOps'],
    highlights = [],
    summary = 'Technical field log.',
    content = ''
  } = article;

  const tagsArray = Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean);
  const highlightsArray = Array.isArray(highlights) ? highlights : [];

  const frontmatter = [
    '---',
    `title: "${title}"`,
    `slug: "${slug}"`,
    `date: "${date}"`,
    `category: "${category}"`,
    `readTime: "${readTime}"`,
    `status: "${status}"`,
    scheduledDate ? `scheduledDate: "${scheduledDate}"` : null,
    `tags: [${tagsArray.map(t => `"${t}"`).join(', ')}]`,
    `summary: "${summary.replace(/"/g, '\\"')}"`,
    highlightsArray.length > 0 ? 'highlights:' : null,
    ...highlightsArray.map(h => `  - "${h.replace(/"/g, '\\"')}"`),
    '---',
    '',
    content
  ].filter(line => line !== null).join('\n');

  return frontmatter;
}

/**
 * Build Syndication Markdown for Dev.to / Hashnode / Medium with Canonical URL
 */
export function buildSyndicationPayload(article, canonicalBase = 'https://sbakurdzhiev.com') {
  const canonicalUrl = `${canonicalBase}/?tab=blog&post=${encodeURIComponent(article.id || article.slug)}`;
  const tagsArray = Array.isArray(article.tags) ? article.tags.slice(0, 4) : ['devops', 'kubernetes'];

  const frontmatter = [
    '---',
    `title: "${article.title}"`,
    `published: true`,
    `description: "${(article.summary || '').replace(/"/g, '\\"')}"`,
    `tags: [${tagsArray.map(t => t.toLowerCase().replace(/[^a-z0-9]/g, '')).join(', ')}]`,
    `canonical_url: ${canonicalUrl}`,
    '---',
    '',
    `*Originally published at [${canonicalBase}](${canonicalUrl}) on ${article.date} by Stefan Bakurdzhiev.*`,
    '',
    article.content
  ].join('\n');

  return frontmatter;
}
