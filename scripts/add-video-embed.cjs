#!/usr/bin/env node
/**
 * Adds YouTube video embed + VideoObject JSON-LD schema
 * to all video tool pages, image tool pages, and relevant blog posts.
 */
const fs = require('fs');
const path = require('path');

const ROOT   = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const YT_ID  = '5lcSaYcMuq8';
const YT_URL = `https://www.youtube.com/watch?v=${YT_ID}`;
const YT_EMB = `https://www.youtube.com/embed/${YT_ID}`;
const YT_THM = `https://img.youtube.com/vi/${YT_ID}/maxresdefault.jpg`;
const UPLOAD = '2026-03-18';

// ── Page definitions ───────────────────────────────────────────────────────
const PAGES = [
  // ─ VIDEO MODEL PAGES ─
  {
    file: 'veo-prompt-generator/index.html',
    name: 'Veo Prompt Generator Demo — Free AI Video Prompts for Google Veo 2',
    desc: 'Watch how to use the free Veo prompt generator to create optimized prompts for Google Veo and Flow Studio. Real example with camera movement, motion style, and scene description output.',
  },
  {
    file: 'kling-prompt-generator/index.html',
    name: 'Kling AI Prompt Generator Demo — Free Video Prompt Tool',
    desc: 'See how to generate optimized prompts for Kling AI video generator using ImageToPrompt. Free tool demo with real prompt output example.',
  },
  {
    file: 'runway-prompt-generator/index.html',
    name: 'Runway Gen-3 Prompt Generator Demo — Free AI Video Prompt Tool',
    desc: 'Watch how to create cinematic Runway Gen-3 Alpha prompts with ImageToPrompt. Real demo with motion, camera, and style descriptors.',
  },
  {
    file: 'pika-prompt-generator/index.html',
    name: 'Pika Prompt Generator Demo — Free AI Video Prompt Tool',
    desc: 'See how to generate Pika 2.0 video prompts with the free ImageToPrompt tool. Real example with motion effects and camera angles.',
  },
  {
    file: 'luma-prompt-generator/index.html',
    name: 'Luma Dream Machine Prompt Generator Demo — Free AI Video Tool',
    desc: 'Watch how to create optimized Luma Dream Machine prompts using ImageToPrompt. Real demo with photorealistic scene and lighting output.',
  },
  {
    file: 'sora-prompt-generator/index.html',
    name: 'Sora Prompt Generator Demo — Free AI Video Prompt Tool for OpenAI Sora',
    desc: 'See how to generate OpenAI Sora video prompts with ImageToPrompt. Free tool demo with natural language cinematic prompt output.',
  },
  {
    file: 'minimax-prompt-generator/index.html',
    name: 'MiniMax Video Prompt Generator Demo — Free AI Tool',
    desc: 'Watch how to create MiniMax AI video prompts using the free ImageToPrompt generator. Real example with scene, motion, and camera output.',
  },
  {
    file: 'stable-video-prompt-generator/index.html',
    name: 'Stable Video Diffusion Prompt Generator Demo — Free AI Tool',
    desc: 'See how to generate Stable Video Diffusion prompts with ImageToPrompt. Free demo with motion and scene prompt output.',
  },
  {
    file: 'image-to-video-prompt/index.html',
    name: 'Image to Video Prompt Generator Demo — Upload Image, Get AI Video Prompt',
    desc: 'Watch how to convert any image into an optimized video prompt for Veo, Kling, Runway, and more using ImageToPrompt. Free tool demo.',
  },
  {
    file: 'text-to-video-prompt/index.html',
    name: 'Text to Video Prompt Generator Demo — Free AI Tool for All Models',
    desc: 'See how to turn a plain description into an optimized video prompt for any AI video generator using ImageToPrompt. Free demo.',
  },

  // ─ VIDEO BLOG POSTS ─
  {
    file: 'blog/video-prompt-guide-2026/index.html',
    name: 'AI Video Prompt Guide 2026 — Tool Demo for Veo, Kling, Runway & More',
    desc: 'Watch a real demo of the free ImageToPrompt video prompt generator used with examples from the 2026 AI video prompt guide.',
    isBlog: true,
  },
  {
    file: 'blog/veo-vs-kling-vs-runway/index.html',
    name: 'Veo vs Kling vs Runway — AI Video Generator Comparison Tool Demo',
    desc: 'See how ImageToPrompt generates different prompts optimized for Veo, Kling, and Runway Gen-3 side by side. Free tool demo.',
    isBlog: true,
  },

  // ─ IMAGE MODEL PAGES ─
  {
    file: 'midjourney-prompt-generator/index.html',
    name: 'Midjourney Prompt Generator Demo — Free Image to Prompt Tool',
    desc: 'Watch how to generate optimized Midjourney prompts from any image using ImageToPrompt. Free AI tool demo with real V6.1 prompt output.',
  },
  {
    file: 'stable-diffusion-prompt-generator/index.html',
    name: 'Stable Diffusion Prompt Generator Demo — Free Image to Prompt Tool',
    desc: 'See how to create Stable Diffusion prompts with negative prompts using the free ImageToPrompt tool. Real demo with full prompt output.',
  },
  {
    file: 'flux-prompt-generator/index.html',
    name: 'Flux AI Prompt Generator Demo — Free Image to Prompt Tool',
    desc: 'Watch how to generate optimized Flux.1 prompts from any image using ImageToPrompt. Free demo with natural language output.',
  },
  {
    file: 'dall-e-prompt-generator/index.html',
    name: 'DALL-E 3 Prompt Generator Demo — Free Image to Prompt Tool',
    desc: 'See how to create DALL-E 3 prompts from images using ImageToPrompt. Free tool demo with descriptive prompt output.',
  },
  {
    file: 'adobe-firefly-prompt-generator/index.html',
    name: 'Adobe Firefly Prompt Generator Demo — Free Image to Prompt Tool',
    desc: 'Watch how to generate Adobe Firefly prompts from any image using ImageToPrompt. Free demo with style and subject analysis.',
  },
  {
    file: 'leonardo-ai-prompt-generator/index.html',
    name: 'Leonardo AI Prompt Generator Demo — Free Image to Prompt Tool',
    desc: 'See how to create Leonardo AI prompts from images using ImageToPrompt. Free tool demo with detailed style output.',
  },
  {
    file: 'ideogram-prompt-generator/index.html',
    name: 'Ideogram Prompt Generator Demo — Free Image to Prompt Tool',
    desc: 'Watch how to generate Ideogram prompts from any image using ImageToPrompt. Free demo with typography and design prompt output.',
  },
  {
    file: 'text-to-prompt/index.html',
    name: 'Text to Image Prompt Generator Demo — Free AI Prompt Tool',
    desc: 'See how to turn any description into optimized AI image prompts for Midjourney, Flux, DALL-E 3 and more using ImageToPrompt.',
  },

  // ─ IMAGE BLOG POSTS ─
  {
    file: 'blog/midjourney-prompt-guide-2026/index.html',
    name: 'Midjourney Prompt Guide 2026 — Free Generator Tool Demo',
    desc: 'Watch a real demo of the free ImageToPrompt tool generating Midjourney V6.1 prompts from images — as used in this complete 2026 guide.',
    isBlog: true,
  },
  {
    file: 'blog/prompt-engineering-for-ai-art/index.html',
    name: 'AI Art Prompt Engineering — Free Generator Tool Demo',
    desc: 'See how ImageToPrompt automates prompt engineering from any image. Real demo showing how the tool extracts style, lighting, and composition.',
    isBlog: true,
  },
  {
    file: 'blog/convert-image-to-ai-prompt/index.html',
    name: 'Convert Image to AI Prompt — Free Tool Demo',
    desc: 'Watch the free ImageToPrompt tool convert a real image into an AI prompt for Midjourney, Flux, and Stable Diffusion in seconds.',
    isBlog: true,
  },
  {
    file: 'blog/stable-diffusion-vs-midjourney-vs-dalle3/index.html',
    name: 'Stable Diffusion vs Midjourney vs DALL-E 3 — Prompt Generator Demo',
    desc: 'See how ImageToPrompt generates model-specific prompts for Stable Diffusion, Midjourney, and DALL-E 3 from the same source image.',
    isBlog: true,
  },
  {
    file: 'blog/reverse-engineer-ai-art-prompts/index.html',
    name: 'Reverse Engineer AI Art Prompts — Free Tool Demo',
    desc: 'Watch how to reverse-engineer AI art prompts from any image using the free ImageToPrompt tool. Real example with full prompt extraction.',
    isBlog: true,
  },
];

