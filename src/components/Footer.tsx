export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border-subtle)] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-grotesk text-sm font-600 text-[var(--text-primary)]">
              Prompt<span style={{ color: 'var(--accent-lens)' }}>Lens</span>
            </span>
            <span className="font-inter text-xs text-[var(--text-secondary)]">
              — AI Image Prompt Engineer
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-inter text-xs text-[var(--text-secondary)]">
              100% Free · Powered by Claude Vision
            </span>
            <div className="h-1 w-1 rounded-full bg-[var(--text-secondary)]/30" />
            <span className="font-mono text-[10px] text-[var(--text-secondary)]/50">
              v1.0.0
            </span>
          </div>
        </div>
        <p className="mt-4 text-center font-inter text-[10px] text-[var(--text-secondary)]/40">
          ImageToPrompt does not store your images. All analysis is ephemeral and private.
        </p>
      </div>
    </footer>
  );
}
