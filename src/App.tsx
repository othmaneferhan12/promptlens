import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Video, FileText, TrendingUp, ImageIcon, Pencil, Film, PenTool } from 'lucide-react';
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
import { useImageToVideoPrompt } from './hooks/useImageToVideoPrompt';
import { useTextToVideoPrompt } from './hooks/useTextToVideoPrompt';
import { useDescribeImage } from './hooks/useDescribeImage';
import { useRateLimit } from './hooks/useRateLimit';
import { usePromptHistory } from './hooks/usePromptHistory';
import type {
  UploadedImage, AIModel, PromptStyle, SupportedLanguage,
  AnalysisResult as AnalysisResultType, HistoryItem,
  VideoModel, VideoMotionStyle, VideoDuration, VideoCameraMovement,
  VideoResult as VideoResultType,
  DescribeImageResult as DescribeResultType,
} from './types';

// Lazy-load heavy components
const AnalysisResult = lazy(() => import('./components/AnalysisResult'));
const VideoResultDisplay = lazy(() => import('./components/VideoResult'));
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
const VideoModelSelector = lazy(() => import('./components/VideoModelSelector'));
const VideoOptions = lazy(() => import('./components/VideoOptions'));
const DescribeImageResultDisplay = lazy(() => import('./components/DescribeImageResult'));

type ActiveTab = 'image-to-prompt' | 'text-to-prompt' | 'image-to-video' | 'text-to-video' | 'describe-image';

// Detect embed mode and pre-selected options from URL params
const _urlParams = new URLSearchParams(window.location.search);
const isEmbed = _urlParams.get('embed') === 'true';
const _urlModel = _urlParams.get('model') as string | null;
const _urlTab = _urlParams.get('tab') as string | null;
const VALID_IMAGE_MODELS: AIModel[] = ['midjourney', 'stable-diffusion', 'flux', 'dalle3', 'firefly', 'leonardo', 'ideogram'];
const VALID_VIDEO_MODELS: VideoModel[] = ['veo', 'kling', 'runway', 'pika', 'luma', 'sora', 'minimax', 'stable-video'];
const initialModel: AIModel = (_urlModel && VALID_IMAGE_MODELS.includes(_urlModel as AIModel)) ? _urlModel as AIModel : 'midjourney';
const initialVideoModel: VideoModel = (_urlModel && VALID_VIDEO_MODELS.includes(_urlModel as VideoModel)) ? _urlModel as VideoModel : 'veo';
const TAB_MAP: Record<string, ActiveTab> = {
  image: 'image-to-prompt',
  text: 'text-to-prompt',
  'image-to-prompt': 'image-to-prompt',
  'text-to-prompt': 'text-to-prompt',
  'image-to-video': 'image-to-video',
  'text-to-video': 'text-to-video',
  'describe-image': 'describe-image',
  describe: 'describe-image',
  // Aliases used by video model pages
  video: 'image-to-video',
  'text-video': 'text-to-video',
};
const initialTab: ActiveTab = (_urlTab && TAB_MAP[_urlTab]) ? TAB_MAP[_urlTab] : 'image-to-prompt';

