import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EXAMPLES = [
  {
    image: '/images/pair2-golden-hour.jpeg',
    label: 'Golden Hour',
    prompt:
      'Cinematic portrait, golden hour rim lighting, shallow depth of field, warm amber tones, film grain, soft bokeh background --ar 2:3 --v 6.1 --style raw',
  },
  {
    image: '/images/pair3-oil-painting.jpeg',
    label: 'Oil Painting',
    prompt:
      'Classical oil painting style, rich impasto brushstrokes, Renaissance-inspired composition, warm earth tones, dramatic chiaroscuro lighting, gallery-quality fine art',
  },
  {
    image: '/images/compare1-mj.jpeg',
    label: 'Digital Art',
    prompt:
      '(masterpiece:1.2), highly detailed digital art, cinematic composition, volumetric lighting, vibrant color palette, epic atmosphere, 8k ultra HD',
  },
  {
    image: '/images/ex3-recreated.jpeg',
    label: 'Retro Illustration',
    prompt:
      'Retro mid-century modern scene, pastel color palette, dreamy nostalgic atmosphere, soft gradients, stylized illustration, vintage travel poster aesthetic',
  },
  {
    image: '/images/stage1-cat.jpeg',
    label: 'Watercolor',
    prompt:
      'Fluffy orange tabby cat sitting among wildflowers in an English cottage garden, watercolor illustration, golden hour sunlight, dappled light through trees',
  },
];

export default function ShowcasePanel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((p) => (p + 1) % EXAMPLES.length), 4000);
    return () => clearInterval(id);
  }, [paused]);

  const handleDotClick = (i: number) => {
    setActive(i);
    setPaused(true);
    // Resume auto-slide after 8s of inactivity
    const t = setTimeout(() => setPaused(false), 8000);
    return () => clearTimeout(t);
  };

  return (
    <motion.div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(12px)',
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Title bar with macOS dots + badge */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full" style={{ background: '#FF5F57' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#FEBC2E' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#28C840' }} />
        </div>
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1 font-inter text-xs font-500"
          style={{
            background: 'rgba(224,64,251,0.12)',
            color: '#e040fb',
            border: '1px solid rgba(224,64,251,0.25)',
          }}
        >
          <span>✨</span>
          <span>Showcase Examples</span>
        </div>
      </div>

      {/* Sliding content */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.32, ease: 'easeInOut' }}
            className="p-4"
          >
            {/* Image */}
            <div className="overflow-hidden rounded-xl">
              <img
                src={EXAMPLES[active].image}
                alt={`Example: ${EXAMPLES[active].label}`}
                className="w-full object-cover rounded-xl"
                style={{ height: '220px', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>

            {/* Label pill */}
            <div className="mt-3 flex items-center gap-2">
              <span
                className="rounded-full px-2.5 py-0.5 font-inter text-xs font-500"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}
              >
                {EXAMPLES[active].label}
              </span>
              <span
                className="font-inter text-xs"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                Generated prompt ↓
              </span>
            </div>

            {/* Prompt text — 4-line clamp */}
            <p
              className="mt-2 font-inter text-sm italic leading-relaxed line-clamp-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              &ldquo;{EXAMPLES[active].prompt}&rdquo;
            </p>
          </motion.div>
        </AnimatePresence>
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
              background: i === active ? '#e040fb' : 'rgba(255,255,255,0.22)',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
