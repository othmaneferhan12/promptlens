import { useEffect, useRef, useState } from 'react';

// ── Update these numbers manually as your site grows ──────────────────────────
const METRICS = [
  { value: 15000, suffix: '+', label: 'Prompts Generated' },
  { value: 7,     suffix: '',  label: 'AI Models Supported' },
  { value: 4200,  suffix: '+', label: 'Creators Served' },
] as const;
// ─────────────────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(target);

  useEffect(() => {
    if (!active) return;
    setCount(0);
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);

  return count;
}

interface MetricCardProps {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
  index: number;
}

function MetricCard({ value, suffix, label, active, index }: MetricCardProps) {
  const count = useCountUp(value, 2000, active);

  const formatted =
    value >= 1000
      ? count.toLocaleString()
      : count.toString();

  return (
    <div
      className="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 text-center"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative">
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-40"
          style={{ background: 'var(--accent-lens)' }}
        />
        <span
          className="relative font-grotesk text-5xl font-700 tabular-nums"
          style={{
            background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {formatted}{suffix}
        </span>
      </div>
      <span className="font-inter text-sm text-[var(--text-secondary)]">{label}</span>
    </div>
  );
}

export default function MetricsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} aria-label="Usage statistics" className="relative mx-auto max-w-5xl px-4 pb-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        {METRICS.map((m, i) => (
          <MetricCard key={m.label} value={m.value} suffix={m.suffix} label={m.label} active={active} index={i} />
        ))}
      </div>
    </section>
  );
}
