import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

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
  const { t } = useTranslation();

  const faqs = [
    { q: t('seo.faq.q1'), a: t('seo.faq.a1') },
    { q: t('seo.faq.q2'), a: t('seo.faq.a2') },
    { q: t('seo.faq.q3'), a: t('seo.faq.a3') },
    { q: t('seo.faq.q4'), a: t('seo.faq.a4') },
    { q: t('seo.faq.q5'), a: t('seo.faq.a5') },
    { q: t('seo.faq.q6'), a: t('seo.faq.a6') },
    { q: t('seo.faq.q7'), a: t('seo.faq.a7') },
    { q: t('seo.faq.q8'), a: t('seo.faq.a8') },
    { q: t('seo.faq.q9'), a: t('seo.faq.a9') },
    { q: t('seo.faq.q10'), a: t('seo.faq.a10') },
  ];

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
        {t('seo.faq.title')}
      </h2>
      <p className="font-inter text-sm text-[var(--text-secondary)] mb-8">
        {t('seo.faq.subtitle')}
      </p>
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-6">
        {faqs.map((faq) => (
          <FAQItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>
    </section>
  );
}
