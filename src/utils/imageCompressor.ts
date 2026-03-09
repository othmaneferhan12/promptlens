import type { CompressedImage } from '../types';

const MAX_DIMENSION = 800;
const JPEG_QUALITY = 0.85;

function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Failed to load image for dimension check'));
    img.src = src;
  });
}

export async function compressImage(file: File): Promise<CompressedImage> {
  const originalSize = file.size;

  // Read file as data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('FileReader failed'));
    reader.readAsDataURL(file);
  });

  // Get natural dimensions
  const { width: origW, height: origH } = await getImageDimensions(dataUrl);

  // Calculate scaled dimensions (preserve aspect ratio)
  let targetW = origW;
  let targetH = origH;
  if (origW > MAX_DIMENSION || origH > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / origW, MAX_DIMENSION / origH);
    targetW = Math.round(origW * ratio);
    targetH = Math.round(origH * ratio);
  }

  // Draw to canvas and compress
  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to draw image to canvas'));
    img.src = dataUrl;
  });

  ctx.drawImage(img, 0, 0, targetW, targetH);

  // Export as JPEG (best compression ratio for photos)
  const compressedDataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);

  // Strip the data URL prefix to get raw base64
  const base64 = compressedDataUrl.replace(/^data:image\/jpeg;base64,/, '');
  const compressedSize = Math.round((base64.length * 3) / 4);

  return {
    base64,
    mediaType: 'image/jpeg',
    originalSize,
    compressedSize,
    width: targetW,
    height: targetH,
  };
}

export async function compressFromUrl(url: string): Promise<CompressedImage> {
  // Fetch the image through a CORS proxy or directly
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

  const blob = await response.blob();
  const file = new File([blob], 'remote-image', { type: blob.type || 'image/jpeg' });
  return compressImage(file);
}

export async function compressFromBase64(
  base64: string,
  mediaType: string
): Promise<CompressedImage> {
  const dataUrl = `data:${mediaType};base64,${base64}`;

  // Estimate original size
  const originalSize = Math.round((base64.length * 3) / 4);

  const { width: origW, height: origH } = await getImageDimensions(dataUrl);

  let targetW = origW;
  let targetH = origH;
  if (origW > MAX_DIMENSION || origH > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / origW, MAX_DIMENSION / origH);
    targetW = Math.round(origW * ratio);
    targetH = Math.round(origH * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });

  ctx.drawImage(img, 0, 0, targetW, targetH);
  const compressedDataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  const outBase64 = compressedDataUrl.replace(/^data:image\/jpeg;base64,/, '');
  const compressedSize = Math.round((outBase64.length * 3) / 4);

  return {
    base64: outBase64,
    mediaType: 'image/jpeg',
    originalSize,
    compressedSize,
    width: targetW,
    height: targetH,
  };
}
