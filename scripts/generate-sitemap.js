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
  { path: '/text-to-prompt/',                        changefreq: 'weekly', priority: '0.9' },
  { path: '/image-to-video-prompt/',                changefreq: 'weekly', priority: '0.9' },
  { path: '/text-to-video-prompt/',                 changefreq: 'weekly', priority: '0.9' },
  { path: '/veo-prompt-generator/',                 changefreq: 'weekly', priority: '0.8' },
  { path: '/kling-prompt-generator/',               changefreq: 'weekly', priority: '0.8' },
  { path: '/runway-prompt-generator/',              changefreq: 'weekly', priority: '0.8' },
  { path: '/pika-prompt-generator/',                changefreq: 'weekly', priority: '0.8' },
  { path: '/luma-prompt-generator/',                changefreq: 'weekly', priority: '0.8' },
  { path: '/sora-prompt-generator/',                changefreq: 'weekly', priority: '0.8' },
  { path: '/minimax-prompt-generator/',             changefreq: 'weekly', priority: '0.8' },
  { path: '/stable-video-prompt-generator/',        changefreq: 'weekly', priority: '0.8' },
  { path: '/midjourney-prompt-generator/',          changefreq: 'weekly', priority: '0.9' },
  { path: '/stable-diffusion-prompt-generator/',    changefreq: 'weekly', priority: '0.9' },
  { path: '/flux-prompt-generator/',                changefreq: 'weekly', priority: '0.9' },
  { path: '/dall-e-prompt-generator/',              changefreq: 'weekly', priority: '0.9' },
  { path: '/adobe-firefly-prompt-generator/',       changefreq: 'weekly', priority: '0.9' },
  { path: '/leonardo-ai-prompt-generator/',         changefreq: 'weekly', priority: '0.9' },
  { path: '/ideogram-prompt-generator/',            changefreq: 'weekly', priority: '0.9' },
  { path: '/blog/', changefreq: 'weekly',  priority: '0.8' },
  // VS comparison pages
  { path: '/imagetoprompt-vs-prompthero/',        changefreq: 'monthly', priority: '0.7' },
  { path: '/imagetoprompt-vs-lexica/',            changefreq: 'monthly', priority: '0.7' },
  { path: '/imagetoprompt-vs-img2prompt/',        changefreq: 'monthly', priority: '0.7' },
  { path: '/imagetoprompt-vs-clip-interrogator/', changefreq: 'monthly', priority: '0.7' },
  { path: '/imagetoprompt-vs-dalle3/',            changefreq: 'monthly', priority: '0.7' },
  // International pages
  { path: '/ja/', changefreq: 'monthly', priority: '0.8' },
  { path: '/es/', changefreq: 'monthly', priority: '0.8' },
  { path: '/ko/', changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/', changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/', changefreq: 'monthly', priority: '0.8' },
  // French blog posts
  { path: '/fr/blog/convertir-image-en-prompt-ia/', changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/guide-prompts-midjourney-2026/', changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/stable-diffusion-vs-midjourney-vs-dalle3/', changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/reverse-engineering-prompts-ia/', changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/prompt-engineering-art-ia-debutants/', changefreq: 'monthly', priority: '0.7' },
  // French model/tool pages
  { path: '/fr/text-to-prompt/',                        changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/image-to-video-prompt/',                 changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/text-to-video-prompt/',                  changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/midjourney-prompt-generator/',           changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/stable-diffusion-prompt-generator/',     changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/flux-prompt-generator/',                 changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/dall-e-prompt-generator/',               changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/adobe-firefly-prompt-generator/',        changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/leonardo-ai-prompt-generator/',          changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/ideogram-prompt-generator/',             changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/veo-prompt-generator/',                  changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/kling-prompt-generator/',                changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/runway-prompt-generator/',               changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/pika-prompt-generator/',                 changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/luma-prompt-generator/',                 changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/sora-prompt-generator/',                 changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/minimax-prompt-generator/',              changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/stable-video-prompt-generator/',         changefreq: 'monthly', priority: '0.8' },
  // Arabic model/tool pages
  { path: '/ar/text-to-prompt/',                        changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/image-to-video-prompt/',                 changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/text-to-video-prompt/',                  changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/midjourney-prompt-generator/',           changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/stable-diffusion-prompt-generator/',     changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/flux-prompt-generator/',                 changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/dall-e-prompt-generator/',               changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/adobe-firefly-prompt-generator/',        changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/leonardo-ai-prompt-generator/',          changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/ideogram-prompt-generator/',             changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/veo-prompt-generator/',                  changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/kling-prompt-generator/',                changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/runway-prompt-generator/',               changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/pika-prompt-generator/',                 changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/luma-prompt-generator/',                 changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/sora-prompt-generator/',                 changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/minimax-prompt-generator/',              changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/stable-video-prompt-generator/',         changefreq: 'monthly', priority: '0.8' },
  // Arabic blog posts
  { path: '/ar/blog/tahwil-soura-ila-prompt/', changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/dalil-prompts-midjourney-2026/', changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/stable-diffusion-vs-midjourney-vs-dalle3/', changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/handasa-prompts-fan-ia/', changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/iada-handasa-prompts-souar-ia/', changefreq: 'monthly', priority: '0.7' },
  // Web Stories
  { path: '/stories/image-to-prompt-how-it-works/', changefreq: 'monthly', priority: '0.6' },
  { path: '/stories/midjourney-prompt-tips/',        changefreq: 'monthly', priority: '0.6' },
  { path: '/stories/same-image-4-models/',           changefreq: 'monthly', priority: '0.6' },
  // Company pages
  { path: '/about/',   changefreq: 'monthly', priority: '0.7' },
  { path: '/pricing/', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact/', changefreq: 'monthly', priority: '0.6' },
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
Disallow: /og-image.png

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
Sitemap: ${SITE_URL}/image-sitemap.xml
Sitemap: ${SITE_URL}/video-sitemap.xml
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
