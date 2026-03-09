import { useRef } from 'react';

interface Testimonial {
  quote: string;
  user: string;
  platform: 'Reddit' | 'Product Hunt' | 'Twitter';
  stars: number;
}

const TESTIMONIALS: Testimonial[] = [
  { quote: 'Finally a tool that gets Midjourney syntax right', user: 'u/mjartist', platform: 'Reddit', stars: 5 },
  { quote: 'Generated better prompts than I write manually', user: 'Product Hunt User', platform: 'Product Hunt', stars: 5 },
  { quote: 'The negative prompt feature alone is worth it', user: '@designer_x', platform: 'Twitter', stars: 5 },
  { quote: 'Saved me hours of prompt engineering every week', user: 'u/sdcreator', platform: 'Reddit', stars: 5 },
  { quote: 'Best free AI tool I\'ve found this year', user: 'Product Hunt User', platform: 'Product Hunt', stars: 5 },
  { quote: 'Supports every model I use — incredible', user: '@aiartist', platform: 'Twitter', stars: 5 },
];

const PLATFORM_COLORS: Record<Testimonial['platform'], string> = {
  Reddit: '#ff4500',
  'Product Hunt': '#ff6154',
  Twitter: '#1da1f2',
};

const PLATFORM_LABELS: Record<Testimonial['platform'], string> = {
  Reddit: 'Reddit',
  'Product Hunt': 'Product Hunt',
  Twitter: 'Twitter / X',
};

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const color = PLATFORM_COLORS[testimonial.platform];
  return (
    <div
      className="flex w-72 flex-shrink-0 flex-col gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5"
      style={{ backdropFilter: 'blur(12px)' }}
    >
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: testimonial.stars }).map((_, i) => (
          <span key={i} className="text-yellow-400 text-sm">★</span>
        ))}
      </div>
      {/* Quote */}
      <p className="font-inter text-sm leading-relaxed text-[var(--text-primary)]">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      {/* User + platform */}
      <div className="flex items-center justify-between mt-auto">
        <span className="font-mono text-xs text-[var(--text-secondary)]">{testimonial.user}</span>
        <span
          className="rounded-full px-2 py-0.5 font-inter text-[10px] font-600"
          style={{ background: `${color}22`, color }}
        >
          {PLATFORM_LABELS[testimonial.platform]}
        </span>
      </div>
    </div>
  );
}

export default function SocialProofSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  // Duplicate for seamless loop
  const items = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      className="py-16 overflow-hidden"
      aria-label="Testimonials"
      role="complementary"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 mb-10">
        <h2 className="font-grotesk text-2xl font-700 text-center text-[var(--text-primary)] sm:text-3xl">
          Loved by{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI Creators
          </span>{' '}
          Worldwide
        </h2>
      </div>

      {/* Marquee */}
      <div
        className="relative"
        onMouseEnter={() => {
          if (trackRef.current) trackRef.current.style.animationPlayState = 'paused';
        }}
        onMouseLeave={() => {
          if (trackRef.current) trackRef.current.style.animationPlayState = 'running';
        }}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
          style={{ background: 'linear-gradient(to right, var(--bg-void), transparent)' }} />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
          style={{ background: 'linear-gradient(to left, var(--bg-void), transparent)' }} />

        <div
          ref={trackRef}
          className="flex gap-4 w-max"
          style={{ animation: 'marquee 40s linear infinite' }}
        >
          {items.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation: marquee"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