// ── HTML embed block ───────────────────────────────────────────────────────
function embedHTML(title) {
  return `
      <!-- YouTube Demo Video -->
      <div class="video-demo-section" style="margin:2.5rem 0;">
        <h2 style="font-family:'Space Grotesk',sans-serif;font-size:1.25rem;font-weight:700;color:var(--text-primary);margin:0 0 0.5rem;">Watch: How It Works</h2>
        <p style="color:var(--text-muted);font-size:0.9rem;margin:0 0 1.25rem;">See the tool in action — real example with AI-generated prompt output.</p>
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;border:1px solid var(--border-subtle);">
          <iframe
            src="${YT_EMB}"
            title="${title}"
            frameborder="0"
            style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        </div>
      </div>
`;
}

// ── VideoObject JSON-LD block ──────────────────────────────────────────────
function schemaJSON(name, desc) {
  return `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "${name.replace(/"/g, '\\"')}",
    "description": "${desc.replace(/"/g, '\\"')}",
    "thumbnailUrl": "${YT_THM}",
    "uploadDate": "${UPLOAD}",
    "contentUrl": "${YT_URL}",
    "embedUrl": "${YT_EMB}",
    "duration": "PT3M",
    "publisher": {
      "@type": "Organization",
      "name": "ImageToPrompt",
      "logo": { "@type": "ImageObject", "url": "https://www.imagetoprompt.dev/favicon.svg" }
    }
  }
  </script>`;
}

