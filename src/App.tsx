import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ModelSelector from './components/ModelSelector';
import StyleSelector from './components/StyleSelector';
import ShowcasePanel from './components/ShowcasePanel';
import LanguageSelector from './components/LanguageSelector';
import UsageCounter from './components/UsageCounter';
import TextInputArea from './components/TextInputArea';
import { useImageAnalysis } from './hooks/useImageAnalysis';
import { useTextToPrompt } from './hooks/useTextToPrompt';
import { useRateLimit } from './hooks/useRateLimit';
import { usePromptHistory } from './hooks/usePromptHistory';
import type { UploadedImage, AIModel, PromptStyle, SupportedLanguage, AnalysisResult as AnalysisResultType, HistoryItem } from './types';

// Lazy-load framer-motion dependents and modal components
const AnalysisResult = lazy(() => import('./components/AnalysisResult'));
const LoadingState = lazy(() => import('./components/LoadingState'));
const RateLimitModal = lazy(() => import('./components/RateLimitModal'));
const PromptHistory = lazy(() => import('./components/PromptHistory'));
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
const _urlTab = _urlParams.get('tab') as 'image' | 'text' | null;
const VALID_MODELS: AIModel[] = ['midjourney', 'stable-diffusion', 'flux', 'dalle3', 'firefly', 'leonardo', 'ideogram'];
const initialModel: AIModel = (_urlModel && VALID_MODELS.includes(_urlModel)) ? _urlModel : 'midjourney';
const initialTab: 'image' | 'text' = _urlTab === 'text' ? 'text' : 'image';

