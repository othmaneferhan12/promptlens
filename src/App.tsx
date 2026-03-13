import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ModelSelector from './components/ModelSelector';
import StyleSelector from './components/StyleSelector';
import { useImageAnalysis } from './hooks/useImageAnalysis';
import { useRateLimit } from './hooks/useRateLimit';
import { usePromptHistory } from './hooks/usePromptHistory';
import type { UploadedImage, AIModel, PromptStyle, SupportedLanguage, AnalysisResult as AnalysisResultType, HistoryItem } from './types';

// Lazy-load framer-motion dependents and modal components
const AnalysisResult = lazy(() => import('./components/AnalysisResult'));
const LoadingState = lazy(() => import('./components/LoadingState'));
const RateLimitModal = lazy(() => import('./components/RateLimitModal'));
const PromptHistory = lazy(() => import('./components/PromptHistory'));
const ChangelogPage = lazy(() => import('./components/ChangelogPage'));
const HowItWorksSection = lazy(() => import('./components/seo/HowItWorksSection'));
const BeforeAfterSection = lazy(() => import('./components/seo/BeforeAfterSection'));
const MetricsSection = lazy(() => import('./components/seo/MetricsSection'));
const SocialProofSection = lazy(() => import('./components/seo/SocialProofSection'));
const ModelsSection = lazy(() => import('./components/seo/ModelsSection'));
const FAQSection = lazy(() => import('./components/seo/FAQSection'));
const ExamplesSection = lazy(() => import('./components/seo/ExamplesSection'));
const NewsletterSection = lazy(() => import('./components/seo/NewsletterSection'));
const SEOFooter = lazy(() => import('./components/seo/SEOFooter'));

// Detect embed mode and pre-selected model from URL params
const _urlParams = new URLSearchParams(window.location.search);
const isEmbed = _urlParams.get('embed') === 'true';
const _urlModel = _urlParams.get('model') as AIModel | null;
const VALID_MODELS: AIModel[] = ['midjourney', 'stable-diffusion', 'flux', 'dalle3', 'firefly', 'leonardo', 'ideogram'];
const initialModel: AIModel = (_urlModel && VALID_MODELS.includes(_urlModel)) ? _urlModel : 'midjourney';

