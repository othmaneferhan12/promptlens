import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

const EXAMPLES = [
  {
    image: '/images/ai-prompt-golden-hour-lighting-example.webp',
    label: 'Golden Hour',
    prompt:
      'Cinematic portrait, golden hour rim lighting, shallow depth of field, warm amber tones, film grain, soft bokeh background --ar 2:3 --v 6.1 --style raw',
  },
  {
    image: '/images/ai-prompt-oil-painting-style-example.webp',
    label: 'Oil Painting',
    prompt:
      'Classical oil painting style, rich impasto brushstrokes, Renaissance-inspired composition, warm earth tones, dramatic chiaroscuro lighting, gallery-quality fine art',
  },
  {
    image: '/images/compare1-mj.webp',
    label: 'Digital Art',
    prompt:
      '(masterpiece:1.2), highly detailed digital art, cinematic composition, volumetric lighting, vibrant color palette, epic atmosphere, 8k ultra HD',
  },
  {
    image: '/images/ex3-recreated.webp',
    label: 'Retro Illustration',
    prompt:
      'Retro mid-century modern scene, pastel color palette, dreamy nostalgic atmosphere, soft gradients, stylized illustration, vintage travel poster aesthetic',
  },
  {
    image: '/images/prompt-engineering-basic-cat-garden.webp',
    label: 'Watercolor',
    prompt:
      'Fluffy orange tabby cat sitting among wildflowers in an English cottage garden, watercolor illustration, golden hour sunlight, dappled light through trees',
  },
];

const N = EXAMPLES.length;

function getCardAnimate(dist: number, isExiting: boolean) {
  if (isExiting) {
    return { x: -260, y: -12, scale: 0.88, opacity: 0, rotate: -7 };
  }
  switch (dist) {
    case 0: return { x: 0,  y: 0,  scale: 1,    opacity: 1,    rotate: 0 };
    case 1: return { x: 12, y: 9,  scale: 0.95, opacity: 0.65, rotate: 1.2 };
    case 2: return { x: 22, y: 16, scale: 0.9,  opacity: 0.35, rotate: 2.2 };
    default: return { x: 30, y: 22, scale: 0.86, opacity: 0,   rotate: 3 };
  }
}

export default function ShowcasePanel() {
  const [active, setActive] = useState(0);
  const [exiting, setExiting] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  // Stable refs so advance() needs no deps and doesn't recreate the interval
  const activeRef = useRef(active);
  const exitingRef = useRef(exiting);
  activeRef.current = active;
  exitingRef.current = exiting;

  const advance = useCallback(() => {
    if (exitingRef.current !== null) return;
    const cur = activeRef.current;
    setExiting(cur);
    setActive((cur + 1) % N);
    setTimeout(() => setExiting(null), 560);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(advance, 2500);
    return () => clearInterval(id);
  }, [paused, advance]);

  const handleDotClick = (i: number) => {
    if (i === activeRef.current || exitingRef.current !== null) return;
    const cur = activeRef.current;
    setExiting(cur);
    setActive(i);
    setPaused(true);
    setTimeout(() => {
      setExiting(null);
      setPaused(false);
    }, 8000);
  };

  return (
    <motion.div
      className="rounded-2xl flex flex-col h-full"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(12px)',
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full" style={{ background: '#FF5F57' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#FEBC2E' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#28C840' }} />
        </div>
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1 font-inter text-xs font-500"
          style={{ background: 'rgba(224,64,251,0.12)', color: '#e040fb', border: '1px solid rgba(224,64,251,0.25)' }}
        >
          <span>✨</span>
          <span>Showcase Examples</span>
        </div>
      </div>

      {/* Card stack area */}
      <div className="relative flex-1 overflow-hidden p-4">
        {EXAMPLES.map((ex, idx) => {
          const dist = (idx - active + N) % N;
          const isExiting = idx === exiting;
          const animate = getCardAnimate(dist, isExiting);

          // Only render cards that are visible (dist 0-2) or currently exiting
          if (dist > 2 && !isExiting) return null;

          const showContent = dist === 0 || isExiting;

          return (
            <motion.div
              key={idx}
              style={{
                position: 'absolute',
                inset: 16,
                borderRadius: 12,
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-elevated)',
                zIndex: isExiting ? 20 : 13 - dist,
                transformOrigin: 'top left',
                overflow: 'hidden',
              }}
              animate={animate}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              {showContent && (
                <div className="flex flex-col h-full p-3">
                  {/* Image */}
                  <div className="overflow-hidden rounded-xl flex-1 min-h-[160px]">
                    <picture>
                      <source srcSet={ex.image} type="image/webp" />
                      <img
                        src={ex.image.replace('.webp', '.jpeg')}
                        alt={`Example: ${ex.label}`}
                        className="w-full h-full object-cover rounded-xl"
                        loading={idx === 0 && dist === 0 ? 'eager' : 'lazy'}
                        fetchPriority={idx === 0 && dist === 0 ? 'high' : 'auto'}
                        width="400"
                        height="300"
                      />
                    </picture>
                  </div>

                  {/* Label row */}
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 font-inter text-xs font-500"
                      style={{ background: 'var(--bg-card-hover)', color: 'var(--text-secondary)' }}
                    >
                      {ex.label}
                    </span>
                    <span className="font-inter text-xs" style={{ color: 'var(--text-muted)' }}>
                      Generated prompt ↓
                    </span>
                  </div>

                  {/* Prompt */}
                  <p
                    className="mt-2 font-inter text-sm italic leading-relaxed line-clamp-3"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    &ldquo;{ex.prompt}&rdquo;
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 py-3 shrink-0">
        {EXAMPLES.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            aria-label={`Show example ${i + 1}: ${EXAMPLES[i].label}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? '20px' : '6px',
              height: '6px',
              background: i === active ? 'var(--accent-lens)' : 'var(--border-mid, rgba(255,255,255,0.22))',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
