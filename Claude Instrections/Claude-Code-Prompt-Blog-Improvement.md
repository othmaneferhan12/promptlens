# CLAUDE CODE PROMPT — FULL BLOG IMPROVEMENT
# Copy everything below this line and paste into Claude Code

I need a complete overhaul of my blog on imagetoprompt.dev. I have 5 blog posts that Google has crawled but refuses to index because they lack visual content, structured data, and engagement elements. Every fix below is required. Do not skip anything.

My site is built with [Next.js / whatever framework you use — tell Claude Code which one].

---

## PART 1: GLOBAL TEMPLATE CHANGES (apply to ALL blog posts)

These changes go into the shared blog post layout/template component so every current and future post gets them automatically.

### 1A. Article Schema (JSON-LD)

Add JSON-LD structured data in the <head> of every blog post page. Populate dynamically per article:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[H1 of the article]",
  "description": "[meta description]",
  "image": "[OG image URL for this article]",
  "datePublished": "[ISO 8601 date]",
  "dateModified": "[ISO 8601 date — update this whenever content changes]",
  "author": {
    "@type": "Person",
    "name": "[YOUR REAL NAME]",
    "url": "[YOUR TWITTER OR LINKEDIN URL]"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ImageToPrompt",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.imagetoprompt.dev/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "[canonical URL of this blog post]"
  }
}
```

### 1B. Auto-Generated Table of Contents

Add an auto-generated clickable Table of Contents component that:
- Extracts all H2 headings from the blog post content
- Renders a numbered list of anchor links at the top of the article (after the intro paragraph, before the first H2)
- Each H2 must have a matching `id` attribute for the anchor to work
- Style: clean card with subtle gray background, left border accent in brand color
- Label it "In this guide:" or "Table of Contents"
- Make it collapsible on mobile

### 1C. Author Bio Component

Add an author bio section at the bottom of every blog post (before the "Related Guides" section). It must include:
- Author photo (use a placeholder image for now at /images/author.jpg — I'll replace it later)
- Real name (use a placeholder "[Author Name]" — I'll replace it)
- Bio text: "Prompt engineer and AI artist specializing in Midjourney, Stable Diffusion, and Flux. Building ImageToPrompt to make AI image generation accessible to everyone."
- Link to Twitter/X profile (placeholder URL for now)
- Style: horizontal card layout with photo on left, text on right, subtle border, slightly different background

### 1D. Open Graph & Twitter Card Meta Tags

Add to every blog post's <head>, dynamically populated:
- `og:title` — article title
- `og:description` — meta description
- `og:image` — a unique 1200x630 OG image per article (for now, use a default site OG image at /images/og-default.jpg — I'll create custom ones later)
- `og:type` — "article"
- `og:url` — canonical URL
- `og:site_name` — "ImageToPrompt"
- `twitter:card` — "summary_large_image"
- `twitter:title` — article title
- `twitter:description` — meta description
- `twitter:image` — same as og:image
- `twitter:site` — "@imagetoprompt" (placeholder)

### 1E. Embedded Tool CTA Blocks

Create a reusable CTA component that I can place inside blog posts. Two variants:

**Variant 1 — Inline CTA (for mid-article placement):**
A styled box with: brief text like "Try it yourself — upload any image and get a [Midjourney/SD/Flux] prompt in seconds", a prominent "Try Free →" button linking to https://www.imagetoprompt.dev/, and a subtle background color.

**Variant 2 — Full Tool Embed:**
An iframe or embedded component that loads the actual ImageToPrompt tool interface directly inside the blog post. If an iframe isn't feasible, create a visually rich CTA block that simulates the tool interface (showing the upload area mockup, model selector, and a "Try it now" button).

Place Variant 1 after the first section of each blog post. Place Variant 2 before the "Related Guides" section at the bottom.

### 1F. Image Alt Text Enforcement

Ensure every `<img>` and Next.js `<Image>` component in blog posts requires a descriptive `alt` attribute. If using MDX or a CMS, add validation that warns when alt text is missing.

### 1G. "Last Updated" Display

Add a visible "Last updated: [date]" line near the publish date on each article. This uses the dateModified value and signals freshness to both users and Google.

---

## PART 2: POST-SPECIFIC CONTENT ADDITIONS

For each blog post below, add the specified new sections and content. Each addition must be integrated naturally into the existing article flow, not dumped at the end.

---

### POST 1: /blog/convert-image-to-ai-prompt/
**Current title:** "How to Convert Any Image to an AI Prompt (Step-by-Step Guide)"

**Addition 1 — Before/After Example Section:**
After the "Step 3: Upload and Analyze" section, add a new section called "## Real Examples: Image to Prompt in Action". This section needs 3 placeholder image slots (I will add the actual images later). Structure it as:

- **Example 1: Photograph → Prompt**
  - Placeholder for: original photograph image
  - Placeholder for: screenshot of ImageToPrompt tool output
  - Placeholder for: recreated AI image using the generated prompt
  - Brief explanation paragraph: what the tool detected, what made this prompt effective

- **Example 2: Digital Illustration → Prompt**
  - Same 3-image structure as above
  - Brief explanation paragraph

- **Example 3: AI-Generated Art → Prompt**
  - Same 3-image structure as above
  - Brief explanation paragraph

Use a grid or side-by-side layout for the 3 stages. Each image placeholder should be a styled div with text like "[Image: Original photograph]", "[Image: Tool output screenshot]", "[Image: Recreated result]" so I know exactly what to replace.

**Addition 2 — Model Comparison Table:**
Replace the current text-only descriptions of Midjourney/SD/Flux/DALL-E prompt differences (in the "Step 2: Select Your Target AI Model" section) with a structured HTML table:

| Feature | Midjourney | Stable Diffusion | Flux | DALL-E 3 |
|---------|-----------|-----------------|------|----------|
| Prompt Style | Comma-separated + parameters | Weighted (syntax:1.2) | Detailed natural language | Complete sentences |
| Negative Prompts | --no flag | Dedicated field | Not supported | Not supported |
| Parameters | --ar, --v, --style, --chaos | CFG scale, steps, sampler | Minimal | Minimal |
| Best For | Artistic, cinematic | Technical control, custom models | Photorealism | Text in images, instruction-following |
| Example Snippet | `portrait, golden hour --ar 2:3 --v 6.1` | `(portrait:1.2), golden hour, (bokeh:0.8)` | `Photograph of portrait at golden hour, Canon 85mm f/1.4` | `A portrait photograph taken during golden hour with warm, soft light` |

**Addition 3 — Common Mistakes Section:**
After the "Step 5: Test and Iterate" section, add "## 5 Common Mistakes When Converting Images to Prompts" with these items:
1. Using low-resolution or blurry source images — explain why quality matters
2. Ignoring the model selector — explain why generic prompts underperform model-specific ones
3. Using the raw output without editing — explain that AI-generated prompts are starting points
4. Not testing with multiple generations — explain seed randomness
5. Copying prompts without understanding them — explain why comprehension leads to better results

**Addition 4 — Annotated Tool Screenshot:**
Add a placeholder image slot right before "Step 3: Upload and Analyze" with the text "[Image: Annotated screenshot of ImageToPrompt interface showing: 1. Upload area, 2. Model selector dropdown, 3. Style mode selector, 4. Generate button, 5. Output area with prompt, negative prompt, and color palette]". I'll create this annotated screenshot myself.

---

### POST 2: /blog/reverse-engineer-ai-art-prompts/
**Current title:** "How to Reverse Engineer AI Art Prompts from Any Image"

**Addition 1 — Annotated Image Example:**
In the "Method 2: Manual Visual Decomposition" section, after the "Analyze the Subject" subsection, add a placeholder for an annotated image: "[Image: Example AI artwork with labeled annotations pointing to — Subject (warrior in center), Lighting direction (rim light from upper left), Color palette zones (warm foreground, cool background), Composition lines (rule of thirds grid overlay), Style indicators (digital painting texture)]". I'll create this annotated image.

**Addition 2 — Full Worked Example:**
After "Method 3: Combine Both", add a new section "## Complete Walkthrough: Reverse Engineering One Image". Structure:
1. "[Image placeholder: The original reference image]" with caption
2. "**Step 1: Automated Analysis** — Here's what ImageToPrompt generated:" followed by a placeholder styled code block showing a sample Midjourney prompt
3. "**Step 2: Manual Observations** — Elements the AI missed or got wrong:" followed by a short paragraph about what a human eye catches that AI doesn't
4. "**Step 3: The Refined Prompt** —" followed by the final improved prompt in a styled code block
5. "[Image placeholder: The recreated image using the refined prompt]"
Add connecting explanation paragraphs between each step.

**Addition 3 — Side-by-Side Model Output:**
Add a section "## Same Image, Different Models" showing how one image produces different prompts per model:
- "[Image placeholder: Source image]"
- A 4-column layout or stacked cards showing: Midjourney prompt | Stable Diffusion prompt | Flux prompt | DALL-E 3 prompt (use placeholder sample prompt text for each — I'll replace with real outputs)
- Brief paragraph explaining why each model's prompt looks different

**Addition 4 — Downloadable Cheat Sheet CTA:**
Before the "Related Guides" section, add a styled CTA box: "📥 Free Download: Reverse Prompt Engineering Cheat Sheet — A visual reference card with lighting types, composition terms, style descriptors, and color vocabulary. [Download PDF →]" (link to a placeholder /downloads/cheat-sheet.pdf — I'll create the actual PDF later)

---

### POST 3: /blog/midjourney-prompt-guide-2026/
**Current title:** "Midjourney Prompts: A Complete Guide to Writing Better Prompts in 2026"

**Addition 1 — Complete Parameter Reference Table:**
Replace the current parameter descriptions (which are good but text-heavy) with a comprehensive reference table:

| Parameter | Syntax | Range / Values | What It Does | Default | Example |
|-----------|--------|---------------|--------------|---------|---------|
| Aspect Ratio | `--ar W:H` | Any ratio | Sets image proportions | 1:1 | `--ar 16:9` |
| Version | `--v N` | 4, 5, 5.1, 5.2, 6, 6.1 | Model version | 6.1 | `--v 6.1` |
| Style Raw | `--style raw` | On/off | Less opinionated output | Off | `--style raw` |
| Stylize | `--s N` | 0–1000 | Artistic intensity | 100 | `--s 750` |
| Chaos | `--c N` | 0–100 | Variation between results | 0 | `--c 30` |
| Quality | `--q N` | 0.25, 0.5, 1, 2 | Render quality/time | 1 | `--q 2` |
| No | `--no [terms]` | Any words | Exclude elements | — | `--no blur, text` |
| Seed | `--seed N` | 0–4294967295 | Reproducible results | Random | `--seed 12345` |
| Tile | `--tile` | On/off | Seamless tiling pattern | Off | `--tile` |
| Repeat | `--repeat N` | 1–40 | Run prompt multiple times | 1 | `--repeat 4` |
| Image Weight | `--iw N` | 0.5–2 | Image reference strength | 1 | `--iw 1.5` |

**Addition 2 — Prompt Formula Framework:**
After the "Midjourney Prompt Structure" section, add "## The Midjourney Prompt Formula" with a visual framework. Create a styled box/card that shows:

```
[Subject + specific details] + [Environment/setting] + [Style/medium] + [Lighting] + [Color palette] + [Mood/atmosphere] + [Composition/camera] + [--parameters]
```

Then show 3 real filled-in examples using this formula:
- Portrait example
- Landscape example  
- Product/commercial example

Each with the formula slots color-coded or labeled so readers can see which words fill which slot.

**Addition 3 — Visual Prompt Examples:**
Add a section "## Prompt Examples with Results" containing 6 example blocks. Each block has:
- A styled prompt code block showing the full Midjourney prompt
- "[Image placeholder: Midjourney output for this prompt]" — I'll add real images
- 2-3 sentences explaining why specific words were chosen and what they do
- Categories: Portrait, Landscape, Fantasy/Concept Art, Product Photography, Abstract, Architecture

**Addition 4 — Version Comparison:**
Add "## Midjourney Version Comparison" with:
- A placeholder for 3 side-by-side images showing the same prompt in V5.2, V6, and V6.1
- A brief comparison table: | Aspect | V5.2 | V6 | V6.1 | with rows for Photorealism, Text Rendering, Detail Level, Prompt Following, Speed

**Addition 5 — Expand Word Count:**
Add 800-1000 more words covering:
- A section on "## Multi-Prompts and Permutations" explaining :: weighting syntax in detail with 3 examples
- A section on "## Using Image References Effectively" with --iw weight examples
- A "## Troubleshooting" FAQ at the end: "My images are too dark" → lighting fix, "Hands look wrong" → --no deformed hands, "Results look too similar" → increase --chaos, "Text is garbled" → V6+ tips

---

### POST 4: /blog/stable-diffusion-vs-midjourney-vs-dalle3/
**Current title:** "Stable Diffusion vs Midjourney vs DALL·E 3 vs Flux: Prompt Differences Explained"

**Addition 1 — Master Comparison Table:**
At the very top of the article (after the intro paragraph), add a comprehensive comparison table:

| Category | Midjourney | Stable Diffusion | DALL-E 3 | Flux |
|----------|-----------|-----------------|----------|------|
| Price | $10-60/mo subscription | Free (open source) | $20/mo (ChatGPT Plus) | Pay-per-image via API |
| Free Tier | No | Yes (fully free) | Limited in Bing | Limited free on some platforms |
| Prompt Style | Descriptive + parameters | Weighted tags + negative prompt | Natural sentences | Detailed natural language |
| Best For | Artistic/cinematic | Max control, local use | Text in images | Photorealism |
| Photorealism | Very good | Model-dependent | Good | Best |
| Artistic Style | Best | Model-dependent | Good | Moderate |
| Text in Images | Improving (V6+) | Poor | Best | Good |
| Speed | Fast (cloud) | Depends on hardware | Fast (cloud) | Fast (cloud) |
| Customization | Limited (parameters) | Extensive (LoRAs, checkpoints) | Minimal | Moderate |
| API Access | No official API | Yes (multiple) | Yes (OpenAI API) | Yes (Replicate, fal.ai) |
| Privacy | Cloud only | Can run fully local | Cloud only | Cloud mostly |
| Learning Curve | Low | High | Very Low | Low |
| Negative Prompts | --no flag | Full negative prompt field | Not available | Not available |

**Addition 2 — Same Prompt, 4 Models Visual:**
The article already has written prompt examples for all 4 models (the astronaut example). Add 4 image placeholders to show the actual visual output:
- "[Image placeholder: Midjourney output — astronaut on red planet]"
- "[Image placeholder: Stable Diffusion output — astronaut on red planet]"  
- "[Image placeholder: DALL-E 3 output — astronaut on red planet]"
- "[Image placeholder: Flux output — astronaut on red planet]"

Lay these out in a 2x2 grid with model name labels. I'll generate and add the actual images.

Do this for TWO MORE concepts (add new examples):
- Concept 2: "cozy coffee shop interior on a rainy day" — show all 4 model prompts + 4 image placeholders
- Concept 3: "portrait of an elderly craftsman in his workshop" — show all 4 model prompts + 4 image placeholders

**Addition 3 — Decision Flowchart:**
Add "## Which AI Image Generator Should You Use?" with a text-based decision tree (I'll convert it to a visual later):

```
What's your priority?
├── Maximum artistic quality → Midjourney
├── Photorealism → Flux  
├── Full control & customization → Stable Diffusion
├── Text in images → DALL-E 3
├── Free / open source → Stable Diffusion
├── Easiest to use → DALL-E 3 (via ChatGPT)
├── Commercial safety → DALL-E 3 or Adobe Firefly
└── Privacy / local processing → Stable Diffusion
```

**Addition 4 — Pricing Table:**
Add "## Pricing Comparison (March 2026)" with current pricing:

| Plan | Midjourney | Stable Diffusion | DALL-E 3 | Flux |
|------|-----------|-----------------|----------|------|
| Free | No | Yes (open source) | Limited (Bing) | Limited on some platforms |
| Basic | $10/mo (~200 images) | Free (self-hosted) | $20/mo (ChatGPT Plus) | ~$0.003-0.05/image (API) |
| Pro | $30/mo (unlimited relax) | Free (self-hosted) | $20/mo (same tier) | Same API pricing |
| Max | $60/mo (fast + stealth) | Hosting costs vary | Enterprise pricing | Enterprise via BFL |

Add a note: "Prices as of March 2026. Verify current pricing on each platform's website."

---

### POST 5: /blog/prompt-engineering-for-ai-art/
**Current title:** "What Is Prompt Engineering for AI Art? A Beginner's Guide"

**Addition 1 — "What One Word Changes" Visual Pairs:**
After the "Why 'Cool Dragon' Doesn't Work" section, add "## See the Difference: How Single Words Change Everything". Create 5 example pairs. Each pair shows:
- Prompt A text and "[Image placeholder: result A]"
- Prompt B text (ONE word different, highlighted in bold) and "[Image placeholder: result B]"
- 1-2 sentence explanation of why that one word matters

Pairs:
1. "cinematic portrait" vs "editorial portrait"
2. "golden hour lighting" vs "blue hour lighting"
3. "oil painting" vs "watercolor painting"
4. "wide angle shot" vs "extreme close-up"
5. "peaceful mood" vs "ominous mood"

**Addition 2 — Prompt Anatomy Diagram:**
After "The Five Pillars" section, add "## Anatomy of a Professional Prompt" with a styled box showing a real prompt where each part is color-coded/labeled:

```
[SUBJECT: ancient sea dragon emerging from stormy ocean waves at night]
[STYLE: dark fantasy concept art, digital painting]
[LIGHTING: dramatic rim lighting, bioluminescent glow from below]
[COLOR: deep navy blue and teal with warm orange accents]
[COMPOSITION: cinematic wide shot, low angle perspective]
[MOOD: mysterious, awe-inspiring, powerful]
[TECHNICAL: --ar 21:9 --v 6.1 --style raw --q 2]
```

Use actual CSS colors or background highlights to make each category visually distinct (e.g., subject = blue highlight, lighting = yellow highlight, etc.).

**Addition 3 — Prompt Progression:**
Add "## Watch a Prompt Evolve: From Basic to Professional" showing 5 stages:
- Stage 1: `a cat in a garden` + "[Image placeholder]" — "Too vague. Generic result."
- Stage 2: `a fluffy orange tabby cat sitting among wildflowers in an English cottage garden` + "[Image placeholder]" — "Better — specific subject and setting."
- Stage 3: Add style → `... watercolor illustration style, soft edges` + "[Image placeholder]" — "Now it has artistic direction."
- Stage 4: Add lighting → `... golden hour sunlight, dappled light through trees` + "[Image placeholder]" — "Lighting transforms the mood."
- Stage 5: Add technical → `... shallow depth of field, rule of thirds composition --ar 3:2 --v 6.1` + "[Image placeholder]" — "Professional result."

Show the FULL cumulative prompt at each stage, with the new addition highlighted/bolded.

**Addition 4 — Vocabulary Reference Table:**
After "Quality Tags: The Reliable Boosters", add "## Prompt Vocabulary Cheat Sheet" with a reference table:

| Category | Useful Words |
|----------|-------------|
| Lighting | golden hour, blue hour, rim light, backlit, Rembrandt lighting, volumetric, neon, candlelight, overcast, harsh shadow, soft diffused |
| Style | cinematic, editorial, concept art, oil painting, watercolor, anime, photorealistic, hyperrealistic, minimalist, surrealist |
| Mood | ethereal, dramatic, serene, ominous, nostalgic, whimsical, melancholic, epic, cozy, unsettling |
| Composition | close-up, wide shot, bird's eye, Dutch angle, rule of thirds, centered, leading lines, negative space, shallow DOF, deep focus |
| Color | warm tones, cool tones, muted palette, vibrant saturated, monochromatic, complementary colors, pastel, earth tones, jewel tones |
| Quality (SD) | masterpiece, best quality, highly detailed, 8k, ultra HD, sharp focus, professional, award-winning |
| Camera | 85mm f/1.4, wide angle 24mm, macro lens, Canon EOS R5, Hasselblad, film grain, bokeh, tilt-shift |

**Addition 5 — Beginner Exercises:**
Before the CTA at the bottom, add "## 3 Exercises to Practice Right Now":
1. "**Exercise: Analyze and Compare** — Upload your favorite photo to ImageToPrompt. Read the generated prompt carefully. Then write your OWN prompt for the same image without looking at the AI output. Compare the two — what did you miss? What did the AI miss?"
2. "**Exercise: The One-Word Game** — Take any working prompt and change exactly one word. Generate both versions. Do this 5 times with 5 different words. You'll learn which words have the most visual impact."
3. "**Exercise: Style Transfer** — Generate a prompt from a landscape photo. Now replace the subject with something completely different (a person, a building, a vehicle) but keep ALL the style, lighting, and mood words the same. See how the style transfers."

---

## PART 3: FINAL VERIFICATION

After making ALL changes:

1. Build the project and verify all 5 blog posts render correctly with no broken layouts
2. Verify Article JSON-LD schema is present in the page source of each blog post (View Source → search for "schema.org")
3. Verify Open Graph tags are present in the <head> of each blog post
4. Verify the Table of Contents generates correctly on each post with working anchor links
5. Verify the author bio appears on all 5 posts
6. Verify all image placeholders are clearly marked so I can find and replace them easily
7. Count the total image placeholders per post and list them so I have a production checklist
8. Run a Lighthouse audit on one blog post and report the SEO score

List all changes made and any files modified when done.
