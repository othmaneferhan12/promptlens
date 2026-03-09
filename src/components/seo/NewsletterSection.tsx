import { useState } from 'react';

const STORAGE_KEY = 'imagetoprompt_newsletter_email';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(() => {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    try {
      localStorage.setItem(STORAGE_KEY, email);
    } catch {
      // ignore
    }
    setSubmitted(true);
  };

  return (
    <section
      className="py-16"
      aria-label="Newsletter signup"
      role="complementary"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 text-center"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          {submitted ? (
            <div className="space-y-2">
              <p className="font-grotesk text-2xl font-700 text-[var(--text-primary)]">
                You&apos;re in! 🎉
              </p>
              <p className="font-inter text-sm text-[var(--text-secondary)]">
                Check your inbox for your first prompt templates.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 space-y-2">
                <h2 className="font-grotesk text-2xl font-700 text-[var(--text-primary)] sm:text-3xl">
                  Get{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    10 Pro Prompt Templates
                  </span>{' '}
                  Every Week
                </h2>
                <p className="font-inter text-sm text-[var(--text-secondary)]">
                  Free. No spam. Unsubscribe anytime.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row" noValidate>
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="your@email.com"
                  autoComplete="email"
                  aria-describedby={error ? 'newsletter-error' : undefined}
                  className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-void)] px-4 py-3 font-inter text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none transition-colors focus:border-[var(--accent-lens)]"
                />
                <button
                  type="submit"
                  className="rounded-xl px-6 py-3 font-grotesk text-sm font-700 text-black transition-opacity hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
                  }}
                >
                  Subscribe Free
                </button>
              </form>

              {error && (
                <p id="newsletter-error" role="alert" className="mt-2 font-inter text-xs text-[var(--error)]">
                  {error}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
