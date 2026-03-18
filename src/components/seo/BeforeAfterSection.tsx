const EXAMPLES = [
  {
    original: '/images/ex1-original-photo.webp',
    originalAlt: 'Original photograph — source image uploaded to ImageToPrompt',
    recreated: '/images/ex1-recreated.webp',
    recreatedAlt: 'AI-recreated image generated from the extracted Midjourney prompt',
    model: 'Midjourney',
    modelColor: '#00b4d8',
    prompt:
      'documentary portrait, elderly fisherman at harbor at dawn, weathered skin texture, golden hour rim lighting, shallow depth of field, film grain, Kodak Portra tones --ar 2:3 --v 6.1 --style raw --stylize 350',
    subject: 'Portrait photograph',
  },
  {
    original: '/images/ex2-original-illustration.webp',
    originalAlt: 'Original digital illustration — fantasy character source image',
    recreated: '/images/ex2-recreated.webp',
    recreatedAlt: 'AI-recreated fantasy illustration from the extracted Stable Diffusion prompt',
    model: 'Stable Diffusion',
    modelColor: '#ff6b35',
    prompt:
      '(masterpiece:1.2), (ultra-detailed:1.1), fantasy character illustration, elven warrior in enchanted forest, bioluminescent flora, ethereal blue-green lighting, dynamic pose\nNegative: (worst quality:1.4), blurry, watermark',
    subject: 'Fantasy illustration',
  },
  {
    original: '/images/ex3-original-ai-art.webp',
    originalAlt: 'Original AI-generated sci-fi artwork used as reference image',
    recreated: '/images/ex3-recreated.webp',
    recreatedAlt: 'Flux AI recreation from the reverse-engineered prompt',
    model: 'Flux AI',
    modelColor: '#7c3aed',
    prompt:
      'A lone astronaut stands on a rust-colored alien plateau beneath a vast binary star system. Shot with a Sony A7R V, 24mm f/2.8, deep focus. Teal and amber color grade, cinematic quality, photorealistic.',
    subject: 'Sci-fi concept art',
  },
];

export default function BeforeAfterSection() {
  return (
    <section
      id="examples-before-after"
      className="mx-auto max-w-5xl px-4 py-16 sm:px-6"
      aria-labelledby="before-after-heading"
    >
      <h2
        id="before-after-heading"
        className="font-grotesk text-2xl font-700 text-[var(--text-primary)] mb-2"
      >
        See It in Action
      </h2>
      <p className="font-inter text-sm text-[var(--text-secondary)] mb-10">
        Real examples of images converted to AI prompts — and the results.
      </p>

      <div className="flex flex-col gap-5">
        {EXAMPLES.map((ex, i) => (
          <div
            key={i}
            className="group rounded-2xl border border-[var(--border-subtle)] p-5 transition-transform duration-200 hover:scale-[1.01]"
            style={{ background: 'var(--bg-card)' }}
          >
            {/* Subject label */}
            <p className="font-inter text-xs text-[var(--text-secondary)] mb-4 uppercase tracking-widest font-600">
              {ex.subject}
            </p>

            {/* Three-column layout */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1.4fr_auto_1fr] sm:items-center">

              {/* Original */}
              <div className="flex flex-col gap-2">
                <span
                  className="font-inter text-[10px] font-700 uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Original
                </span>
                <picture>
                  <source srcSet={ex.original} type="image/webp" />
                  <img
                    src={ex.original.replace('.webp', '.jpeg')}
                    alt={ex.originalAlt}
                    loading="lazy"
                    width="400"
                    height="400"
                    style={{
                      width: '100%',
                      aspectRatio: '4/3',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      display: 'block',
                    }}
                  />
                </picture>
              </div>

              {/* Arrow */}
              <div className="hidden sm:flex flex-col items-center gap-1 px-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Prompt */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="font-inter text-[10px] font-700 uppercase tracking-widest"
                    style={{ color: ex.modelColor }}
                  >
                    AI Prompt
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 font-inter text-[9px] font-700 uppercase tracking-wider"
                    style={{
                      background: `${ex.modelColor}18`,
                      color: ex.modelColor,
                      border: `1px solid ${ex.modelColor}30`,
                    }}
                  >
                    {ex.model}
                  </span>
                </div>
                <div
                  className="rounded-lg p-3"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <p
                    className="font-mono text-[11px] leading-relaxed"
                    style={{ color: 'var(--code-text, #a78bfa)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                  >
                    {ex.prompt.length > 160
                      ? ex.prompt.slice(0, 157) + '…'
                      : ex.prompt}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden sm:flex flex-col items-center gap-1 px-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Recreated */}
              <div className="flex flex-col gap-2">
                <span
                  className="font-inter text-[10px] font-700 uppercase tracking-widest"
                  style={{ color: '#34d399' }}
                >
                  Recreated
                </span>
                <picture>
                  <source srcSet={ex.recreated} type="image/webp" />
                  <img
                    src={ex.recreated.replace('.webp', '.jpeg')}
                    alt={ex.recreatedAlt}
                    loading="lazy"
                    width="400"
                    height="400"
                    style={{
                      width: '100%',
                      aspectRatio: '4/3',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      display: 'block',
                    }}
                  />
                </picture>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-grotesk text-sm font-700 text-black transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))' }}
        >
          Try It Free — Upload Your Image →
        </a>
      </div>
    </section>
  );
}
