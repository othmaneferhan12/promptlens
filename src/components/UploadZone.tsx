import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Link, Clipboard, Camera, X, RefreshCw, AlertCircle } from 'lucide-react';
import { validateImageFile, formatFileSize } from '../utils/fileValidator';
import { compressImage, compressFromUrl, compressFromBase64 } from '../utils/imageCompressor';
import type { UploadedImage } from '../types';

type Tab = 'file' | 'url' | 'clipboard' | 'webcam';

interface UploadZoneProps {
  onImageReady: (img: UploadedImage) => void;
  onClear: () => void;
  currentImage: UploadedImage | null;
}

export default function UploadZone({ onImageReady, onClear, currentImage }: UploadZoneProps) {
  const [activeTab, setActiveTab] = useState<Tab>('file');
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);

  // Stop webcam on unmount or tab change
  useEffect(() => {
    if (activeTab !== 'webcam' && webcamStream) {
      webcamStream.getTracks().forEach((t) => t.stop());
      setWebcamStream(null);
    }
  }, [activeTab, webcamStream]);

  useEffect(() => {
    return () => {
      webcamStream?.getTracks().forEach((t) => t.stop());
    };
  }, [webcamStream]);

  const processFile = useCallback(
    async (file: File, source: UploadedImage['source'] = 'file') => {
      setError(null);
      setIsProcessing(true);
      try {
        const validation = await validateImageFile(file);
        if (!validation.valid) {
          setError(validation.error ?? 'Invalid file.');
          return;
        }
        const compressed = await compressImage(file);
        const previewUrl = `data:${compressed.mediaType};base64,${compressed.base64}`;
        onImageReady({
          file,
          previewUrl,
          base64: compressed.base64,
          mediaType: compressed.mediaType,
          originalSize: compressed.originalSize,
          compressedSize: compressed.compressedSize,
          width: compressed.width,
          height: compressed.height,
          name: file.name,
          source,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to process image.');
      } finally {
        setIsProcessing(false);
      }
    },
    [onImageReady]
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) processFile(accepted[0], 'file');
    },
    [processFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [],
      'image/tiff': [],
      'image/bmp': [],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    setError(null);
    setIsProcessing(true);
    try {
      const compressed = await compressFromUrl(urlInput.trim());
      const previewUrl = `data:${compressed.mediaType};base64,${compressed.base64}`;
      onImageReady({
        file: null,
        previewUrl,
        base64: compressed.base64,
        mediaType: compressed.mediaType,
        originalSize: compressed.originalSize,
        compressedSize: compressed.compressedSize,
        width: compressed.width,
        height: compressed.height,
        name: urlInput.split('/').pop() ?? 'remote-image',
        source: 'url',
      });
      setUrlInput('');
    } catch {
      setError('Failed to load image from URL. Check the URL and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClipboardPaste = useCallback(async () => {
    setError(null);
    setIsProcessing(true);
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], 'clipboard-image', { type: imageType });
          await processFile(file, 'clipboard');
          return;
        }
      }
      setError('No image found in clipboard. Copy an image first.');
    } catch {
      setError('Could not access clipboard. Use Ctrl+V to paste an image.');
    } finally {
      setIsProcessing(false);
    }
  }, [processFile]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setWebcamStream(stream);
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
    } catch {
      setError('Could not access camera. Check permissions.');
    }
  };

  const captureWebcam = async () => {
    if (!webcamRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = webcamRef.current.videoWidth;
    canvas.height = webcamRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(webcamRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    setIsProcessing(true);
    try {
      const compressed = await compressFromBase64(base64, 'image/jpeg');
      const previewUrl = `data:${compressed.mediaType};base64,${compressed.base64}`;
      onImageReady({
        file: null,
        previewUrl,
        base64: compressed.base64,
        mediaType: compressed.mediaType,
        originalSize: compressed.originalSize,
        compressedSize: compressed.compressedSize,
        width: compressed.width,
        height: compressed.height,
        name: 'webcam-capture.jpg',
        source: 'webcam',
      });
      webcamStream?.getTracks().forEach((t) => t.stop());
      setWebcamStream(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const TABS = [
    { id: 'file' as Tab, label: 'File Upload', icon: Upload },
    { id: 'url' as Tab, label: 'Image URL', icon: Link },
    { id: 'clipboard' as Tab, label: 'Clipboard', icon: Clipboard },
    { id: 'webcam' as Tab, label: 'Webcam', icon: Camera },
  ];

  if (currentImage) {
    return (
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative aspect-video max-h-72 overflow-hidden">
          <img
            src={currentImage.previewUrl}
            alt={`Uploaded image: ${currentImage.name}`}
            decoding="async"
            className="h-full w-full object-contain bg-[var(--bg-void)]"
          />
          {/* Metadata overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex flex-wrap gap-2">
              {[
                { label: currentImage.name, icon: '📄' },
                { label: `${currentImage.width}×${currentImage.height}`, icon: '📐' },
                {
                  label: `${formatFileSize(currentImage.originalSize)} → ${formatFileSize(currentImage.compressedSize)}`,
                  icon: '✓',
                  color: 'var(--success)',
                },
              ].map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[10px]"
                  style={{ color: tag.color ?? 'var(--text-primary)' }}
                >
                  {tag.icon} {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-4 py-2">
          <span className="font-inter text-xs text-[var(--text-secondary)]">
            Source: <span className="text-[var(--text-primary)]">{currentImage.source}</span>
          </span>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-inter text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-elevated)] hover:text-[var(--error)]"
          >
            <RefreshCw size={12} />
            Change Image
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setError(null); }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-inter font-500 transition-all duration-200"
            style={{
              backgroundColor: activeTab === id ? 'var(--bg-elevated)' : 'transparent',
              color: activeTab === id ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === id ? '1px solid var(--accent-lens)' : '1px solid transparent',
            }}
          >
            <Icon size={13} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mb-3 flex items-center gap-2 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle size={15} className="shrink-0 text-[var(--error)]" />
            <span className="font-inter text-sm text-[var(--error)]">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-[var(--error)]">
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab content */}
      {activeTab === 'file' && (
        <div
          {...getRootProps()}
          className="relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300"
          style={{
            borderColor: isDragActive ? 'var(--accent-lens)' : 'var(--border-subtle)',
            backgroundColor: isDragActive ? 'var(--accent-lens-dim)' : 'var(--bg-card)',
          }}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]"
            style={{
              boxShadow: isDragActive ? 'var(--glow)' : 'none',
              borderColor: isDragActive ? 'var(--border-accent)' : 'var(--border-subtle)',
            }}
          >
            <Upload size={28} style={{ color: isDragActive ? 'var(--accent-lens)' : 'var(--text-secondary)' }} />
          </motion.div>
          <div>
            <p className="font-grotesk text-base font-600 text-[var(--text-primary)]">
              {isDragActive ? 'Drop image here' : 'Drop image or click to browse'}
            </p>
            <p className="mt-1 font-inter text-xs text-[var(--text-secondary)]">
              JPG · PNG · WEBP · GIF · TIFF · BMP · Max 2MB
            </p>
          </div>
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[var(--accent-lens)]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw size={18} />
                </motion.div>
                <span className="font-mono text-sm">Processing...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'url' && (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
            <Link size={28} className="text-[var(--text-secondary)]" />
          </div>
          <div className="w-full max-w-md">
            <p className="mb-3 text-center font-grotesk text-base font-600 text-[var(--text-primary)]">
              Enter Image URL
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                placeholder="https://example.com/image.jpg"
                className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 font-mono text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--border-accent)]"
                disabled={isProcessing}
              />
              <button
                onClick={handleUrlSubmit}
                disabled={isProcessing || !urlInput.trim()}
                className="rounded-xl bg-[var(--accent-lens)] px-4 py-2.5 font-grotesk text-sm font-600 text-black transition-opacity disabled:opacity-50"
              >
                Load
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'clipboard' && (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
            <Clipboard size={28} className="text-[var(--text-secondary)]" />
          </div>
          <div className="text-center">
            <p className="font-grotesk text-base font-600 text-[var(--text-primary)]">
              Paste from Clipboard
            </p>
            <p className="mt-1 font-inter text-xs text-[var(--text-secondary)]">
              Press <kbd className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] border border-[var(--border-subtle)]">Ctrl+V</kbd> anywhere or click below
            </p>
          </div>
          <button
            onClick={handleClipboardPaste}
            disabled={isProcessing}
            className="flex items-center gap-2 rounded-xl border border-[var(--border-accent)] bg-[var(--accent-lens-dim)] px-6 py-2.5 font-grotesk text-sm font-600 text-[var(--accent-lens)] transition-all hover:bg-[var(--accent-lens)] hover:text-black disabled:opacity-50"
          >
            <Clipboard size={15} />
            Paste Image
          </button>
        </div>
      )}

      {activeTab === 'webcam' && (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
          {!webcamStream ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                <Camera size={28} className="text-[var(--text-secondary)]" />
              </div>
              <div className="text-center">
                <p className="font-grotesk text-base font-600 text-[var(--text-primary)]">Webcam Capture</p>
                <p className="mt-1 font-inter text-xs text-[var(--text-secondary)]">Grant camera access to take a photo</p>
              </div>
              <button
                onClick={startWebcam}
                className="flex items-center gap-2 rounded-xl border border-[var(--border-accent)] bg-[var(--accent-lens-dim)] px-6 py-2.5 font-grotesk text-sm font-600 text-[var(--accent-lens)] transition-all hover:bg-[var(--accent-lens)] hover:text-black"
              >
                <Camera size={15} />
                Start Camera
              </button>
            </>
          ) : (
            <div className="w-full">
              <video
                ref={webcamRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-xl"
                onLoadedMetadata={() => { if (webcamRef.current) webcamRef.current.play(); }}
              />
              <div className="mt-3 flex gap-3">
                <button
                  onClick={captureWebcam}
                  className="flex-1 rounded-xl bg-[var(--accent-lens)] py-2.5 font-grotesk text-sm font-600 text-black transition-opacity hover:opacity-90"
                >
                  📸 Capture
                </button>
                <button
                  onClick={() => { webcamStream.getTracks().forEach((t) => t.stop()); setWebcamStream(null); }}
                  className="rounded-xl border border-[var(--border-subtle)] px-4 py-2.5 font-inter text-sm text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