export default function App() {
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel>(initialModel);
  const [selectedStyle, setSelectedStyle] = useState<PromptStyle>('cinematic');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [activeResult, setActiveResult] = useState<AnalysisResultType | null>(null);

  const { result, isLoading, error, analyze, reset: resetAnalysis } = useImageAnalysis();
  const rateLimit = useRateLimit();
  const { history, addToHistory, clearHistory, removeItem } = usePromptHistory();

  useEffect(() => {
    if (result) setActiveResult(result);
  }, [result]);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'v' && !currentImage) {
        try {
          const items = await navigator.clipboard.read();
          for (const item of items) {
            const imageType = item.types.find((t) => t.startsWith('image/'));
            if (imageType) break;
          }
        } catch {
          // ignore
        }
      }
      if (e.ctrlKey && e.key === 'Enter') {
        if (currentImage && !isLoading && !activeResult) handleAnalyze();
      }
      if (e.key === 'Escape' && !showHistory && !showRateLimitModal && !showChangelog) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImage, isLoading, activeResult, showHistory, showRateLimitModal, showChangelog]);

  const handleAnalyze = useCallback(async () => {
    if (!currentImage || isLoading) return;
    if (!rateLimit.canAnalyze) {
      setShowRateLimitModal(true);
      return;
    }
    rateLimit.incrementUsage();
    const analysisResult = await analyze({
      base64: currentImage.base64,
      mediaType: currentImage.mediaType,
      model: selectedModel,
      style: selectedStyle,
      language: selectedLanguage,
    });
    if (analysisResult) {
      setActiveResult(analysisResult);
      await addToHistory(
        currentImage.previewUrl,
        selectedModel,
        selectedStyle,
        analysisResult,
        currentImage.name
      );
    }
  }, [currentImage, isLoading, rateLimit, analyze, selectedModel, selectedStyle, addToHistory]);

  const handleReset = useCallback(() => {
    setCurrentImage(null);
    setActiveResult(null);
    resetAnalysis();
  }, [resetAnalysis]);

  const handleRestoreFromHistory = useCallback(
    (restoredResult: AnalysisResultType, item: HistoryItem) => {
      setActiveResult(restoredResult);
      setSelectedModel(item.model);
      setSelectedStyle(item.style);
    },
    []
  );

  const showResult = !!activeResult && !isLoading;
  const showUpload = !activeResult && !isLoading;

  // ── Embed mode ──────────────────────────────────────────────────────────────
  if (isEmbed) {
    return (
      <div className="min-h-screen bg-[var(--bg-void)]">
        <main className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6" role="main">
          {showUpload && (
            <div className="space-y-6">
              <UploadZone onImageReady={setCurrentImage} onClear={handleReset} currentImage={currentImage} />
              <ModelSelector selected={selectedModel} onChange={setSelectedModel} />
              <StyleSelector selected={selectedStyle} onChange={setSelectedStyle} />
              {error && !isLoading && (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3" role="alert" aria-live="polite">
                  <span className="text-[var(--error)]" aria-hidden="true">⚠</span>
                  <p className="font-inter text-sm text-[var(--error)]">{error}</p>
                </div>
              )}
              <div className="flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={!currentImage || isLoading || !rateLimit.canAnalyze}
                  className="rounded-2xl px-8 py-3 font-grotesk text-base font-700 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))' }}
                >
                  Generate Prompt
                </button>
              </div>
            </div>
          )}
          <Suspense fallback={null}>
            {isLoading && currentImage && <LoadingState previewUrl={currentImage.previewUrl} />}
          </Suspense>
          <Suspense fallback={null}>
            {showResult && activeResult && (
              <AnalysisResult result={activeResult} model={selectedModel} style={selectedStyle} onReset={handleReset} onRegenerate={handleAnalyze} />
            )}
          </Suspense>
          <p className="mt-8 text-center font-inter text-xs text-[var(--text-secondary)]">
            Powered by{' '}
            <a href="https://imagetoprompt.dev" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-lens)] hover:underline">
              ImageToPrompt.dev
            </a>
          </p>
        </main>
      </div>
    );
  }

  // ── Full app ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--bg-void)]">
      {/* Skip nav */}
      <a
        href="#tool"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--accent-lens)] focus:px-4 focus:py-2 focus:font-grotesk focus:text-sm focus:font-700 focus:text-black"
      >
        Skip to tool
      </a>

      {/* Animated nebula background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] animate-nebula rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, #e040fb 0%, #7c3aed 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #00e5ff 0%, #0284c7 40%, transparent 70%)',
            filter: 'blur(80px)',
            animationDelay: '4s',
          }}
        />
      </div>

      <Header
        rateLimit={rateLimit}
        onHistoryOpen={() => setShowHistory(true)}
        hasHistory={history.length > 0}
        onChangelogOpen={() => setShowChangelog(true)}
        language={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      <main id="tool" className="relative mx-auto max-w-5xl px-4 pb-10 sm:px-6" role="main">
        {showUpload && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="font-grotesk text-4xl font-700 text-[var(--text-primary)] sm:text-5xl">
                Free Image to
                <span
                  className="ml-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Prompt Generator
                </span>
              </h1>
              <p className="mt-3 font-inter text-base text-[var(--text-secondary)] max-w-xl mx-auto">
                Upload any image. Get optimized prompts for Midjourney, Stable Diffusion,
                DALL·E, Flux, and more — instantly.
              </p>
            </div>

            <UploadZone onImageReady={setCurrentImage} onClear={handleReset} currentImage={currentImage} />
            <ModelSelector selected={selectedModel} onChange={setSelectedModel} />
            <StyleSelector selected={selectedStyle} onChange={setSelectedStyle} />

            {error && !isLoading && (
              <div
                className="flex items-center gap-3 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3"
                role="alert"
                aria-live="polite"
              >
                <span className="text-[var(--error)]" aria-hidden="true">⚠</span>
                <p className="font-inter text-sm text-[var(--error)]">{error}</p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!currentImage || isLoading || !rateLimit.canAnalyze}
                aria-disabled={!currentImage || isLoading || !rateLimit.canAnalyze}
                aria-label={
                  !currentImage
                    ? 'Upload an image first to generate a prompt'
                    : !rateLimit.canAnalyze
                    ? 'Daily analysis limit reached'
                    : 'Generate prompt from image'
                }
                className="group relative overflow-hidden rounded-2xl px-10 py-4 font-grotesk text-lg font-700 text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
                  boxShadow: currentImage ? 'var(--glow)' : 'none',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span aria-hidden="true">✦</span>
                  {!currentImage
                    ? 'Upload an image first'
                    : !rateLimit.canAnalyze
                    ? 'Daily limit reached'
                    : 'Generate Prompt'}
                  <span className="font-mono text-sm opacity-60" aria-hidden="true">Ctrl+↵</span>
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        <Suspense fallback={null}>
          {isLoading && currentImage && <LoadingState previewUrl={currentImage.previewUrl} />}
        </Suspense>

        {showResult && activeResult && (
          <div className="space-y-8" aria-live="polite" aria-label="Analysis result ready">
            <div className="flex items-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
              {currentImage && (
                <img
                  src={currentImage.previewUrl}
                  alt={`Preview of uploaded image: ${currentImage.name}`}
                  className="h-16 w-16 rounded-xl object-cover border border-[var(--border-subtle)]"
                />
              )}
              <div>
                <p className="font-inter text-xs text-[var(--text-secondary)]">Analyzing</p>
                <p className="font-grotesk text-sm font-600 text-[var(--text-primary)]">
                  {currentImage?.name ?? 'Uploaded image'}
                </p>
              </div>
            </div>

            <AnalysisResult
              result={activeResult}
              model={selectedModel}
              style={selectedStyle}
              onReset={handleReset}
              onRegenerate={handleAnalyze}
            />
          </div>
        )}
      </main>

      <Suspense fallback={null}>
        <div role="complementary" aria-label="More information">
          <HowItWorksSection />
          <BeforeAfterSection />
          <MetricsSection />
          <SocialProofSection />
          <ModelsSection />
          <ExamplesSection />
          <FAQSection />
          <NewsletterSection />
        </div>

        <SEOFooter />
      </Suspense>

      <Suspense fallback={null}>
        {showRateLimitModal && (
          <RateLimitModal
            onClose={() => setShowRateLimitModal(false)}
            timeUntilReset={rateLimit.timeUntilReset}
          />
        )}

        <PromptHistory
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          history={history}
          onRestore={handleRestoreFromHistory}
          onClear={clearHistory}
          onRemove={removeItem}
        />

        <ChangelogPage
          isOpen={showChangelog}
          onClose={() => setShowChangelog(false)}
        />
      </Suspense>
    </div>
  );
}
