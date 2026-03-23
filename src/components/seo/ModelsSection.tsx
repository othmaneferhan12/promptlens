import { useTranslation } from 'react-i18next';

const models = [
  {
    id: 'midjourney',
    name: 'Midjourney',
    icon: '🎨',
    color: '#e040fb',
    keyword: 'Midjourney Prompt Generator',
    href: '/midjourney-prompt-generator/',
    descKey: 'seo.models.midjourney',
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    icon: '⚡',
    color: '#ff7043',
    keyword: 'Stable Diffusion Prompt Generator',
    href: '/stable-diffusion-prompt-generator/',
    descKey: 'seo.models.stableDiffusion',
  },
  {
    id: 'flux',
    name: 'Flux AI',
    icon: '🌊',
    color: '#00e5ff',
    keyword: 'Flux AI Prompt Generator',
    href: '/flux-prompt-generator/',
    descKey: 'seo.models.flux',
  },
  {
    id: 'dalle3',
    name: 'DALL-E 3',
    icon: '🤖',
    color: '#00c853',
    keyword: 'DALL-E 3 Prompt Generator',
    href: '/dall-e-prompt-generator/',
    descKey: 'seo.models.dalle3',
  },
  {
    id: 'firefly',
    name: 'Adobe Firefly',
    icon: '🔥',
    color: '#ff6d00',
    keyword: 'Adobe Firefly Prompt Generator',
    href: '/adobe-firefly-prompt-generator/',
    descKey: 'seo.models.firefly',
  },
  {
    id: 'leonardo',
    name: 'Leonardo AI',
    icon: '🦁',
    color: '#ffd600',
    keyword: 'Leonardo AI Prompt Generator',
    href: '/leonardo-ai-prompt-generator/',
    descKey: 'seo.models.leonardo',
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    icon: '✏️',
    color: '#7c4dff',
    keyword: 'Ideogram Prompt Generator',
    href: '/ideogram-prompt-generator/',
    descKey: 'seo.models.ideogram',
  },
];

export default function ModelsSection() {
  const { t } = useTranslation();

  return (
    <section
      id="models"
      className="mx-auto max-w-5xl px-4 py-16 sm:px-6"
      aria-labelledby="models-heading"
    >
      <h2
        id="models-heading"
        className="font-grotesk text-2xl font-700 text-[var(--text-primary)] mb-2"
      >
        {t('seo.models.title')}
      </h2>
      <p className="font-inter text-sm text-[var(--text-secondary)] mb-10">
        {t('seo.models.subtitle')}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {models.map((model) => (
          <div
            key={model.id}
            id={model.id}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">{model.icon}</span>
              <h3
                className="font-grotesk text-base font-600"
                style={{ color: model.color }}
              >
                {model.keyword}
              </h3>
            </div>
            <p className="font-inter text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
              {t(model.descKey)}
            </p>
            <a
              href={model.href}
              className="inline-flex items-center gap-1 font-inter text-xs font-600 transition-colors duration-150"
              style={{ color: model.color }}
            >
              {t('seo.models.tryGenerator', { model: model.name })}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
