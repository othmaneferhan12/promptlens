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
  // International homepages
  { path: '/ja/', changefreq: 'monthly', priority: '0.8' },
  { path: '/ja/describe-image/',  changefreq: 'monthly', priority: '0.8' },
  { path: '/es/', changefreq: 'monthly', priority: '0.8' },
  { path: '/es/describe-image/',  changefreq: 'monthly', priority: '0.8' },
  { path: '/ko/', changefreq: 'monthly', priority: '0.8' },
  { path: '/ko/describe-image/',  changefreq: 'monthly', priority: '0.8' },
  { path: '/ar/', changefreq: 'monthly', priority: '0.8' },
  { path: '/fr/', changefreq: 'monthly', priority: '0.8' },
  // French blog index + posts
  { path: '/fr/blog/',                                               changefreq: 'weekly',  priority: '0.8' },
  { path: '/fr/blog/convertir-image-en-prompt-ia/',                 changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/guide-prompts-midjourney-2026/',                changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/stable-diffusion-vs-midjourney-vs-dalle3/',     changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/reverse-engineering-prompts-ia/',               changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/prompt-engineering-art-ia-debutants/',          changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/api-image-vers-prompt/',                        changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/astuces-prompts-adobe-firefly/',                changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/ecrire-prompts-ia-debutants/',                  changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/erreurs-prompt-engineering/',                   changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/generateur-texte-vers-prompt/',                 changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/glossaire-styles-art-ia/',                      changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/guide-prompts-dall-e-3/',                       changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/guide-prompts-flux-ai/',                        changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/guide-prompts-ideogram/',                       changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/guide-prompts-leonardo-ai/',                    changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/guide-prompts-stable-diffusion/',               changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/guide-prompts-video-ia-2026/',                  changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/image-vers-prompt-anime/',                      changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/image-vers-prompt-decoration-interieur/',       changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/image-vers-prompt-jeux-video/',                 changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/image-vers-prompt-logo/',                       changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/image-vers-prompt-photographie-produit/',       changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/image-vers-prompt-reseaux-sociaux/',            changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/meilleurs-outils-image-vers-prompt-2026/',      changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/midjourney-vs-flux/',                           changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/prompt-ia-depuis-photo/',                       changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/prompts-negatifs-stable-diffusion/',            changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/blog/veo-vs-kling-vs-runway/',                       changefreq: 'monthly', priority: '0.7' },
  // French model/tool pages
  { path: '/fr/describe-image/',                        changefreq: 'monthly', priority: '0.8' },
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
  // French company pages
  { path: '/fr/about/',   changefreq: 'monthly', priority: '0.7' },
  { path: '/fr/pricing/', changefreq: 'monthly', priority: '0.8' },
  // Arabic blog index + posts
  { path: '/ar/blog/',                                                    changefreq: 'weekly',  priority: '0.8' },
  { path: '/ar/blog/tahwil-soura-ila-prompt/',                            changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/dalil-prompts-midjourney-2026/',                      changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/stable-diffusion-vs-midjourney-vs-dalle3/',           changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/handasa-prompts-fan-ia/',                             changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/iada-handasa-prompts-souar-ia/',                      changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/afdal-adawat-soura-ila-prompt-2026/',                 changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/akhta-handasa-prompts/',                              changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/api-soura-ila-prompt/',                               changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/dalil-prompts-dall-e-3/',                             changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/dalil-prompts-flux-ai/',                              changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/dalil-prompts-ideogram/',                             changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/dalil-prompts-leonardo-ai/',                          changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/dalil-prompts-stable-diffusion/',                     changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/dalil-prompts-video-ia-2026/',                        changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/kitabat-prompts-ia-lilmubtadiin/',                    changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/midjourney-vs-flux/',                                 changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/muwalid-nass-ila-prompt/',                            changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/nasaeh-prompts-adobe-firefly/',                       changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/prompt-ia-min-soura-haqiqiya/',                       changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/prompts-salbiya-stable-diffusion/',                   changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/qamus-asalib-fan-ia/',                                changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/soura-ila-prompt-anime/',                             changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/soura-ila-prompt-funun-alaaab/',                      changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/soura-ila-prompt-tasmim-dakhili/',                    changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/soura-ila-prompt-tassmim-shiar/',                     changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/soura-ila-prompt-taswir-muntajat/',                   changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/soura-ila-prompt-wasael-tawassl/',                    changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/blog/veo-vs-kling-vs-runway/',                             changefreq: 'monthly', priority: '0.7' },
  // Arabic model/tool pages
  { path: '/ar/describe-image/',                        changefreq: 'monthly', priority: '0.8' },
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
  // Arabic company pages
  { path: '/ar/about/',   changefreq: 'monthly', priority: '0.7' },
  { path: '/ar/pricing/', changefreq: 'monthly', priority: '0.8' },
  // Web Stories
  { path: '/stories/image-to-prompt-how-it-works/', changefreq: 'monthly', priority: '0.6' },
  { path: '/stories/midjourney-prompt-tips/',        changefreq: 'monthly', priority: '0.6' },
  { path: '/stories/same-image-4-models/',           changefreq: 'monthly', priority: '0.6' },
  // Company pages
  { path: '/about/',   changefreq: 'monthly', priority: '0.7' },
  { path: '/pricing/', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact/', changefreq: 'monthly', priority: '0.6' },
  // New tool pages
  { path: '/describe-image/',          changefreq: 'weekly',  priority: '0.9' },
  { path: '/batch-image-to-prompt/',   changefreq: 'monthly', priority: '0.8' },
  { path: '/image-to-image/',          changefreq: 'monthly', priority: '0.8' },
  // Inspiration pages
  { path: '/inspiration/',                changefreq: 'monthly', priority: '0.7' },
  { path: '/inspiration/art-styles/',     changefreq: 'monthly', priority: '0.7' },
  { path: '/inspiration/perspectives/',   changefreq: 'monthly', priority: '0.7' },
  // Russian pages
  { path: '/ru/',                                                    changefreq: 'monthly', priority: '0.8' },
  { path: '/ru/describe-image/',                                     changefreq: 'monthly', priority: '0.8' },
  { path: '/ru/blog/konverter-izobrazheniya-v-prompt/',              changefreq: 'monthly', priority: '0.7' },
  { path: '/ru/blog/rukovodstvo-po-promptam-midjourney-2026/',       changefreq: 'monthly', priority: '0.7' },
  { path: '/ru/blog/stable-diffusion-vs-midjourney-vs-dalle3/',      changefreq: 'monthly', priority: '0.7' },
  { path: '/ru/blog/inzhenering-promptov-dlya-ii-arta/',             changefreq: 'monthly', priority: '0.7' },
  { path: '/ru/blog/obratnaya-inzheneriya-promptov/',                changefreq: 'monthly', priority: '0.7' },
];

// ── Image sitemap pages ──────────────────────────────────────────────────────
// Maps page paths to their primary images for Google Image Search indexing.
const IMAGE_PAGES = [
  {
    path: '/',
    images: [
      { loc: '/images/ai-prompt-generator-golden-hour-lighting.webp', title: 'Golden hour cinematic portrait AI prompt example' },
      { loc: '/images/ai-image-to-prompt-oil-painting-style.webp',    title: 'Classical oil painting style AI art prompt' },
      { loc: '/images/ai-prompt-generator-cyberpunk-midjourney.webp', title: 'Cyberpunk digital art AI prompt — Midjourney' },
      { loc: '/images/ai-image-to-prompt-luxury-watch-recreated.webp',title: 'Luxury watch product photography AI prompt recreation' },
      { loc: '/images/image-to-prompt-basic-cat-garden.webp',         title: 'Watercolor cat in garden AI prompt example' },
    ],
  },
  {
    path: '/blog/adobe-firefly-prompt-tips/',
    images: [{ loc: '/images/ai-image-generator-prompt-rose-dalle3.jpeg', title: 'Adobe Firefly prompt tips — AI rose image example' }],
  },
  {
    path: '/blog/ai-art-styles-glossary/',
    images: [{ loc: '/images/ai-image-to-prompt-oil-painting-style.jpeg', title: 'AI art styles glossary — oil painting style' }],
  },
  {
    path: '/blog/ai-prompt-from-photo/',
    images: [
      { loc: '/images/image-to-prompt-shibuya-crossing-original.jpeg', title: 'Shibuya crossing original photo for AI prompt generation' },
      { loc: '/images/image-to-prompt-shibuya-recreated.jpeg',         title: 'Shibuya crossing AI recreated from prompt' },
      { loc: '/images/image-to-prompt-shibuya-tool-output.jpeg',       title: 'Shibuya crossing AI prompt tool output' },
    ],
  },
  {
    path: '/blog/best-image-to-prompt-tools-2026/',
    images: [{ loc: '/images/image-prompt-tool-interface-annotated.jpeg', title: 'Best image-to-prompt tool interface 2026 — annotated' }],
  },
  {
    path: '/blog/convert-image-to-ai-prompt/',
    images: [{ loc: '/images/image-prompt-tool-interface-annotated.jpeg', title: 'How to convert image to AI prompt — tool walkthrough' }],
  },
  {
    path: '/blog/dall-e-3-prompt-guide/',
    images: [
      { loc: '/images/ai-prompt-generator-cyberpunk-dalle3.jpeg',          title: 'DALL-E 3 cyberpunk city prompt example' },
      { loc: '/images/ai-image-generator-prompt-rose-dalle3.jpeg',         title: 'DALL-E 3 rose prompt example' },
      { loc: '/images/prompt-generator-from-image-temple-dalle3.jpeg',     title: 'DALL-E 3 ancient temple prompt from image' },
    ],
  },
  {
    path: '/blog/flux-ai-prompt-guide/',
    images: [
      { loc: '/images/prompt-generator-from-image-temple-flux.jpeg',       title: 'Flux AI ancient temple prompt from image' },
      { loc: '/images/ai-image-generator-prompt-rose-flux.jpeg',           title: 'Flux AI rose prompt example' },
      { loc: '/images/ai-prompt-generator-cyberpunk-flux.jpeg',            title: 'Flux AI cyberpunk prompt example' },
    ],
  },
  {
    path: '/blog/how-to-write-ai-prompts-beginners/',
    images: [
      { loc: '/images/image-to-prompt-basic-cat-garden.jpeg',              title: 'Beginner AI prompt — simple cat in garden' },
      { loc: '/images/image-prompt-cat-detailed-cottage-garden.jpeg',      title: 'Advanced AI prompt — detailed cat in cottage garden' },
    ],
  },
  {
    path: '/blog/ideogram-prompt-guide/',
    images: [{ loc: '/images/prompt-generator-from-image-temple-dalle3.jpeg', title: 'Ideogram prompt guide — temple scene example' }],
  },
  {
    path: '/blog/image-to-prompt-api/',
    images: [{ loc: '/images/image-prompt-tool-interface-annotated.jpeg', title: 'Image-to-prompt API — annotated tool interface' }],
  },
  {
    path: '/blog/image-to-prompt-for-anime/',
    images: [{ loc: '/images/image-to-prompt-ai-cinematic-portrait-style.jpeg', title: 'Anime-style AI image prompt — cinematic portrait' }],
  },
  {
    path: '/blog/image-to-prompt-for-game-art/',
    images: [{ loc: '/images/prompt-generator-from-image-extreme-closeup.jpeg', title: 'Game art AI prompt — extreme closeup detail' }],
  },
  {
    path: '/blog/image-to-prompt-for-interior-design/',
    images: [{ loc: '/images/ai-prompt-generator-golden-hour-lighting.jpeg', title: 'Interior design AI prompt — golden hour lighting' }],
  },
  {
    path: '/blog/image-to-prompt-for-social-media/',
    images: [{ loc: '/images/ai-image-to-prompt-oil-painting-style.jpeg', title: 'Social media AI image prompt — artistic oil painting style' }],
  },
  {
    path: '/blog/image-to-prompt-logo-design/',
    images: [{ loc: '/images/ai-image-generator-prompt-rose-midjourney.jpeg', title: 'AI logo design prompt — Midjourney rose example' }],
  },
  {
    path: '/blog/image-to-prompt-product-photography/',
    images: [{ loc: '/images/prompt-generator-from-image-midjourney-perfume.jpeg', title: 'Product photography AI prompt — Midjourney perfume shot' }],
  },
  {
    path: '/blog/leonardo-ai-prompt-guide/',
    images: [{ loc: '/images/prompt-generator-from-image-extreme-closeup.jpeg', title: 'Leonardo AI prompt guide — extreme closeup example' }],
  },
  {
    path: '/blog/midjourney-prompt-guide-2026/',
    images: [
      { loc: '/images/describe-the-photo-midjourney-fisherman-portrait.jpeg', title: 'Midjourney portrait prompt — fisherman example' },
      { loc: '/images/ai-prompt-image-midjourney-v52-samurai.jpeg',           title: 'Midjourney v5.2 samurai prompt example' },
      { loc: '/images/image-to-prompt-ai-midjourney-fantasy-library.jpeg',    title: 'Midjourney fantasy library AI prompt' },
      { loc: '/images/image-to-prompt-midjourney-v61-jazz-musician.jpeg',     title: 'Midjourney v6.1 jazz musician prompt example' },
    ],
  },
  {
    path: '/blog/midjourney-vs-flux/',
    images: [
      { loc: '/images/ai-prompt-generator-cyberpunk-midjourney.jpeg', title: 'Midjourney vs Flux — cyberpunk comparison Midjourney' },
      { loc: '/images/ai-prompt-generator-cyberpunk-flux.jpeg',       title: 'Midjourney vs Flux — cyberpunk comparison Flux AI' },
    ],
  },
  {
    path: '/blog/negative-prompts-stable-diffusion/',
    images: [{ loc: '/images/ai-prompt-generator-cyberpunk-stable-diffusion.jpeg', title: 'Stable Diffusion cyberpunk prompt with negative prompts' }],
  },
  {
    path: '/blog/prompt-engineering-for-ai-art/',
    images: [{ loc: '/images/image-to-prompt-ai-cinematic-portrait-style.jpeg', title: 'Prompt engineering for AI art — cinematic portrait example' }],
  },
  {
    path: '/blog/prompt-engineering-mistakes/',
    images: [
      { loc: '/images/explain-this-image-ominous-mood.jpeg',          title: 'AI prompt engineering mistakes — ominous mood example' },
      { loc: '/images/ai-prompt-image-peaceful-mood.jpeg',            title: 'AI prompt mood — peaceful scene example' },
    ],
  },
  {
    path: '/blog/reverse-engineer-ai-art-prompts/',
    images: [
      { loc: '/images/describe-the-photo-artwork-analysis.jpeg',      title: 'Reverse engineering AI art prompts — artwork analysis' },
      { loc: '/images/describe-the-photo-watercolor-style.jpeg',      title: 'Reverse engineering watercolor style AI prompt' },
    ],
  },
  {
    path: '/blog/stable-diffusion-prompt-guide/',
    images: [
      { loc: '/images/ai-prompt-generator-cyberpunk-stable-diffusion.jpeg', title: 'Stable Diffusion prompt guide — cyberpunk example' },
      { loc: '/images/ai-image-generator-prompt-rose-stable-diffusion.jpeg', title: 'Stable Diffusion rose prompt example' },
    ],
  },
  {
    path: '/blog/stable-diffusion-vs-midjourney-vs-dalle3/',
    images: [
      { loc: '/images/ai-prompt-image-model-comparison-grid.jpeg',           title: 'Stable Diffusion vs Midjourney vs DALL-E 3 model comparison' },
      { loc: '/images/ai-prompt-generator-cyberpunk-midjourney.jpeg',        title: 'Midjourney cyberpunk prompt example' },
      { loc: '/images/ai-prompt-generator-cyberpunk-dalle3.jpeg',            title: 'DALL-E 3 cyberpunk prompt example' },
      { loc: '/images/ai-prompt-generator-cyberpunk-stable-diffusion.jpeg',  title: 'Stable Diffusion cyberpunk prompt example' },
      { loc: '/images/ai-prompt-generator-cyberpunk-flux.jpeg',              title: 'Flux AI cyberpunk prompt example' },
    ],
  },
  {
    path: '/blog/veo-vs-kling-vs-runway/',
    images: [{ loc: '/images/ai-prompt-generator-abstract-paint-explosion.jpeg', title: 'Veo vs Kling vs Runway — AI video prompt comparison' }],
  },
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

// ── Build image sitemap XML ──────────────────────────────────────────────────
function buildImageSitemap(imagePages) {
  const urls = imagePages
    .map(p => {
      const imageEntries = p.images
        .map(img => `    <image:image>
      <image:loc>${SITE_URL}${img.loc}</image:loc>
      <image:title>${img.title}</image:title>
    </image:image>`)
        .join('\n');
      return `  <url>
    <loc>${SITE_URL}${p.path}</loc>
${imageEntries}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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
`;
}

// ── Write files ──────────────────────────────────────────────────────────────
const blogPosts     = discoverBlogPosts();
const allPages      = [...STATIC_PAGES, ...blogPosts];
const sitemapXml    = buildSitemap(allPages);
const imageSitemap  = buildImageSitemap(IMAGE_PAGES);
const robotsTxt     = buildRobots();

// dist/ → served in production by Vercel
writeFileSync(join(process.cwd(), 'dist', 'sitemap.xml'),       sitemapXml);
writeFileSync(join(process.cwd(), 'dist', 'image-sitemap.xml'), imageSitemap);
writeFileSync(join(process.cwd(), 'dist', 'robots.txt'),        robotsTxt);

// public/ → source of truth, copied into dist/ on next build
writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'),       sitemapXml);
writeFileSync(join(process.cwd(), 'public', 'image-sitemap.xml'), imageSitemap);
writeFileSync(join(process.cwd(), 'public', 'robots.txt'),        robotsTxt);

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n✓ sitemap.xml written — ${allPages.length} URLs:`);
allPages.forEach(p => console.log(`  ${SITE_URL}${p.path}`));
console.log(`\n✓ image-sitemap.xml written — ${IMAGE_PAGES.length} pages with images`);
console.log('\n✓ robots.txt written');