export default function App() {
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel>(initialModel);
  const [selectedStyle, setSelectedStyle] = useState<PromptStyle>('cinematic');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeResult, setActiveResult] = useState<AnalysisResultType | null>(null);
  const [toolTab, setToolTab] = useState<'image' | 'text'>(initialTab);
  const [textInput, setTextInput] = useState('');

  const { result, isLoading, error, analyze, reset: resetAnalysis } = useImageAnalysis();
  const { result: textResult, isLoading: textIsLoading, error: textError, enhance: enhanceText, reset: resetTextAnalysis } = useTextToPrompt();
  const rateLimit = useRateLimit();
  const { history, addToHistory, clearHistory, removeItem } = usePromptHistory();

  useEffect(() => {
    if (result) setActiveResult(result);
  }, [result]);

  useEffect(() => {
    if (textResult) setActiveResult(textResult);
  }, [textResult]);

  useEffect(() => {
    if (activeResult) {
      const el = document.getElementById('prompt-result');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeResult]);

  const combinedIsLoading = isLoading || textIsLoading;
  const combinedError = error || textError;

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
        if (toolTab === 'image' && currentImage && !combinedIsLoading && !activeResult) handleAnalyze();
        if (toolTab === 'text' && textInput.trim() && !combinedIsLoading && !activeResult) handleEnhanceText();
      }
      if (e.key === 'Escape' && !showHistory && !showRateLimitModal) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImage, combinedIsLoading, activeResult, showHistory, showRateLimitModal, toolTab, textInput]);

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
  }, [currentImage, isLoading, rateLimit, analyze, selectedModel, selectedStyle, selectedLanguage, addToHistory]);

  const handleEnhanceText = useCallback(async () => {
    if (!textInput.trim() || textIsLoading) return;
    if (!rateLimit.canAnalyze) {
      setShowRateLimitModal(true);
      return;
    }
    rateLimit.incrementUsage();
    await enhanceText({
      text: textInput,
      model: selectedModel,
      style: selectedStyle,
      language: selectedLanguage,
    });
  }, [textInput, textIsLoading, rateLimit, enhanceText, selectedModel, selectedStyle, selectedLanguage]);

  const handleReset = useCallback(() => {
    setCurrentImage(null);
    setActiveResult(null);
    resetAnalysis();
    resetTextAnalysis();
  }, [resetAnalysis, resetTextAnalysis]);

  const handleRestoreFromHistory = useCallback(
    (restoredResult: AnalysisResultType, item: HistoryItem) => {
      setActiveResult(restoredResult);
      setSelectedModel(item.model);
      setSelectedStyle(item.style);
    },
    []
  );

  const showResult = !!activeResult && !combinedIsLoading;
  const showUpload = !activeResult && !combinedIsLoading;

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
              {combinedError && !combinedIsLoading && (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3" role="alert" aria-live="polite">
                  <span className="text-[var(--error)]" aria-hidden="true">⚠</span>
                  <p className="font-inter text-sm text-[var(--error)]">{combinedError}</p>
                </div>
              )}
              <div className="flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={!currentImage || combinedIsLoading || !rateLimit.canAnalyze}
                  className="rounded-2xl px-8 py-3 font-grotesk text-base font-700 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))' }}
                >
                  Generate Prompt
                </button>
              </div>
            </div>
          )}
          <Suspense fallback={null}>
            {combinedIsLoading && <LoadingState previewUrl={currentImage?.previewUrl} />}
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
      />

      <main id="tool" className="relative mx-auto max-w-6xl px-4 pb-10 sm:px-6" role="main">
        {showUpload && (
          <>
            {/* ── Page hero — standalone, centered, above the tool ── */}
            <div className="pt-5 pb-4 sm:pt-8 sm:pb-7 text-center">
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

              {/* Trust badges */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {[
                  { label: '100% FREE',         color: '#60A5FA' },
                  { label: 'NO LOGIN REQUIRED', color: '#4ADE80' },
                  { label: '10 FREE DAILY',     color: '#FBBF24' },
                ].map(({ label, color }) => (
                  <span
                    key={label}
                    className="font-inter text-[0.6875rem] font-600 uppercase tracking-[1.5px] px-3 py-1 rounded-full"
                    style={{
                      border: `1px solid ${color}40`,
                      color,
                      background: `${color}0d`,
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Tool container + Showcase panel — side by side on desktop ── */}
            <div className="grid grid-cols-1 xl:grid-cols-[60fr_40fr] gap-6 xl:gap-8 xl:items-stretch">

              {/* ── ONE unified tool container ── */}
              <div
                className="flex flex-col gap-5 rounded-2xl border p-5 sm:p-6"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}
              >
                {/* Tab switcher */}
                <div className="flex gap-2 p-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                  {([['image', '🖼', 'Image to Prompt'], ['text', '✏️', 'Text to Prompt']] as const).map(([tab, icon, label]) => (
                    <button
                      key={tab}
                      onClick={() => { setToolTab(tab); handleReset(); }}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 font-inter text-sm font-500 transition-all duration-200"
                      style={{
                        backgroundColor: toolTab === tab ? 'var(--bg-card)' : 'transparent',
                        color: toolTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                        boxShadow: toolTab === tab ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                      }}
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>

                {/* Input area */}
                {toolTab === 'image' ? (
                  <UploadZone onImageReady={setCurrentImage} onClear={handleReset} currentImage={currentImage} />
                ) : (
                  <TextInputArea text={textInput} onChange={setTextInput} disabled={textIsLoading} />
                )}

                <ModelSelector selected={selectedModel} onChange={setSelectedModel} />
                <StyleSelector selected={selectedStyle} onChange={setSelectedStyle} />

                {/* Language row */}
                <div className="flex items-center justify-between gap-3">
                  <span className="font-inter text-xs font-600 uppercase tracking-widest text-[var(--text-secondary)]">
                    Output Language
                  </span>
                  <LanguageSelector selected={selectedLanguage} onChange={setSelectedLanguage} />
                </div>

                {combinedError && !combinedIsLoading && (
                  <div
                    className="flex items-center gap-3 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3"
                    role="alert"
                    aria-live="polite"
                  >
                    <span className="text-[var(--error)]" aria-hidden="true">⚠</span>
                    <p className="font-inter text-sm text-[var(--error)]">{combinedError}</p>
                  </div>
                )}

                {/* Usage counter */}
                <div className="flex items-center justify-between gap-3">
                  <span className="font-inter text-xs text-[var(--text-secondary)]/60">
                    Daily analyses
                  </span>
                  <UsageCounter rateLimit={rateLimit} onLimitClick={() => setShowRateLimitModal(true)} />
                </div>

                {/* Generate button — full width, bottom of container */}
                {toolTab === 'image' ? (
                  <button
                    onClick={handleAnalyze}
                    disabled={!currentImage || combinedIsLoading || !rateLimit.canAnalyze}
                    aria-disabled={!currentImage || combinedIsLoading || !rateLimit.canAnalyze}
                    aria-label={
                      !currentImage
                        ? 'Upload an image first to generate a prompt'
                        : !rateLimit.canAnalyze
                        ? 'Daily analysis limit reached'
                        : 'Generate prompt from image'
                    }
                    className="group relative w-full overflow-hidden rounded-2xl py-4 font-grotesk text-lg font-700 text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
                      boxShadow: currentImage ? 'var(--glow)' : 'none',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span aria-hidden="true">✦</span>
                      {!currentImage
                        ? 'Upload an image first'
                        : !rateLimit.canAnalyze
                        ? 'Daily limit reached'
                        : 'Generate Prompt'}
                      <span className="hidden sm:inline font-mono text-sm opacity-60" aria-hidden="true">Ctrl+↵</span>
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    onClick={handleEnhanceText}
                    disabled={!textInput.trim() || combinedIsLoading || !rateLimit.canAnalyze}
                    aria-disabled={!textInput.trim() || combinedIsLoading || !rateLimit.canAnalyze}
                    aria-label={
                      !textInput.trim()
                        ? 'Enter a description first'
                        : !rateLimit.canAnalyze
                        ? 'Daily analysis limit reached'
                        : 'Enhance prompt from description'
                    }
                    className="group relative w-full overflow-hidden rounded-2xl py-4 font-grotesk text-lg font-700 text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
                      boxShadow: textInput.trim() ? 'var(--glow)' : 'none',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span aria-hidden="true">✨</span>
                      {!textInput.trim()
                        ? 'Enter a description first'
                        : !rateLimit.canAnalyze
                        ? 'Daily limit reached'
                        : '✨ Enhance Prompt'}
                      <span className="hidden sm:inline font-mono text-sm opacity-60" aria-hidden="true">Ctrl+↵</span>
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* ── Showcase panel — right column, vertically centered, slightly shorter ── */}
              <div className="hidden xl:flex items-center justify-center h-full py-6">
                <div className="w-full h-full">
                  <ShowcasePanel />
                </div>
              </div>
              {/* Tablet only: show showcase below tool (hidden on phones to reduce scroll) */}
              <div className="hidden sm:block xl:hidden">
                <ShowcasePanel />
              </div>
            </div>
          </>
        )}

        <Suspense fallback={null}>
          {combinedIsLoading && <LoadingState previewUrl={currentImage?.previewUrl} />}
        </Suspense>

        {showResult && activeResult && (
          <div id="prompt-result" className="space-y-8" style={{ scrollMarginTop: '100px' }} aria-live="polite" aria-label="Analysis result ready">
            {toolTab === 'image' && currentImage && (
              <div className="flex items-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
                <img
                  src={currentImage.previewUrl}
                  alt={`Preview of uploaded image: ${currentImage.name}`}
                  className="h-16 w-16 rounded-xl object-cover border border-[var(--border-subtle)]"
                />
                <div>
                  <p className="font-inter text-xs text-[var(--text-secondary)]">Analyzing</p>
                  <p className="font-grotesk text-sm font-600 text-[var(--text-primary)]">
                    {currentImage.name}
                  </p>
                </div>
              </div>
            )}

            <AnalysisResult
              result={activeResult}
              model={selectedModel}
              style={selectedStyle}
              onReset={handleReset}
              onRegenerate={toolTab === 'image' ? handleAnalyze : handleEnhanceText}
              resetLabel={toolTab === 'text' ? 'Enhance Another Description' : undefined}
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
      </Suspense>
    </div>
  );
}
