import type { ValidationResult } from '../types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/webp': 'WEBP',
  'image/gif': 'GIF',
  'image/tiff': 'TIFF',
  'image/bmp': 'BMP',
};

// Magic byte signatures
const MAGIC_BYTES: Array<{ check: (bytes: Uint8Array) => boolean; type: string }> = [
  {
    check: (b) => b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF,
    type: 'JPEG',
  },
  {
    check: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47,
    type: 'PNG',
  },
  {
    check: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46,
    type: 'GIF',
  },
  {
    check: (b) => b[0] === 0x42 && b[1] === 0x4D,
    type: 'BMP',
  },
  {
    // WEBP: RIFF....WEBP
    check: (b) =>
      b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
    type: 'WEBP',
  },
  {
    // TIFF little-endian
    check: (b) => b[0] === 0x49 && b[1] === 0x49 && b[2] === 0x2A && b[3] === 0x00,
    type: 'TIFF',
  },
  {
    // TIFF big-endian
    check: (b) => b[0] === 0x4D && b[1] === 0x4D && b[2] === 0x00 && b[3] === 0x2A,
    type: 'TIFF',
  },
];

function readFileBytes(file: File, numBytes: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(e.target.result));
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsArrayBuffer(file.slice(0, numBytes));
  });
}

export async function validateImageFile(file: File): Promise<ValidationResult> {
  // 1. Size check
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is ${sizeMB}MB. Maximum allowed size is 5MB.`,
    };
  }

  // 2. MIME type check
  if (!ALLOWED_TYPES[file.type]) {
    return {
      valid: false,
      error: `File type "${file.type || 'unknown'}" is not supported. Use JPG, PNG, WEBP, GIF, TIFF, or BMP.`,
    };
  }

  // 3. Magic bytes verification
  try {
    const bytes = await readFileBytes(file, 12);
    const matchedMagic = MAGIC_BYTES.some((m) => m.check(bytes));

    if (!matchedMagic) {
      return {
        valid: false,
        error: 'File content does not match its declared type. The file may be corrupt or renamed.',
      };
    }
  } catch {
    return {
      valid: false,
      error: 'Could not read file for validation.',
    };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    const ext = parsed.pathname.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff'].includes(ext || '');
  } catch {
    return false;
  }
}