// ── Process each page ──────────────────────────────────────────────────────
let updated = 0;
let skipped = 0;

for (const page of PAGES) {
  const filePath = path.join(PUBLIC, page.file.replace(/\//g, path.sep));
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠ Not found: ${page.file}`);
    skipped++;
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has the embed
  if (content.includes(YT_ID)) {
    console.log(`  ↷ Already has embed: ${page.file}`);
    skipped++;
    continue;
  }

  let changed = false;

  // 1. Add VideoObject schema before </head>
  const schema = schemaJSON(page.name, page.desc);
  content = content.replace('</head>', `${schema}\n</head>`);
  changed = true;

  // 2. Insert embed block
  const embed = embedHTML(page.name);

  if (page.isBlog) {
    // Blog posts: insert before <h2 id="faq"> or before <h2>Frequently Asked Questions</h2>
    if (content.includes('<h2 id="faq">')) {
      content = content.replace('<h2 id="faq">', `${embed}\n      <h2 id="faq">`);
    } else if (content.includes('<!-- FAQs -->')) {
      content = content.replace('<!-- FAQs -->', `${embed}\n      <!-- FAQs -->`);
    } else {
      // Fallback: before </article>
      content = content.replace('</article>', `${embed}\n</article>`);
    }
  } else {
    // Model pages: insert before <!-- FAQs -->
    if (content.includes('<!-- FAQs -->')) {
      content = content.replace('<!-- FAQs -->', `${embed}\n      <!-- FAQs -->`);
    } else if (content.includes('<h2 id="faq">')) {
      content = content.replace('<h2 id="faq">', `${embed}\n      <h2 id="faq">`);
    } else {
      // Fallback: before footer
      content = content.replace('<footer class="footer-4col">', `${embed}\n  <footer class="footer-4col">`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✓ ${page.file}`);
  updated++;
}

console.log(`\n✅ Updated ${updated} pages, skipped ${skipped}`);
