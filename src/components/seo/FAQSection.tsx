import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is ImageToPrompt?',
    a: 'ImageToPrompt is a free AI-powered tool that analyzes any image you upload and generates optimized text prompts for AI image generators including Midjourney, Stable Diffusion, Flux, DALL-E 3, Adobe Firefly, Leonardo AI, and Ideogram. No account or login is required.',
  },
  {
    q: 'How many images can I analyze for free?',
    a: 'ImageToPrompt is completely free with 10 analyses per day. Your daily limit resets at midnight. The usage counter in the top-right corner of the app shows how many analyses you have remaining today.',
  },
  {
    q: 'What AI models does ImageToPrompt support?',
    a: 'ImageToPrompt generates prompts optimized for 7 AI image generators: Midjourney (with --ar and --v 6.1 parameters), Stable Diffusion (with weighted syntax), Flux AI, DALL-E 3, Adobe Firefly, Leonardo AI, and Ideogram. Select your model before generating to get model-specific syntax.',
  },
  {
    q: 'What is a negative prompt and why do I need one?',
    a: "A negative prompt tells your AI image generator what to exclude from the output — common examples include 'blurry, low quality, watermark, deformed'. ImageToPrompt automatically generates a negative prompt alongside your main prompt for every analysis.",
  },
  {
    q: 'What image formats does ImageToPrompt accept?',
    a: 'ImageToPrompt accepts JPG, PNG, WEBP, and GIF images up to 5MB. You can upload via drag and drop, file picker, or paste directly from your clipboard with Ctrl+V.',
  },
  {
    q: 'How accurate are the generated prompts?',
    a: 'ImageToPrompt uses Claude AI vision to analyze images, providing a confidence score with every prompt. The AI identifies subject, composition, lighting, color palette, mood, and style — then formats the prompt specifically for your chosen AI model.',
  },
  {
    q: 'Is my uploaded image stored or saved?',
    a: 'No. Your images are processed in real time and never stored on our servers. The image is sent directly to Claude AI for analysis and immediately discarded. We only store your prompt history locally in your browser.',
  },
  {
    q: 'What is the remix prompt feature?',
    a: "Every analysis includes a 'Creative Remix' prompt — an alternative, creatively reimagined version of the main prompt. It keeps the core subject and mood but adds unexpected artistic twists, giving you two distinct creative directions from a single image.",
  },
  {
    q: 'Can I use ImageToPrompt on mobile?',
    a: 'Yes. ImageToPrompt is fully responsive and works on all screen sizes from mobile phones to widescreen monitors. You can upload images directly from your phone camera roll.',
  },
  {
    q: 'What prompt styles are available?',
    a: 'ImageToPrompt offers 6 style modes: Cinematic (dramatic film-grade), Technical (hyper-realistic precision), Artistic (painterly and stylized), Minimal (clean and essence-focused), Epic (grand atmospheric scale), and Photographic (camera specs and lens language).',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border-subtle)]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-grotesk text-sm font-600 text-[var(--text-primary)] pr-4">{q}</span>
        <ChevronDown
          size={16}
          className="shrink-0 text-[var(--text-secondary)] transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <p className="pb-4 font-inter text-sm text-[var(--text-secondary)] leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQSection() {
  // Inject FAQ schema into <head>
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      document.getElementById('faq-schema')?.remove();
    };
  }, []);

  return (
    <section
      id="faq"
      className="mx-auto max-w-5xl px-4 py-16 sm:px-6"
      aria-labelledby="faq-heading"
    >
      <h2
        id="faq-heading"
        className="font-grotesk text-2xl font-700 text-[var(--text-primary)] mb-2"
      >
        Frequently Asked Questions
      </h2>
      <p className="font-inter text-sm text-[var(--text-secondary)] mb-8">
        Everything you need to know about generating AI prompts from images.
      </p>
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-6">
        {faqs.map((faq) => (
          <FAQItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>
    </section>
  );
}