export default function App() {
  const { t } = useTranslation();
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel>(initialModel);
  const [selectedStyle, setSelectedStyle] = useState<PromptStyle>('cinematic');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeResult, setActiveResult] = useState<AnalysisResultType | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [textInput, setTextInput] = useState('');

  // Video-specific state
  const [videoTextInput, setVideoTextInput] = useState('');
  const [selectedVideoModel, setSelectedVideoModel] = useState<VideoModel>(initialVideoModel);
  const [selectedMotionStyle, setSelectedMotionStyle] = useState<VideoMotionStyle>('cinematic');
  const [selectedDuration, setSelectedDuration] = useState<VideoDuration>('4s');
  const [selectedCameraMovement, setSelectedCameraMovement] = useState<VideoCameraMovement>('static');
  const [activeVideoResult, setActiveVideoResult] = useState<VideoResultType | null>(null);
  const [activeDescribeResult, setActiveDescribeResult] = useState<DescribeResultType | null>(null);

  const { result, isLoading, error, analyze, reset: resetAnalysis } = useImageAnalysis();
  const { result: textResult, isLoading: textIsLoading, error: textError, enhance: enhanceText, reset: resetTextAnalysis } = useTextToPrompt();
  const { result: imgVideoResult, isLoading: imgVideoIsLoading, error: imgVideoError, generate: generateImgVideo, reset: resetImgVideo } = useImageToVideoPrompt();
  const { result: textVideoResult, isLoading: textVideoIsLoading, error: textVideoError, generate: generateTextVideo, reset: resetTextVideo } = useTextToVideoPrompt();
  const { result: describeResult, isLoading: describeIsLoading, error: describeError, describe: describeImage, reset: resetDescribe } = useDescribeImage();
  const rateLimit = useRateLimit();
  const { history, addToHistory, clearHistory, removeItem } = usePromptHistory();

  // Derived values
  const category: 'image' | 'video' | 'describe' =
    activeTab === 'describe-image' ? 'describe' :
    (activeTab === 'image-to-video' || activeTab === 'text-to-video') ? 'video' : 'image';
  const combinedIsLoading = isLoading || textIsLoading || imgVideoIsLoading || textVideoIsLoading || describeIsLoading;
  const activeTabError =
    activeTab === 'image-to-prompt' ? error :
    activeTab === 'text-to-prompt' ? textError :
    activeTab === 'image-to-video' ? imgVideoError :
    activeTab === 'describe-image' ? describeError :
    textVideoError;

  // Initialize theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  useEffect(() => {
    if (result) setActiveResult(result);
  }, [result]);

  useEffect(() => {
    if (textResult) setActiveResult(textResult);
  }, [textResult]);

  useEffect(() => {
    if (imgVideoResult) setActiveVideoResult(imgVideoResult);
  }, [imgVideoResult]);

  useEffect(() => {
    if (textVideoResult) setActiveVideoResult(textVideoResult);
  }, [textVideoResult]);

  useEffect(() => {
    if (describeResult) setActiveDescribeResult(describeResult);
  }, [describeResult]);

  useEffect(() => {
    if (activeResult || activeVideoResult || activeDescribeResult) {
      const el = document.getElementById('prompt-result');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeResult, activeVideoResult, activeDescribeResult]);

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
        if (activeTab === 'image-to-prompt' && currentImage && !combinedIsLoading && !activeResult) handleAnalyze();
        if (activeTab === 'text-to-prompt' && textInput.trim() && !combinedIsLoading && !activeResult) handleEnhanceText();
        if (activeTab === 'image-to-video' && currentImage && !combinedIsLoading && !activeVideoResult) handleGenerateImgVideo();
        if (activeTab === 'text-to-video' && videoTextInput.trim() && !combinedIsLoading && !activeVideoResult) handleGenerateTextVideo();
        if (activeTab === 'describe-image' && currentImage && !combinedIsLoading && !activeDescribeResult) handleDescribeImage();
      }
      if (e.key === 'Escape' && !showHistory && !showRateLimitModal) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImage, combinedIsLoading, activeResult, activeVideoResult, showHistory, showRateLimitModal, activeTab, textInput, videoTextInput]);

  const handleAnalyze = useCallback(async () => {
    if (!currentImage || isLoading) return;
    if (!rateLimit.canAnalyze) { setShowRateLimitModal(true); return; }
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
      await addToHistory(currentImage.previewUrl, selectedModel, selectedStyle, analysisResult, currentImage.name);
    }
  }, [currentImage, isLoading, rateLimit, analyze, selectedModel, selectedStyle, selectedLanguage, addToHistory]);

  const handleEnhanceText = useCallback(async () => {
    if (!textInput.trim() || textIsLoading) return;
    if (!rateLimit.canAnalyze) { setShowRateLimitModal(true); return; }
    rateLimit.incrementUsage();
    await enhanceText({ text: textInput, model: selectedModel, style: selectedStyle, language: selectedLanguage });
  }, [textInput, textIsLoading, rateLimit, enhanceText, selectedModel, selectedStyle, selectedLanguage]);

  const handleGenerateImgVideo = useCallback(async () => {
    if (!currentImage || imgVideoIsLoading) return;
    if (!rateLimit.canAnalyze) { setShowRateLimitModal(true); return; }
    rateLimit.incrementUsage();
    await generateImgVideo({
      base64: currentImage.base64,
      mediaType: currentImage.mediaType,
      model: selectedVideoModel,
      motionStyle: selectedMotionStyle,
      duration: selectedDuration,
      cameraMovement: selectedCameraMovement,
      language: selectedLanguage,
    });
  }, [currentImage, imgVideoIsLoading, rateLimit, generateImgVideo, selectedVideoModel, selectedMotionStyle, selectedDuration, selectedCameraMovement, selectedLanguage]);

  const handleGenerateTextVideo = useCallback(async () => {
    if (!videoTextInput.trim() || textVideoIsLoading) return;
    if (!rateLimit.canAnalyze) { setShowRateLimitModal(true); return; }
    rateLimit.incrementUsage();
    await generateTextVideo({
      text: videoTextInput,
      model: selectedVideoModel,
      motionStyle: selectedMotionStyle,
      duration: selectedDuration,
      cameraMovement: selectedCameraMovement,
      language: selectedLanguage,
    });
  }, [videoTextInput, textVideoIsLoading, rateLimit, generateTextVideo, selectedVideoModel, selectedMotionStyle, selectedDuration, selectedCameraMovement, selectedLanguage]);

  const handleDescribeImage = useCallback(async () => {
    if (!currentImage || describeIsLoading) return;
    if (!rateLimit.canAnalyze) { setShowRateLimitModal(true); return; }
    rateLimit.incrementUsage();
    await describeImage({
      base64: currentImage.base64,
      mediaType: currentImage.mediaType,
    });
  }, [currentImage, describeIsLoading, rateLimit, describeImage]);

  const handleReset = useCallback(() => {
    setCurrentImage(null);
    setActiveResult(null);
    setActiveVideoResult(null);
    setActiveDescribeResult(null);
    resetAnalysis();
    resetTextAnalysis();
    resetImgVideo();
    resetTextVideo();
    resetDescribe();
  }, [resetAnalysis, resetTextAnalysis, resetImgVideo, resetTextVideo, resetDescribe]);

  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    handleReset();
  }, [handleReset]);

  const handleRestoreFromHistory = useCallback(
    (restoredResult: AnalysisResultType, item: HistoryItem) => {
      setActiveResult(restoredResult);
      setSelectedModel(item.model);
      setSelectedStyle(item.style);
    },
    []
  );

  const showImageTools = !activeResult && !combinedIsLoading && category === 'image';
  const showVideoTools = !activeVideoResult && !combinedIsLoading && category === 'video';
  const showDescribeTools = !activeDescribeResult && !combinedIsLoading && category === 'describe';
  const showImageResult = !!activeResult && !combinedIsLoading && category === 'image';
  const showVideoResult = !!activeVideoResult && !combinedIsLoading && category === 'video';
  const showDescribeResult = !!activeDescribeResult && !combinedIsLoading && category === 'describe';

  // ── Embed mode ──────────────────────────────────────────────────────────────
  if (isEmbed) {
    return (
      <div className="min-h-screen bg-transparent">
        <main className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6" role="main">
          {category === 'image' && showImageTools && (
            <div className="space-y-6">
              <UploadZone onImageReady={setCurrentImage} onClear={handleReset} currentImage={currentImage} />
              <ModelSelector selected={selectedModel} onChange={setSelectedModel} />
              <StyleSelector selected={selectedStyle} onChange={setSelectedStyle} />
              {activeTabError && !combinedIsLoading && (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3" role="alert" aria-live="polite">
                  <span className="text-[var(--error)]" aria-hidden="true">⚠</span>
                  <p className="font-inter text-sm text-[var(--error)]">{activeTabError}</p>
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
          {category === 'video' && showVideoTools && (
            <div className="space-y-6">
              {activeTab === 'image-to-video' ? (
                <UploadZone onImageReady={setCurrentImage} onClear={handleReset} currentImage={currentImage} />
              ) : (
                <TextInputArea text={videoTextInput} onChange={setVideoTextInput} disabled={textVideoIsLoading} />
              )}
              <Suspense fallback={null}>
                <VideoModelSelector selected={selectedVideoModel} onChange={setSelectedVideoModel} />
                <VideoOptions
                  motionStyle={selectedMotionStyle}
                  onMotionStyleChange={setSelectedMotionStyle}
                  duration={selectedDuration}
                  onDurationChange={setSelectedDuration}
                  cameraMovement={selectedCameraMovement}
                  onCameraMovementChange={setSelectedCameraMovement}
                />
              </Suspense>
              {activeTabError && !combinedIsLoading && (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3" role="alert" aria-live="polite">
                  <span className="text-[var(--error)]" aria-hidden="true">⚠</span>
                  <p className="font-inter text-sm text-[var(--error)]">{activeTabError}</p>
                </div>
              )}
              <div className="flex justify-center">
                <button
                  onClick={activeTab === 'image-to-video' ? handleGenerateImgVideo : handleGenerateTextVideo}
                  disabled={(activeTab === 'image-to-video' ? !currentImage : !videoTextInput.trim()) || combinedIsLoading || !rateLimit.canAnalyze}
                  className="rounded-2xl px-8 py-3 font-grotesk text-base font-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #0891b2)' }}
                >
                  Generate Video Prompt
                </button>
              </div>
            </div>
          )}
          {category === 'describe' && showDescribeTools && (
            <div className="space-y-6">
              <UploadZone onImageReady={setCurrentImage} onClear={handleReset} currentImage={currentImage} />
              {activeTabError && !combinedIsLoading && (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3" role="alert" aria-live="polite">
                  <span className="text-[var(--error)]" aria-hidden="true">⚠</span>
                  <p className="font-inter text-sm text-[var(--error)]">{activeTabError}</p>
                </div>
              )}
              <div className="flex justify-center">
                <button
                  onClick={handleDescribeImage}
                  disabled={!currentImage || combinedIsLoading || !rateLimit.canAnalyze}
                  className="rounded-2xl px-8 py-3 font-grotesk text-base font-700 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #34d399, #06b6d4)' }}
                >
                  Describe Image
                </button>
              </div>
            </div>
          )}
          <Suspense fallback={null}>
            {combinedIsLoading && <LoadingState previewUrl={currentImage?.previewUrl} />}
          </Suspense>
          <Suspense fallback={null}>
            {showImageResult && activeResult && (
              <AnalysisResult result={activeResult} model={selectedModel} style={selectedStyle} onReset={handleReset} onRegenerate={handleAnalyze} />
            )}
            {showVideoResult && activeVideoResult && (
              <VideoResultDisplay
                result={activeVideoResult}
                model={selectedVideoModel}
                motionStyle={selectedMotionStyle}
                duration={selectedDuration}
                cameraMovement={selectedCameraMovement}
                onReset={handleReset}
                onRegenerate={activeTab === 'image-to-video' ? handleGenerateImgVideo : handleGenerateTextVideo}
              />
            )}
            {showDescribeResult && activeDescribeResult && (
              <DescribeImageResultDisplay
                result={activeDescribeResult}
                onReset={handleReset}
                onRegenerate={handleDescribeImage}
              />
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
    <div className="min-h-screen bg-transparent">
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
        {(showImageTools || showVideoTools || showDescribeTools) && (
          <>
            {/* ── Page hero ── */}
            <div className="pt-5 pb-4 sm:pt-8 sm:pb-7 text-center">
              <h1 className="font-grotesk text-4xl font-700 text-[var(--text-primary)] sm:text-5xl">
                {category === 'video' ? (
                  <>
                    {t('hero.titleVideo')}{t('hero.titleVideo') ? ' ' : ''}
                    <span
                      className="gradient-clip"
                      style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4)' }}
                    >
                      {t('hero.titleVideoHighlight')}
                    </span>
                  </>
                ) : category === 'describe' ? (
                  <>
                    {t('hero.titleDescribe', 'Free AI')}{' '}
                    <span
                      className="gradient-clip"
                      style={{ background: 'linear-gradient(135deg, #34d399, #06b6d4)' }}
                    >
                      {t('hero.titleDescribeHighlight', 'Image Describer')}
                    </span>
                  </>
                ) : (
                  <>
                    {t('hero.title')}{' '}
                    <span
                      className="ml-2 gradient-clip"
                      style={{ background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))' }}
                    >
                      {t('hero.titleHighlight')}
                    </span>
                  </>
                )}
              </h1>
              <p className="mt-3 font-inter text-base text-[var(--text-secondary)] max-w-xl mx-auto">
                {category === 'video' ? t('hero.subtitleVideo') : category === 'describe' ? t('hero.subtitleDescribe', 'Upload any image and get a detailed AI-powered description. Perfect for accessibility alt-text, content creation, and SEO.') : t('hero.subtitleImage')}
              </p>

              {/* Trust badges */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {[
                  { label: t('hero.badgeFree'),    color: '#60A5FA' },
                  { label: t('hero.badgeNoLogin'), color: '#4ADE80' },
                  { label: t('hero.badgeDaily'),   color: '#FBBF24' },
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

              {/* Prompt counter */}
              <p className="text-center font-inter mt-2 flex items-center justify-center gap-1.5" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <TrendingUp size={16} style={{ color: 'var(--text-primary)' }} />
                <strong style={{ color: 'var(--text-primary)' }}>2,500+</strong> {t('hero.promptsToday')}
              </p>

              {/* Featured on */}
              <div className="flex items-center justify-center gap-6 mt-3" style={{ opacity: 0.4 }}>
                <span className="font-inter text-[0.8125rem]" style={{ color: 'var(--text-muted)', letterSpacing: '0.5px' }}>{t('hero.featuredOn')}</span>
                <span className="font-inter text-[0.8125rem] font-600" style={{ color: 'var(--text-muted)' }}>DEV.to</span>
                <span className="font-inter text-[0.8125rem] font-600" style={{ color: 'var(--text-muted)' }}>Medium</span>
                <span className="font-inter text-[0.8125rem] font-600" style={{ color: 'var(--text-muted)' }}>Hashnode</span>
              </div>
            </div>

            {/* ── Tool container + Showcase panel ── */}
            <div className="grid grid-cols-1 xl:grid-cols-[60fr_40fr] gap-6 xl:gap-8 xl:items-stretch">

              {/* ── ONE unified tool container ── */}
              <div
                className="flex flex-col gap-5 rounded-2xl border p-5 sm:p-6"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}
              >
                {/* Category pills */}
                <div className="flex gap-2">
                  {([
                    ['image', Image, t('tabs.imagePrompts'), 'image-to-prompt', '#e040fb33', '#00e5ff33', '#e040fb'],
                    ['video', Video, t('tabs.videoPrompts'), 'image-to-video', '#7c3aed33', '#0891b233', '#7c3aed'],
                    ['describe', FileText, t('tabs.describeImage', 'Describe Image'), 'describe-image', '#34d39933', '#06b6d433', '#34d399'],
                  ] as const).map(([cat, IconComponent, label, defaultTab, gradFrom, gradTo, borderColor]) => (
                    <button
                      key={cat}
                      onClick={() => handleTabChange(defaultTab as ActiveTab)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-inter text-sm font-600 transition-all duration-200"
                      style={{
                        background: category === cat
                          ? `linear-gradient(135deg, ${gradFrom}, ${gradTo})`
                          : 'transparent',
                        color: category === cat ? 'var(--text-primary)' : 'var(--text-secondary)',
                        border: `1px solid ${category === cat ? borderColor : 'var(--border-subtle)'}`,
                      }}
                    >
                      <IconComponent size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>

                {/* Sub-tab switcher (image/video only) */}
                {category !== 'describe' && (
                <div className="flex gap-2 p-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                  {category === 'image' ? (
                    ([
                      ['image-to-prompt', ImageIcon, t('tabs.imageToPrompt')],
                      ['text-to-prompt', Pencil, t('tabs.textToPrompt')],
                    ] as const).map(([tab, IconComponent, label]) => (
                      <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 font-inter text-sm font-500 transition-all duration-200"
                        style={{
                          backgroundColor: activeTab === tab ? 'var(--bg-card)' : 'transparent',
                          color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                          boxShadow: activeTab === tab ? 'var(--shadow-tab, 0 1px 4px rgba(0,0,0,0.2))' : 'none',
                        }}
                      >
                        <IconComponent size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                        <span>{label}</span>
                      </button>
                    ))
                  ) : (
                    ([
                      ['image-to-video', Film, t('tabs.imageToVideo')],
                      ['text-to-video', PenTool, t('tabs.textToVideo')],
                    ] as const).map(([tab, IconComponent, label]) => (
                      <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 font-inter text-sm font-500 transition-all duration-200"
                        style={{
                          backgroundColor: activeTab === tab ? 'var(--bg-card)' : 'transparent',
                          color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                          boxShadow: activeTab === tab ? 'var(--shadow-tab, 0 1px 4px rgba(0,0,0,0.2))' : 'none',
                        }}
                      >
                        <IconComponent size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                        <span>{label}</span>
                      </button>
                    ))
                  )}
                </div>
                )}

                {/* Input area */}
                {activeTab === 'describe-image' && (
                  <UploadZone onImageReady={setCurrentImage} onClear={handleReset} currentImage={currentImage} />
                )}
                {activeTab === 'image-to-prompt' && (
                  <UploadZone onImageReady={setCurrentImage} onClear={handleReset} currentImage={currentImage} />
                )}
                {activeTab === 'text-to-prompt' && (
                  <TextInputArea text={textInput} onChange={setTextInput} disabled={textIsLoading} />
                )}
                {activeTab === 'image-to-video' && (
                  <UploadZone onImageReady={setCurrentImage} onClear={handleReset} currentImage={currentImage} />
                )}
                {activeTab === 'text-to-video' && (
                  <TextInputArea text={videoTextInput} onChange={setVideoTextInput} disabled={textVideoIsLoading} />
                )}

                {/* Model / style selectors (not for describe) */}
                {category === 'image' && (
                  <>
                    <ModelSelector selected={selectedModel} onChange={setSelectedModel} />
                    <StyleSelector selected={selectedStyle} onChange={setSelectedStyle} />
                  </>
                )}
                {category === 'video' && (
                  <Suspense fallback={null}>
                    <VideoModelSelector selected={selectedVideoModel} onChange={setSelectedVideoModel} />
                    <VideoOptions
                      motionStyle={selectedMotionStyle}
                      onMotionStyleChange={setSelectedMotionStyle}
                      duration={selectedDuration}
                      onDurationChange={setSelectedDuration}
                      cameraMovement={selectedCameraMovement}
                      onCameraMovementChange={setSelectedCameraMovement}
                    />
                  </Suspense>
                )}

                {/* Language row (not for describe) */}
                {category !== 'describe' && (
                <div className="flex items-center justify-between gap-3">
                  <span className="font-inter text-xs font-600 uppercase tracking-widest text-[var(--text-secondary)]">
                    {t('controls.outputLanguage')}
                  </span>
                  <LanguageSelector selected={selectedLanguage} onChange={setSelectedLanguage} />
                </div>
                )}

                {activeTabError && !combinedIsLoading && (
                  <div
                    className="flex items-center gap-3 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3"
                    role="alert"
                    aria-live="polite"
                  >
                    <span className="text-[var(--error)]" aria-hidden="true">⚠</span>
                    <p className="font-inter text-sm text-[var(--error)]">{activeTabError}</p>
                  </div>
                )}

                {/* Usage counter */}
                <div className="flex items-center justify-between gap-3">
                  <span className="font-inter text-xs text-[var(--text-secondary)]/60">
                    {t('hero.dailyAnalyses')}
                  </span>
                  <UsageCounter rateLimit={rateLimit} onLimitClick={() => setShowRateLimitModal(true)} />
                </div>

                {/* Generate button */}
                {activeTab === 'image-to-prompt' && (
                  <button
                    onClick={handleAnalyze}
                    disabled={!currentImage || combinedIsLoading || !rateLimit.canAnalyze}
                    aria-disabled={!currentImage || combinedIsLoading || !rateLimit.canAnalyze}
                    className="group relative w-full overflow-hidden rounded-2xl py-4 font-grotesk text-lg font-700 text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
                      boxShadow: currentImage ? 'var(--glow)' : 'none',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span aria-hidden="true">✦</span>
                      {!currentImage ? t('buttons.uploadFirst') : !rateLimit.canAnalyze ? t('buttons.dailyLimitReached') : t('buttons.generatePrompt')}
                      <span className="hidden sm:inline font-mono text-sm opacity-60" aria-hidden="true">Ctrl+↵</span>
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
                  </button>
                )}
                {activeTab === 'text-to-prompt' && (
                  <button
                    onClick={handleEnhanceText}
                    disabled={!textInput.trim() || combinedIsLoading || !rateLimit.canAnalyze}
                    aria-disabled={!textInput.trim() || combinedIsLoading || !rateLimit.canAnalyze}
                    className="group relative w-full overflow-hidden rounded-2xl py-4 font-grotesk text-lg font-700 text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-lens), var(--accent-cyan))',
                      boxShadow: textInput.trim() ? 'var(--glow)' : 'none',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span aria-hidden="true">✨</span>
                      {!textInput.trim() ? t('buttons.enterDescription') : !rateLimit.canAnalyze ? t('buttons.dailyLimitReached') : t('buttons.enhancePrompt')}
                      <span className="hidden sm:inline font-mono text-sm opacity-60" aria-hidden="true">Ctrl+↵</span>
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
                  </button>
                )}
                {activeTab === 'image-to-video' && (
                  <button
                    onClick={handleGenerateImgVideo}
                    disabled={!currentImage || combinedIsLoading || !rateLimit.canAnalyze}
                    aria-disabled={!currentImage || combinedIsLoading || !rateLimit.canAnalyze}
                    className="group relative w-full overflow-hidden rounded-2xl py-4 font-grotesk text-lg font-700 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #0891b2)',
                      boxShadow: currentImage ? '0 0 20px rgba(124,58,237,0.4)' : 'none',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span aria-hidden="true">🎬</span>
                      {!currentImage ? t('buttons.uploadFirst') : !rateLimit.canAnalyze ? t('buttons.dailyLimitReached') : t('buttons.generateVideoPrompt')}
                      <span className="hidden sm:inline font-mono text-sm opacity-60" aria-hidden="true">Ctrl+↵</span>
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
                  </button>
                )}
                {activeTab === 'describe-image' && (
                  <button
                    onClick={handleDescribeImage}
                    disabled={!currentImage || combinedIsLoading || !rateLimit.canAnalyze}
                    aria-disabled={!currentImage || combinedIsLoading || !rateLimit.canAnalyze}
                    className="group relative w-full overflow-hidden rounded-2xl py-4 font-grotesk text-lg font-700 text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                    style={{
                      background: 'linear-gradient(135deg, #34d399, #06b6d4)',
                      boxShadow: currentImage ? '0 0 20px rgba(52,211,153,0.4)' : 'none',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span aria-hidden="true">📝</span>
                      {!currentImage ? t('buttons.uploadFirst') : !rateLimit.canAnalyze ? t('buttons.dailyLimitReached') : t('buttons.describeImage', 'Describe Image')}
                      <span className="hidden sm:inline font-mono text-sm opacity-60" aria-hidden="true">Ctrl+↵</span>
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
                  </button>
                )}
                {activeTab === 'text-to-video' && (
                  <button
                    onClick={handleGenerateTextVideo}
                    disabled={!videoTextInput.trim() || combinedIsLoading || !rateLimit.canAnalyze}
                    aria-disabled={!videoTextInput.trim() || combinedIsLoading || !rateLimit.canAnalyze}
                    className="group relative w-full overflow-hidden rounded-2xl py-4 font-grotesk text-lg font-700 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #0891b2)',
                      boxShadow: videoTextInput.trim() ? '0 0 20px rgba(124,58,237,0.4)' : 'none',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span aria-hidden="true">🎬</span>
                      {!videoTextInput.trim() ? t('buttons.enterDescription') : !rateLimit.canAnalyze ? t('buttons.dailyLimitReached') : t('buttons.generateVideoPrompt')}
                      <span className="hidden sm:inline font-mono text-sm opacity-60" aria-hidden="true">Ctrl+↵</span>
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* ── Showcase panel — desktop only (xl+), never loads on mobile/tablet ── */}
              <div className="hidden xl:flex items-center justify-center h-full py-6">
                <div className="w-full h-full">
                  <ShowcasePanel />
                </div>
              </div>
            </div>
          </>
        )}

        <Suspense fallback={null}>
          {combinedIsLoading && <LoadingState previewUrl={currentImage?.previewUrl} />}
        </Suspense>

        {showImageResult && activeResult && (
          <div id="prompt-result" className="space-y-8" style={{ scrollMarginTop: '100px' }} aria-live="polite" aria-label="Analysis result ready">
            {activeTab === 'image-to-prompt' && currentImage && (
              <div className="flex items-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
                <img
                  src={currentImage.previewUrl}
                  alt={`Preview of uploaded image: ${currentImage.name}`}
                  className="h-16 w-16 rounded-xl object-cover border border-[var(--border-subtle)]"
                />
                <div>
                  <p className="font-inter text-xs text-[var(--text-secondary)]">Analyzing</p>
                  <p className="font-grotesk text-sm font-600 text-[var(--text-primary)]">{currentImage.name}</p>
                </div>
              </div>
            )}
            <Suspense fallback={null}>
              <AnalysisResult
                result={activeResult}
                model={selectedModel}
                style={selectedStyle}
                onReset={handleReset}
                onRegenerate={activeTab === 'image-to-prompt' ? handleAnalyze : handleEnhanceText}
                resetLabel={activeTab === 'text-to-prompt' ? t('buttons.enhanceAnother') : undefined}
              />
            </Suspense>
          </div>
        )}

        {showVideoResult && activeVideoResult && (
          <div id="prompt-result" className="space-y-8" style={{ scrollMarginTop: '100px' }} aria-live="polite" aria-label="Video prompt result ready">
            {activeTab === 'image-to-video' && currentImage && (
              <div className="flex items-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
                <img
                  src={currentImage.previewUrl}
                  alt={`Preview of uploaded image: ${currentImage.name}`}
                  className="h-16 w-16 rounded-xl object-cover border border-[var(--border-subtle)]"
                />
                <div>
                  <p className="font-inter text-xs text-[var(--text-secondary)]">Animating</p>
                  <p className="font-grotesk text-sm font-600 text-[var(--text-primary)]">{currentImage.name}</p>
                </div>
              </div>
            )}
            <Suspense fallback={null}>
              <VideoResultDisplay
                result={activeVideoResult}
                model={selectedVideoModel}
                motionStyle={selectedMotionStyle}
                duration={selectedDuration}
                cameraMovement={selectedCameraMovement}
                onReset={handleReset}
                onRegenerate={activeTab === 'image-to-video' ? handleGenerateImgVideo : handleGenerateTextVideo}
                resetLabel={activeTab === 'text-to-video' ? t('buttons.generateAnother') : undefined}
              />
            </Suspense>
          </div>
        )}

        {showDescribeResult && activeDescribeResult && (
          <div id="prompt-result" className="space-y-8" style={{ scrollMarginTop: '100px' }} aria-live="polite" aria-label="Image description ready">
            {currentImage && (
              <div className="flex items-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
                <img
                  src={currentImage.previewUrl}
                  alt={`Preview of uploaded image: ${currentImage.name}`}
                  className="h-16 w-16 rounded-xl object-cover border border-[var(--border-subtle)]"
                />
                <div>
                  <p className="font-inter text-xs text-[var(--text-secondary)]">Described</p>
                  <p className="font-grotesk text-sm font-600 text-[var(--text-primary)]">{currentImage.name}</p>
                </div>
              </div>
            )}
            <Suspense fallback={null}>
              <DescribeImageResultDisplay
                result={activeDescribeResult}
                onReset={handleReset}
                onRegenerate={handleDescribeImage}
              />
            </Suspense>
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
