import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ModelSelector from './components/ModelSelector';
import StyleSelector from './components/StyleSelector';
import AnalysisResult from './components/AnalysisResult';
import LoadingState from './components/LoadingState';
import RateLimitModal from './components/RateLimitModal';
import PromptHistory from './components/PromptHistory';
import Footer from './components/Footer';
import { useImageAnalysis } from './hooks/useImageAnalysis';
import { useRateLimit } from './hooks/useRateLimit';
import { usePromptHistory } from './hooks/usePromptHistory';
import type { UploadedImage, AIModel, PromptStyle, AnalysisResult as AnalysisResultType, HistoryItem } from './types';

export default function App() {
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel>('midjourney');
  const [selectedStyle, setSelectedStyle] = useState<PromptStyle>('cinematic');
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeResult, setActiveResult] = useState<AnalysisResultType | null>(null);

  const { result, isLoading, error, analyze, reset: resetAnalysis } = useImageAnalysis();
  const rateLimit = useRateLimit();
  const { history, addToHistory, clearHistory, removeItem } = usePromptHistory();

  // Sync result to activeResult
  useEffect(() => {
    if (result) setActiveResult(result);
  }, [result]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Ctrl+V paste image
      if (e.ctrlKey && e.key === 'v' && !currentImage) {
        try {
          const items = await navigator.clipboard.read();
          for (const item of items) {
            const imageType = item.types.find((t) => t.startsWith('image/'));
            if (imageType) {
              // Let UploadZone handle via its own paste logic — we just focus it
              break;
            }
          }
        } catch {
          // ignore
        }
      }

      // Ctrl+Enter analyze
      if (e.ctrlKey && e.key === 'Enter') {
        if (currentImage && !isLoading && !activeResult) {
          handleAnalyze();
        }
      }

      // Escape reset
      if (e.key === 'Escape' && !showHistory && !showRateLimitModal) {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImage, isLoading, activeResult, showHistory, showRateLimitModal]);

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

  return (
    <div className="min-h-screen bg-[var(--bg-void)]">
      {/* Animated nebula background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
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

      <main className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Upload + config section */}
        {showUpload && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center">
              <h1 className="font-grotesk text-4xl font-700 text-[var(--text-primary)] sm:text-5xl">
                AI Prompt
                <span
                  className="ml-2"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Engineer
                </span>
              </h1>
              <p className="mt-3 font-inter text-base text-[var(--text-secondary)] max-w-xl mx-auto">
                Upload any image. Get optimized prompts for Midjourney, Stable Diffusion,
                DALL·E, Flux, and more — instantly.
              </p>
            </div>

            <UploadZone
              onImageReady={setCurrentImage}
              onClear={handleReset}
              currentImage={currentImage}
            />

            <ModelSelector selected={selectedModel} onChange={setSelectedModel} />
            <StyleSelector selected={selectedStyle} onChange={setSelectedStyle} />

            {/* Error */}
            {error && !isLoading && (
              <div className="flex items-center gap-3 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3">
                <span className="text-[var(--error)]">⚠</span>
                <p className="font-inter text-sm text-[var(--error)]">{error}</p>
              </div>
            )}

            {/* Analyze button */}
            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!currentImage || isLoading || !rateLimit.canAnalyze}
                className="group relative overflow-hidden rounded-2xl px-10 py-4 font-grotesk text-lg font-700 text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
                  boxShadow: currentImage ? 'var(--glow)' : 'none',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>✦</span>
                  {!currentImage
                    ? 'Upload an image first'
                    : !rateLimit.canAnalyze
                    ? 'Daily limit reached'
                    : 'Generate Prompt'}
                  <span className="font-mono text-sm opacity-60">Ctrl+↵</span>
                </span>
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && currentImage && (
            <LoadingState previewUrl={currentImage.previewUrl} />
          )}
        </AnimatePresence>

        {/* Result */}
        {showResult && activeResult && (
          <div className="space-y-8">
            {/* Image preview strip */}
            <div className="flex items-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
              {currentImage && (
                <img
                  src={currentImage.previewUrl}
                  alt=""
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

      <Footer />

      {/* Modals */}
      <AnimatePresence>
        {showRateLimitModal && (
          <RateLimitModal
            onClose={() => setShowRateLimitModal(false)}
            timeUntilReset={rateLimit.timeUntilReset}
          />
        )}
      </AnimatePresence>

      <PromptHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onRestore={handleRestoreFromHistory}
        onClear={clearHistory}
        onRemove={removeItem}
      />
    </div>
  );
}
