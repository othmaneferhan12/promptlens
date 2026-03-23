import { useTranslation } from 'react-i18next';

export default function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    {
      number: '1',
      title: t('seo.howItWorks.step1Title'),
      body: t('seo.howItWorks.step1Body'),
    },
    {
      number: '2',
      title: t('seo.howItWorks.step2Title'),
      body: t('seo.howItWorks.step2Body'),
    },
    {
      number: '3',
      title: t('seo.howItWorks.step3Title'),
      body: t('seo.howItWorks.step3Body'),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-5xl px-4 py-16 sm:px-6"
      aria-labelledby="how-it-works-heading"
    >
      <h2
        id="how-it-works-heading"
        className="font-grotesk text-2xl font-700 text-[var(--text-primary)] mb-2"
      >
        {t('seo.howItWorks.title')}
      </h2>
      <p className="font-inter text-sm text-[var(--text-secondary)] mb-10">
        {t('seo.howItWorks.subtitle')}
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6"
          >
            <div
              className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full font-grotesk text-sm font-700 text-black"
              style={{ background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))' }}
            >
              {step.number}
            </div>
            <h3 className="font-grotesk text-base font-600 text-[var(--text-primary)] mb-2">
              {step.title}
            </h3>
            <p className="font-inter text-sm text-[var(--text-secondary)] leading-relaxed">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
