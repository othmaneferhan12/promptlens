export default function SEOFooter() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-card)] mt-8">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* Brand + description */}
        <div className="mb-8">
          <p className="font-grotesk text-sm font-600 text-[var(--text-primary)] mb-2">
            ImageTo<span style={{ color: 'var(--accent-lens)' }}>Prompt</span>
          </p>
          <p className="font-inter text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            ImageToPrompt is a free AI image-to-prompt generator powered by Claude AI vision. Upload any
            photo and instantly get optimized prompts for Midjourney, Stable Diffusion, Flux, DALL-E
            3, Adobe Firefly, Leonardo AI, and Ideogram. No login required. 10 free analyses per
            day.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mb-8">
          {/* Navigation */}
          <div>
            <p className="font-grotesk text-xs font-600 uppercase tracking-wider text-[var(--text-secondary)] mb-3">
              Navigation
            </p>
            <nav className="flex flex-col gap-2" aria-label="Site sections">
              {[
                { href: '#tool', label: 'Image to Prompt Generator' },
                { href: '#how-it-works', label: 'How It Works' },
                { href: '#models', label: 'Supported AI Models' },
                { href: '#examples', label: 'Prompt Examples' },
                { href: '#faq', label: 'FAQ' },
                { href: '/blog/', label: 'Blog & Guides' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-inter text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Models */}
          <div>
            <p className="font-grotesk text-xs font-600 uppercase tracking-wider text-[var(--text-secondary)] mb-3">
              Prompt Generators
            </p>
            <nav className="flex flex-col gap-2" aria-label="Model prompt generators">
              {[
                { href: '/midjourney-prompt-generator/', label: 'Midjourney Prompt Generator' },
                { href: '/stable-diffusion-prompt-generator/', label: 'Stable Diffusion Prompt Generator' },
                { href: '/flux-prompt-generator/', label: 'Flux AI Prompt Generator' },
                { href: '/dall-e-prompt-generator/', label: 'DALL-E 3 Prompt Generator' },
                { href: '/adobe-firefly-prompt-generator/', label: 'Adobe Firefly Prompt Generator' },
                { href: '/leonardo-ai-prompt-generator/', label: 'Leonardo AI Prompt Generator' },
                { href: '/ideogram-prompt-generator/', label: 'Ideogram Prompt Generator' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-inter text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Features */}
          <div>
            <p className="font-grotesk text-xs font-600 uppercase tracking-wider text-[var(--text-secondary)] mb-3">
              Features
            </p>
            <ul className="flex flex-col gap-2">
              {[
                'Image to prompt conversion',
                'Negative prompt generation',
                'Color palette extraction',
                'Lighting & mood analysis',
                'Creative remix prompts',
                'Prompt history (local)',
                '10 free analyses per day',
              ].map((f) => (
                <li key={f} className="font-inter text-sm text-[var(--text-secondary)]">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-inter text-xs text-[var(--text-secondary)]/50">
            ImageToPrompt does not store your images. All analysis is ephemeral and private.
          </p>
          <nav className="flex gap-4 items-center" aria-label="Legal links">
            <a href="/privacy-policy/" className="font-inter text-xs text-[var(--text-secondary)]/50 hover:text-[var(--text-secondary)] transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service/" className="font-inter text-xs text-[var(--text-secondary)]/50 hover:text-[var(--text-secondary)] transition-colors">
              Terms of Service
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
