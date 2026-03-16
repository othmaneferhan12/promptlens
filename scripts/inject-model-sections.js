const fs = require('fs');

const models = [
  {
    file: 'public/midjourney-prompt-generator/index.html',
    modelName: 'Midjourney',
    icon: '🎨',
    color: '#A78BFA',
    beforeImg: '/images/model-comparison-source.jpeg',
    beforeAlt: 'Original image uploaded to ImageToPrompt',
    beforeCaption: 'Original uploaded image',
    afterImg: '/images/compare1-mj.jpeg',
    afterAlt: 'Output generated with Midjourney v6.1',
    afterCaption: 'Generated with Midjourney v6.1',
    prompt: 'a contemplative figure in a dramatic natural landscape, cinematic golden hour lighting, volumetric fog, ultra-detailed, painterly atmosphere --ar 16:9 --v 6.1 --style raw --stylize 500',
    card1: { icon: '⚡', title: 'Model-Specific Syntax', text: 'Every prompt includes Midjourney-native flags — <code>--ar</code>, <code>--v 6.1</code>, <code>--stylize</code> — formatted exactly as the <code>/imagine</code> command expects.' },
    card2: { icon: '🎯', title: 'Optimized Parameters', text: 'Aspect ratio is extracted from your image dimensions. Stylize and chaos values are calibrated from the detected art style and composition complexity.' },
    card3: { icon: '📋', title: 'Ready to Paste', text: 'One click to copy. Paste directly after <code>/imagine</code> in Midjourney\'s Discord bot or at midjourney.com.' },
    posts: [
      { href: '/blog/midjourney-prompt-guide-2026/', img: '/images/mj-version-v6.jpeg', cat: 'Guide', title: 'The Complete Midjourney Prompt Guide for 2026' },
      { href: '/blog/reverse-engineer-ai-art-prompts/', img: '/images/walkthrough-reference.jpeg', cat: 'Tutorial', title: 'How to Reverse-Engineer AI Art Prompts' },
      { href: '/blog/midjourney-vs-flux/', img: '/images/compare1-flux.jpeg', cat: 'Comparison', title: 'Midjourney vs Flux AI: Which Generates Better Prompts?' },
    ],
  },
  {
    file: 'public/stable-diffusion-prompt-generator/index.html',
    modelName: 'Stable Diffusion',
    icon: '⚙️',
    color: '#60A5FA',
    beforeImg: '/images/model-comparison-source.jpeg',
    beforeAlt: 'Original image uploaded to ImageToPrompt',
    beforeCaption: 'Original uploaded image',
    afterImg: '/images/compare1-sd.jpeg',
    afterAlt: 'Output generated with Stable Diffusion XL',
    afterCaption: 'Generated with Stable Diffusion XL',
    prompt: '(masterpiece:1.2), best quality, highly detailed, dramatic natural landscape, cinematic lighting, volumetric fog, ultra-detailed, photorealistic, 8k uhd, DSLR, film grain, Fujifilm XT3, &lt;lora:detail_tweaker:0.8&gt;',
    card1: { icon: '⚡', title: 'Model-Specific Syntax', text: 'Prompts use SD token weighting — <code>(keyword:1.2)</code> — and include <code>&lt;lora:...&gt;</code> blocks and quality tags for AUTOMATIC1111 / ComfyUI.' },
    card2: { icon: '🎯', title: 'Optimized Parameters', text: 'Positive and negative prompts are generated separately. Camera specs, LoRA weights, and CFG-friendly vocabulary are included automatically.' },
    card3: { icon: '📋', title: 'Ready to Paste', text: 'Copy directly into AUTOMATIC1111, ComfyUI, or InvokeAI. Positive and negative prompt blocks are clearly separated for immediate use.' },
    posts: [
      { href: '/blog/stable-diffusion-prompt-guide/', img: '/images/compare1-sd.jpeg', cat: 'Guide', title: 'Stable Diffusion Prompt Guide: Tags, Weights & Negative Prompts' },
      { href: '/blog/negative-prompts-stable-diffusion/', img: '/images/compare2-sd.jpeg', cat: 'Deep Dive', title: 'Negative Prompts in Stable Diffusion: Complete Guide' },
      { href: '/blog/stable-diffusion-vs-midjourney-vs-dalle3/', img: '/images/compare3-sd.jpeg', cat: 'Comparison', title: 'Stable Diffusion vs Midjourney vs DALL·E 3' },
    ],
  },
  {
    file: 'public/flux-prompt-generator/index.html',
    modelName: 'Flux',
    icon: '⚡',
    color: '#FBBF24',
    beforeImg: '/images/model-comparison-source.jpeg',
    beforeAlt: 'Original image uploaded to ImageToPrompt',
    beforeCaption: 'Original uploaded image',
    afterImg: '/images/compare1-flux.jpeg',
    afterAlt: 'Output generated with Flux.1 Dev',
    afterCaption: 'Generated with Flux.1 Dev',
    prompt: 'A person standing in a vast natural landscape at golden hour, long shadows cast across rolling terrain, highly photorealistic, ultra-sharp micro-detail, natural film grain, professional landscape photography, Hasselblad H6D, f/8',
    card1: { icon: '⚡', title: 'Model-Specific Syntax', text: 'Flux uses natural language sentences rather than comma-separated tags. Complete descriptive prose produces sharper, more photorealistic results than keyword lists.' },
    card2: { icon: '🎯', title: 'Optimized Parameters', text: 'Camera body, lens, aperture, ISO, and lighting conditions are included automatically. Flux responds exceptionally well to technical photography vocabulary.' },
    card3: { icon: '📋', title: 'Ready to Paste', text: 'Paste directly into Flux on Replicate, fal.ai, or any ComfyUI Flux node. Works with Flux.1 Dev, Schnell, and Pro variants.' },
    posts: [
      { href: '/blog/flux-ai-prompt-guide/', img: '/images/compare1-flux.jpeg', cat: 'Guide', title: 'Flux AI Prompt Guide: Photorealistic Generation in 2026' },
      { href: '/blog/midjourney-vs-flux/', img: '/images/compare1-mj.jpeg', cat: 'Comparison', title: 'Midjourney vs Flux AI: Which Generates Better Prompts?' },
      { href: '/blog/prompt-engineering-for-ai-art/', img: '/images/pair1-cinematic.jpeg', cat: 'Tutorial', title: 'Prompt Engineering for AI Art: Complete Guide' },
    ],
  },
  {
    file: 'public/dall-e-prompt-generator/index.html',
    modelName: 'DALL·E 3',
    icon: '🧠',
    color: '#FB923C',
    beforeImg: '/images/ex3-original-ai-art.jpeg',
    beforeAlt: 'Original AI art image uploaded to ImageToPrompt',
    beforeCaption: 'Original reference image',
    afterImg: '/images/ex3-recreated.jpeg',
    afterAlt: 'Image recreated using the DALL·E 3 prompt from our tool',
    afterCaption: 'Recreated with DALL·E 3 prompt',
    prompt: 'A retro mid-century modern coastal scene bathed in warm pastel light, stylized geometric shapes and soft gradients, dreamlike nostalgic atmosphere, vintage travel poster aesthetic, bold complementary color blocking, no text or watermarks',
    card1: { icon: '⚡', title: 'Model-Specific Syntax', text: 'DALL·E 3 excels with full descriptive sentences. Prompts are written as natural prose — OpenAI\'s model interprets meaning and context, not keyword lists.' },
    card2: { icon: '🎯', title: 'Optimized Parameters', text: 'Style, mood, color palette, and compositional framing are described explicitly. Safety-conscious language ensures prompts pass content moderation reliably.' },
    card3: { icon: '📋', title: 'Ready to Paste', text: 'Paste into ChatGPT\'s image generator, the OpenAI API, or Bing Image Creator. Works with DALL·E 3 HD mode for maximum detail.' },
    posts: [
      { href: '/blog/dall-e-3-prompt-guide/', img: '/images/compare1-dalle.jpeg', cat: 'Guide', title: 'DALL·E 3 Prompt Guide: Natural Language Prompting' },
      { href: '/blog/convert-image-to-ai-prompt/', img: '/images/ex1-tool-output.jpeg', cat: 'Tutorial', title: 'How to Convert Any Image to an AI Prompt' },
      { href: '/blog/stable-diffusion-vs-midjourney-vs-dalle3/', img: '/images/compare2-dalle.jpeg', cat: 'Comparison', title: 'Stable Diffusion vs Midjourney vs DALL·E 3' },
    ],
  },
  {
    file: 'public/adobe-firefly-prompt-generator/index.html',
    modelName: 'Adobe Firefly',
    icon: '🦋',
    color: '#F87171',
    beforeImg: '/images/ex1-original-photo.jpeg',
    beforeAlt: 'Original photo uploaded to ImageToPrompt',
    beforeCaption: 'Original uploaded photo',
    afterImg: '/images/ex1-recreated.jpeg',
    afterAlt: 'Recreated using Adobe Firefly prompt from our tool',
    afterCaption: 'Recreated with Adobe Firefly prompt',
    prompt: 'Professional studio portrait, soft diffused lighting, clean modern background, sharp focus on subject, commercially safe with no trademarked elements, natural skin tones, high-fidelity photography style, suitable for editorial and advertising use',
    card1: { icon: '⚡', title: 'Model-Specific Syntax', text: 'Firefly prompts emphasize commercial-safe descriptors and avoid copyrighted references. Vocabulary follows Adobe\'s content library for best style adherence.' },
    card2: { icon: '🎯', title: 'Optimized Parameters', text: 'Lighting, mood, and composition use photography terminology calibrated to Firefly\'s strengths. Prompts pass content guidelines for commercial licensing.' },
    card3: { icon: '📋', title: 'Ready to Paste', text: 'Paste into Adobe Firefly at firefly.adobe.com or directly into Photoshop\'s Generative Fill. Works with Firefly Image 3 and above.' },
    posts: [
      { href: '/blog/adobe-firefly-prompt-tips/', img: '/images/pair1-cinematic.jpeg', cat: 'Guide', title: 'Adobe Firefly Prompt Tips: Commercial-Safe AI Art' },
      { href: '/blog/prompt-engineering-for-ai-art/', img: '/images/pair2-golden-hour.jpeg', cat: 'Tutorial', title: 'Prompt Engineering for AI Art: Complete Guide' },
      { href: '/blog/image-to-prompt-product-photography/', img: '/images/mj-product-perfume.jpeg', cat: 'Use Case', title: 'Image to Prompt for Product Photography' },
    ],
  },
  {
    file: 'public/leonardo-ai-prompt-generator/index.html',
    modelName: 'Leonardo AI',
    icon: '🎮',
    color: '#4ADE80',
    beforeImg: '/images/walkthrough-reference.jpeg',
    beforeAlt: 'Original reference image uploaded to ImageToPrompt',
    beforeCaption: 'Original reference image',
    afterImg: '/images/walkthrough-recreated.jpeg',
    afterAlt: 'Fantasy concept art generated with Leonardo AI prompt',
    afterCaption: 'Generated with Leonardo AI Phoenix',
    prompt: 'Epic fantasy warrior in ornate enchanted armor, magical runes glowing with emerald light, dramatic atmospheric backlighting with particle effects, dark mystical forest environment, ultra-detailed concept art, 4k, game-ready quality, trending on ArtStation',
    card1: { icon: '⚡', title: 'Model-Specific Syntax', text: 'Leonardo prompts include game-art quality tags, ArtStation descriptors, and character design vocabulary optimized for Phoenix, Kino, and Vision XL models.' },
    card2: { icon: '🎯', title: 'Optimized Parameters', text: 'Fantasy atmosphere, lighting particle effects, and detail levels are calibrated to Leonardo\'s strengths. Model recommendations are included when relevant.' },
    card3: { icon: '📋', title: 'Ready to Paste', text: 'Paste directly into Leonardo.ai\'s prompt field. Works with all Leonardo models including Phoenix, Kino XL, and game texture generators.' },
    posts: [
      { href: '/blog/leonardo-ai-prompt-guide/', img: '/images/mj-fantasy-library.jpeg', cat: 'Guide', title: 'Leonardo AI Prompt Guide: Fantasy & Game Art' },
      { href: '/blog/image-to-prompt-for-game-art/', img: '/images/walkthrough-reference.jpeg', cat: 'Use Case', title: 'Image to Prompt for Game Art & Concept Design' },
      { href: '/blog/prompt-engineering-for-ai-art/', img: '/images/annotated-artwork.jpeg', cat: 'Tutorial', title: 'Prompt Engineering for AI Art: Complete Guide' },
    ],
  },
  {
    file: 'public/ideogram-prompt-generator/index.html',
    modelName: 'Ideogram',
    icon: '✍️',
    color: '#F472B6',
    beforeImg: '/images/pair3-oil-painting.jpeg',
    beforeAlt: 'Reference image uploaded to ImageToPrompt',
    beforeCaption: 'Original reference image',
    afterImg: '/images/pair3-watercolor.jpeg',
    afterAlt: 'Image recreated with Ideogram v2 prompt from our tool',
    afterCaption: 'Recreated with Ideogram v2 prompt',
    prompt: 'Vintage botanical illustration with elegant serif title "FLORA BOTANICA 1887", hand-drawn linework, warm cream paper texture, soft watercolor washes, museum-quality reproduction print, crisp readable typography, no artifacts',
    card1: { icon: '⚡', title: 'Model-Specific Syntax', text: 'Ideogram prompts describe any text in quotes, specify typography style, and include layout descriptors that guide Ideogram\'s unique text-rendering engine.' },
    card2: { icon: '🎯', title: 'Optimized Parameters', text: 'Text legibility, font style, and color contrast are described precisely. Prompts include Ideogram-specific instructions for accurate text placement and styling.' },
    card3: { icon: '📋', title: 'Ready to Paste', text: 'Paste into Ideogram.ai. Ideogram v2 is recommended for best text accuracy — works for logos, posters, cards, and designs with embedded typography.' },
    posts: [
      { href: '/blog/ideogram-prompt-guide/', img: '/images/pair3-watercolor.jpeg', cat: 'Guide', title: 'Ideogram Prompt Guide: Text-in-Image Generation' },
      { href: '/blog/image-to-prompt-logo-design/', img: '/images/mj-abstract-paint.jpeg', cat: 'Use Case', title: 'Image to Prompt for Logo & Brand Design' },
      { href: '/blog/ai-art-styles-glossary/', img: '/images/pair3-oil-painting.jpeg', cat: 'Reference', title: 'AI Art Styles Glossary: Every Style Explained' },
    ],
  },
];

