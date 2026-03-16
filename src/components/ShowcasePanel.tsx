import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EXAMPLES = [
  {
    image: '/images/mj-fantasy-library.jpeg',
    label: 'Fantasy Scene',
    prompt:
      'A vast ancient library carved into living stone, towering bookshelves ascending into misty darkness, warm amber lanterns casting pools of golden light, dust motes drifting through shafts of ethereal blue illumination, a lone scholar studying at an ornate wooden desk — cinematic, ultra-detailed, 8K, Midjourney v6',
  },
  {
    image: '/images/mj-portrait-fisherman.jpeg',
    label: 'Portrait',
    prompt:
      'Weathered fisherman portrait, deep-set ocean-grey eyes reflecting decades of sea voyages, salt-and-pepper stubble, worn oilskin jacket, dramatic side lighting from a stormy horizon, shallow depth of field, bokeh harbour background — editorial photography, f/1.4, Nikon Z9, photorealistic',
  },
  {
    image: '/images/mj-product-perfume.jpeg',
    label: 'Product Shot',
    prompt:
      'Luxury perfume bottle on black marble, dramatic studio lighting with sharp specular highlights, translucent amber liquid visible through crystal glass, soft violet smoke tendrils curling upward, depth-of-field blur on dark velvet — commercial photography, Hasselblad medium format, 4K',
  },
  {
    image: '/images/mj-abstract-paint.jpeg',
    label: 'Abstract Art',
    prompt:
      'Abstract expressionist painting, bold gestural brushstrokes of cobalt blue and burnt sienna colliding in dynamic tension, impasto texture creating sculptural relief, gold leaf accents catching gallery light, emotional turbulence rendered through pure colour and form — oil on canvas, large format, museum quality',
  },
  {
    image: '/images/mj-architecture-cathedral.jpeg',
    label: 'Architecture',
    prompt:
      'Gothic cathedral interior bathed in divine light streaming through rose windows, intricate stone ribbed vaulting arching overhead, kaleidoscopic stained glass casting prismatic reflections on ancient limestone floors, atmospheric haze softening the distant choir — long exposure, tilt-shift lens, golden hour',
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
