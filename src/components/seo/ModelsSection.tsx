const models = [
  {
    id: 'midjourney',
    name: 'Midjourney',
    icon: '🎨',
    color: '#e040fb',
    keyword: 'Midjourney Prompt Generator',
    description:
      'Generate Midjourney prompts from any image instantly. Our AI creates prompts with proper --ar aspect ratio, --v 6.1 version, --style raw parameters and artistic descriptors that Midjourney understands. Perfect for artists wanting to recreate or remix reference images.',
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    icon: '⚡',
    color: '#ff7043',
    keyword: 'Stable Diffusion Prompt Generator',
    description:
      'Create Stable Diffusion prompts with proper (weighted:syntax) formatting. Includes negative prompts optimized for SD models to eliminate unwanted artifacts. Works with SD 1.5, SD XL, and SD 3.5.',
  },
  {
    id: 'flux',
    name: 'Flux AI',
    icon: '🌊',
    color: '#00e5ff',
    keyword: 'Flux AI Prompt Generator',
    description:
      'Generate highly detailed Flux AI prompts that maximize the model\'s photorealistic capabilities. Our prompts include precise lighting, texture, and composition descriptors that Flux responds to best.',
  },
  {
    id: 'dalle3',
    name: 'DALL-E 3',
    icon: '🤖',
    color: '#00c853',
    keyword: 'DALL-E 3 Prompt Generator',
    description:
      'Convert any image into natural language DALL-E 3 prompts. We format prompts as descriptive sentences that OpenAI\'s model interprets accurately, preserving style, mood, and composition.',
  },
  {
    id: 'firefly',
    name: 'Adobe Firefly',
    icon: '🔥',
    color: '#ff6d00',
    keyword: 'Adobe Firefly Prompt Generator',
    description:
      'Generate commercially safe Adobe Firefly prompts from reference images. Our prompts avoid copyrighted styles and use Firefly-compatible language perfect for professional and commercial use.',
  },
  {
    id: 'leonardo',
    name: 'Leonardo AI',
    icon: '🦁',
    color: '#ffd600',
    keyword: 'Leonardo AI Prompt Generator',
    description:
      'Create Leonardo AI prompts optimized for game art, fantasy scenes, and character design. Our AI extracts artistic style elements and translates them into Leonardo-specific vocabulary.',
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    icon: '✏️',
    color: '#7c4dff',
    keyword: 'Ideogram Prompt Generator',
    description:
      'Generate Ideogram prompts that preserve text elements, typography style, and graphic design components from your reference image. Ideal for designers working with text-in-image generation.',
  },
];

export default function ModelsSection() {
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
        Supported AI Image Models
      </h2>
      <p className="font-inter text-sm text-[var(--text-secondary)] mb-10">
        Every model gets a prompt written in its specific syntax — not a generic description.
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
            <p className="font-inter text-sm text-[var(--text-secondary)] leading-relaxed">
              {model.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
