/**
 * generate-sitemap.js
 *
 * Runs automatically after `npm run build` (postbuild hook).
 * Scans dist/blog/ for any subdirectory containing index.html,
 * builds the URL list, and writes sitemap.xml + robots.txt to
 * both dist/ (served in production) and public/ (source for next build).
 *
 * Adding a new blog post is automatic: just drop a new folder under
 * public/blog/ and it will appear in the next build's sitemap.
 */

import { readdirSync, existsSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

const SITE_URL = 'https://www.imagetoprompt.dev';
const TODAY = new Date().toISOString().split('T')[0];

// ── Static pages ────────────────────────────────────────────────────────────
const STATIC_PAGES = [
  { path: '/',      changefreq: 'daily',   priority: '1.0' },
  { path: '/midjourney-prompt-generator/',          changefreq: 'weekly', priority: '0.9' },
  { path: '/stable-diffusion-prompt-generator/',    changefreq: 'weekly', priority: '0.9' },
  { path: '/flux-prompt-generator/',                changefreq: 'weekly', priority: '0.9' },
  { path: '/dall-e-prompt-generator/',              changefreq: 'weekly', priority: '0.9' },
  { path: '/adobe-firefly-prompt-generator/',       changefreq: 'weekly', priority: '0.9' },
  { path: '/leonardo-ai-prompt-generator/',         changefreq: 'weekly', priority: '0.9' },
  { path: '/ideogram-prompt-generator/',            changefreq: 'weekly', priority: '0.9' },
  { path: '/blog/', changefreq: 'weekly',  priority: '0.8' },
];

// ── Auto-discover blog posts ─────────────────────────────────────────────────
// Scans dist/blog/ so new posts are picked up without editing this file.
function discoverBlogPosts() {
  const blogDir = join(process.cwd(), 'dist', 'blog');
  if (!existsSync(blogDir)) {
    console.warn('⚠  dist/blog/ not found — skipping blog post discovery');
    return [];
  }
  return readdirSync(blogDir)
    .filter(entry => {
      const entryPath = join(blogDir, entry);
      return (
        statSync(entryPath).isDirectory() &&
        existsSync(join(entryPath, 'index.html'))
      );
    })
    .sort()
    .map(slug => ({
      path: `/blog/${slug}/`,
      changefreq: 'monthly',
      priority: '0.8',
    }));
}

// ── Build sitemap XML ────────────────────────────────────────────────────────
function buildSitemap(pages) {
  const urls = pages
    .map(
      p => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

// ── Build robots.txt ─────────────────────────────────────────────────────────
function buildRobots() {
  return `User-agent: *
Allow: /
Disallow: /api/

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

// ── Write files ──────────────────────────────────────────────────────────────
const blogPosts  = discoverBlogPosts();
const allPages   = [...STATIC_PAGES, ...blogPosts];
const sitemapXml = buildSitemap(allPages);
const robotsTxt  = buildRobots();

// dist/ → served in production by Vercel
writeFileSync(join(process.cwd(), 'dist', 'sitemap.xml'), sitemapXml);
writeFileSync(join(process.cwd(), 'dist', 'robots.txt'),  robotsTxt);

// public/ → source of truth, copied into dist/ on next build
writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), sitemapXml);
writeFileSync(join(process.cwd(), 'public', 'robots.txt'),  robotsTxt);

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n✓ sitemap.xml written — ${allPages.length} URLs:`);
allPages.forEach(p => console.log(`  ${SITE_URL}${p.path}`));
console.log('\n✓ robots.txt written');
