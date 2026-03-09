export default function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Upload Your Image',
      body: 'Drag and drop any image, paste from clipboard with Ctrl+V, or click to browse. ImageToPrompt accepts JPG, PNG, WEBP, and GIF files up to 5MB. Our AI analyzes your image instantly — no account required.',
    },
    {
      number: '2',
      title: 'Select Your AI Model',
      body: 'Choose from 7 major AI image generators: Midjourney, Stable Diffusion, Flux, DALL-E 3, Adobe Firefly, Leonardo AI, or Ideogram. Each model gets a prompt written specifically in its syntax and style.',
    },
    {
      number: '3',
      title: 'Get Your Perfect Prompt',
      body: 'Powered by Claude AI vision, ImageToPrompt generates a complete prompt including the main description, negative prompt, style tags, color palette, lighting analysis, and model-specific parameters — ready to copy and paste.',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-5xl px-4 py-16 sm:px-6"
      aria-labelledby="how-it-works-heading"
    >
      <h2
        id="how-it-works-heading"
        className="font-grotesk text-2xl font-700 text-[var(--text-primary)] mb-2"
      >
        How ImageToPrompt Works
      </h2>
      <p className="font-inter text-sm text-[var(--text-secondary)] mb-10">
        Turn any image into a ready-to-use AI generation prompt in three steps.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6"
          >
            <div
              className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full font-grotesk text-sm font-700 text-black"
              style={{ background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))' }}
            >
              {step.number}
            </div>
            <h3 className="font-grotesk text-base font-600 text-[var(--text-primary)] mb-2">
              {step.title}
            </h3>
            <p className="font-inter text-sm text-[var(--text-secondary)] leading-relaxed">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