function buildSections(m) {
  const s1 = `
    <!-- Section 1: See It in Action -->
    <section class="model-showcase-section">
      <h2>See It in Action</h2>
      <div class="model-showcase-grid">
        <div class="showcase-col">
          <span class="showcase-label">Original Image</span>
          <figure class="img-figure">
            <img src="${m.beforeImg}" alt="${m.beforeAlt}" width="600" height="400" loading="lazy" />
            <figcaption>${m.beforeCaption}</figcaption>
          </figure>
        </div>
        <div class="showcase-arrow">→</div>
        <div class="showcase-col">
          <span class="showcase-label generated" style="--model-color:${m.color}">${m.modelName} Output</span>
          <figure class="img-figure">
            <img src="${m.afterImg}" alt="${m.afterAlt}" width="600" height="400" loading="lazy" />
            <figcaption>${m.afterCaption}</figcaption>
          </figure>
        </div>
      </div>
      <div class="showcase-prompt-box">
        <div class="showcase-prompt-header">
          <span class="showcase-prompt-badge" style="background:rgba(167,139,250,0.12);color:${m.color};border-color:rgba(167,139,250,0.25)">${m.icon} ${m.modelName} Prompt</span>
        </div>
        <code class="showcase-prompt-code">${m.prompt}</code>
      </div>
    </section>`;

  const s2 = `
    <!-- Section 2: Why Use -->
    <section class="model-features-section">
      <h2>Why Use ${m.modelName} Prompts?</h2>
      <div class="model-features-grid">
        <div class="model-feature-card" style="--card-accent:${m.color}">
          <div class="feature-icon">${m.card1.icon}</div>
          <h3>${m.card1.title}</h3>
          <p>${m.card1.text}</p>
        </div>
        <div class="model-feature-card" style="--card-accent:${m.color}">
          <div class="feature-icon">${m.card2.icon}</div>
          <h3>${m.card2.title}</h3>
          <p>${m.card2.text}</p>
        </div>
        <div class="model-feature-card" style="--card-accent:${m.color}">
          <div class="feature-icon">${m.card3.icon}</div>
          <h3>${m.card3.title}</h3>
          <p>${m.card3.text}</p>
        </div>
      </div>
    </section>`;

  const s3 = `
      <!-- Section 3: Related Blog Posts -->
      <div class="model-related-section">
        <h2>Prompt Guides &amp; Resources</h2>
        <div class="model-related-grid">
          ${m.posts.map(p => `<a href="${p.href}" class="model-related-card">
            <img src="${p.img}" alt="${p.title}" loading="lazy" />
            <div class="model-related-text">
              <span class="model-related-category">${p.cat}</span>
              <h4>${p.title}</h4>
            </div>
          </a>`).join('\n          ')}
        </div>
      </div>`;

  return { s1, s2, s3 };
}

let updated = 0;
for (const m of models) {
  if (!fs.existsSync(m.file)) { console.log('MISSING:', m.file); continue; }
  let html = fs.readFileSync(m.file, 'utf8');
  const { s1, s2, s3 } = buildSections(m);

  const MARKER1 = '    <!-- Content -->\n    <article class="model-page-content">';
  if (html.includes(MARKER1)) {
    html = html.replace(MARKER1, s1 + '\n' + s2 + '\n\n    <!-- Content -->\n    <article class="model-page-content">');
  } else {
    console.log('WARN: marker1 not found in', m.file);
  }

  const MARKER2 = '      <!-- Other Models -->';
  if (html.includes(MARKER2)) {
    html = html.replace(MARKER2, s3 + '\n\n      <!-- Other Models -->');
  } else {
    console.log('WARN: marker2 not found in', m.file);
  }

  fs.writeFileSync(m.file, html);
  console.log('Done:', m.file);
  updated++;
}
console.log('\nUpdated', updated, '/ 7 model pages');
