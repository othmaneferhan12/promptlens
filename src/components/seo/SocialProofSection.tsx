import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Testimonial {
  quoteKey: string;
  userKey: string;
  platform: 'Reddit' | 'Product Hunt' | 'Twitter';
  stars: number;
}

const TESTIMONIALS: Testimonial[] = [
  { quoteKey: 'seo.social.t1.text', userKey: 'seo.social.t1.author', platform: 'Reddit', stars: 5 },
  { quoteKey: 'seo.social.t2.text', userKey: 'seo.social.t2.author', platform: 'Product Hunt', stars: 5 },
  { quoteKey: 'seo.social.t3.text', userKey: 'seo.social.t3.author', platform: 'Twitter', stars: 5 },
  { quoteKey: 'seo.social.t4.text', userKey: 'seo.social.t4.author', platform: 'Reddit', stars: 5 },
  { quoteKey: 'seo.social.t5.text', userKey: 'seo.social.t5.author', platform: 'Product Hunt', stars: 5 },
  { quoteKey: 'seo.social.t6.text', userKey: 'seo.social.t6.author', platform: 'Twitter', stars: 5 },
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

function TestimonialCard({ testimonial }: { testimonial: Testimonial & { quote: string; user: string } }) {
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
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  const resolvedTestimonials = TESTIMONIALS.map((tm) => ({
    ...tm,
    quote: t(tm.quoteKey),
    user: t(tm.userKey),
  }));

  // Duplicate for seamless loop
  const items = [...resolvedTestimonials, ...resolvedTestimonials];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 overflow-hidden"
      aria-label="Testimonials"
      role="complementary"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 mb-10">
        <h2 className="font-grotesk text-2xl font-700 text-center text-[var(--text-primary)] sm:text-3xl">
          {t('seo.social.lovedBy')}{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('seo.social.highlight')}
          </span>{' '}
          {t('seo.social.worldwide')}
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
          style={{ animation: inView ? 'marquee 40s linear infinite' : 'none' }}
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
      `}</style>
    </section>
  );
}
