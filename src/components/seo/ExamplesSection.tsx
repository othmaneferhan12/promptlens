import { useTranslation } from 'react-i18next';

const examples = [
  {
    model: 'Midjourney',
    style: 'Cinematic',
    imageDescKey: 'seo.examples.desc1',
    prompt:
      'Weathered Norwegian fisherman on a misty fjord dock at dawn, deep wrinkles, bright orange rain gear, coiling rope in hands, photojournalism style, Hasselblad medium format, authentic character portrait --ar 2:3 --style raw --v 6.1',
    negative: 'flat lighting, oversaturated, tourist photo, studio backdrop',
  },
  {
    model: 'Stable Diffusion',
    style: 'Photographic',
    imageDescKey: 'seo.examples.desc2',
    prompt:
      '(masterpiece:1.2), (photorealistic:1.1), cyberpunk city street at midnight, rain-slicked ground reflecting neon signs in pink and blue, dense crowd with umbrellas, street food stalls glowing orange, towering skyscrapers with holographic ads, cinematic wide angle',
    negative: '(deformed:1.4), blurry, watermark, text, ugly, low quality',
  },
  {
    model: 'Flux',
    style: 'Technical',
    imageDescKey: 'seo.examples.desc3',
    prompt:
      'Interior of a futurist cathedral made of white concrete and glass, dramatic shafts of light from clerestory windows, minimal altar, soaring 40-meter vaulted ceiling, architectural photography, Tadao Ando inspired',
    negative: 'distorted perspective, lens distortion, people, cars, noise',
  },
  {
    model: 'DALL-E 3',
    style: 'Artistic',
    imageDescKey: 'seo.examples.desc4',
    prompt:
      'Dramatic oil painting of a stormy ocean cliff at sunset, crashing waves below, lone lighthouse in the distance, rich impasto texture, Rembrandt chiaroscuro lighting, classical masterwork, in ornate golden frame',
    negative: '',
  },
];

export default function ExamplesSection() {
  const { t } = useTranslation();

  return (
    <section
      id="examples"
      className="mx-auto max-w-5xl px-4 py-16 sm:px-6"
      aria-labelledby="examples-heading"
    >
      <h2
        id="examples-heading"
        className="font-grotesk text-2xl font-700 text-[var(--text-primary)] mb-2"
      >
        {t('seo.examples.title')}
      </h2>
      <p className="font-inter text-sm text-[var(--text-secondary)] mb-10">
        {t('seo.examples.subtitle')}
      </p>
      <div className="space-y-6">
        {examples.map((ex) => (
          <div
            key={ex.imageDescKey}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6"
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="rounded-full border border-[var(--border-subtle)] px-2.5 py-1 font-mono text-[11px] text-[var(--text-secondary)]">
                {ex.model}
              </span>
              <span className="rounded-full border border-[var(--border-subtle)] px-2.5 py-1 font-mono text-[11px] text-[var(--text-secondary)]">
                {ex.style}
              </span>
              <span className="font-inter text-xs text-[var(--text-secondary)]">
                — {t(ex.imageDescKey)}
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                  {t('seo.examples.mainPrompt')}
                </p>
                <p className="font-mono text-sm text-[var(--text-primary)] leading-relaxed break-words">
                  {ex.prompt}
                </p>
              </div>
              {ex.negative && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--error)]/70 mb-1">
                    {t('seo.examples.negativePrompt')}
                  </p>
                  <p className="font-mono text-sm text-[var(--error)]/80 leading-relaxed">
                    {ex.negative}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
