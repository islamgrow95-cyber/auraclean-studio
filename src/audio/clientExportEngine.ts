/**
 * AuraClean Studio - In-Browser Export Engine (ffmpeg.wasm)
 *
 * Used automatically when the app is deployed WITHOUT its Node backend
 * (e.g. GitHub Pages or AI Studio static publish) — where /api/upload-session
 * returns 405. Runs the IDENTICAL studio DSP filter chain as server.ts,
 * entirely on the user's device. No upload, no server, works offline after
 * the one-time ~31MB engine download.
 */

import { buildFFmpegFilters } from './ffmpegFilters';

// Bundled same-origin (no CDN dependency, works offline after first load)
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';

export interface ClientExportOptions {
  file: File;
  exportType: 'video' | 'audio';
  exportFormat: string; // 'mp4' | 'mp3' | 'wav'
  voiceTone?: 'original' | 'mota' | 'bareek' | 'cleaned';
  dspParams?: any;
  bitDepth?: 16 | 24;
  exportName?: string;
  onProgress?: (progress: number, stageText: string) => void;
}

type FFmpegInstance = {
  load: (opts: { coreURL: string; wasmURL: string }) => Promise<void>;
  on: (event: 'progress', cb: (e: { progress: number }) => void) => void;
  off: (event: 'progress', cb: (e: { progress: number }) => void) => void;
  writeFile: (name: string, data: Uint8Array) => Promise<void>;
  exec: (args: string[]) => Promise<number>;
  readFile: (name: string) => Promise<Uint8Array>;
  deleteFile: (name: string) => Promise<void>;
};

let ffmpegInstance: FFmpegInstance | null = null;
let loadPromise: Promise<void> | null = null;

async function fetchWithProgress(
  url: string,
  mime: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Engine download failed (${res.status})`);
  const total = Number(res.headers.get('content-length')) || 0;
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total > 0) onProgress?.(Math.round((received / total) * 100));
  }
  const blob = new Blob(chunks as BlobPart[], { type: mime });
  return URL.createObjectURL(blob);
}

async function getFFmpegEngine(
  onProgress?: (progress: number, stageText: string) => void
): Promise<FFmpegInstance> {
  if (ffmpegInstance) return ffmpegInstance;
  if (!loadPromise) {
    loadPromise = (async () => {
      onProgress?.(2, 'Studio engine load ho raha hai (pehli baar ~31MB)...');
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const ffmpeg = new FFmpeg() as unknown as FFmpegInstance;

      // Download core files with visible progress (then cached as blob URLs)
      const [coreBlobURL, wasmBlobURL] = await Promise.all([
        fetchWithProgress(coreURL, 'text/javascript', (p) =>
          onProgress?.(2 + Math.round(p * 0.25), `Studio engine load ho raha hai (${p}%)...`)
        ),
        fetchWithProgress(wasmURL, 'application/wasm', (p) =>
          onProgress?.(2 + Math.round(p * 0.25), `Studio engine load ho raha hai (${p}%)...`)
        ),
      ]);

      onProgress?.(30, 'Studio engine taiyar ho raha hai...');
      await ffmpeg.load({ coreURL: coreBlobURL, wasmURL: wasmBlobURL });
      ffmpegInstance = ffmpeg;
    })().catch((err) => {
      loadPromise = null; // allow retry on failure
      throw err;
    });
  }
  await loadPromise;
  return ffmpegInstance!;
}

function sanitizeFileName(name: string, fallback: string): string {
  const clean = (name || fallback)
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 120);
  return clean || fallback;
}

/**
 * Export media fully in-browser. Mirrors server.ts runSessionProcessing args
 * so the output sounds identical to the server pipeline.
 */
export async function exportWithBrowserEngine(
  options: ClientExportOptions
): Promise<{ fileName: string; blobUrl: string }> {
  const {
    file,
    exportType,
    exportFormat,
    voiceTone = 'original',
    dspParams = {},
    bitDepth = 24,
    exportName,
    onProgress,
  } = options;

  const ffmpeg = await getFFmpegEngine(onProgress);

  const isVideo = exportType === 'video';
  const targetExt = isVideo ? 'mp4' : exportFormat === 'mp3' ? 'mp3' : 'wav';
  const normalizedTone = voiceTone === 'cleaned' ? 'original' : voiceTone;

  const srcExt = (file.name.split('.').pop() || (isVideo ? 'mp4' : 'wav'))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 5) || (isVideo ? 'mp4' : 'wav');
  const inputName = `input_${Date.now()}.${srcExt || 'bin'}`;
  const outputName = `output_${Date.now()}.${targetExt}`;

  const toneSuffix =
    normalizedTone === 'mota'
      ? '_Mota_Deep'
      : normalizedTone === 'bareek'
      ? '_Bareek_High'
        : '_Cleaned_Studio';
  const baseName = file.name.replace(/\.[^/.]+$/, '') || 'Audio';
  const finalFileName = sanitizeFileName(
    exportName
      ? exportName.endsWith(`.${targetExt}`)
        ? exportName
        : `${exportName}.${targetExt}`
      : `AuraClean_${baseName}${toneSuffix}.${targetExt}`,
    `AuraClean_Export.${targetExt}`
  );

  const onFfmpegProgress = ({ progress }: { progress: number }) => {
    const pct = Math.max(0, Math.min(1, progress || 0));
    onProgress?.(
      Math.round(35 + pct * 58),
      `Studio engine process kar raha hai (${Math.round(pct * 100)}%) — phone par hi, thoda waqt lagega...`
    );
  };

  try {
    onProgress?.(32, 'File engine mein load ho rahi hai...');
    const { fetchFile } = await import('@ffmpeg/util');
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(inputName, fileData);

    const filterString = buildFFmpegFilters(dspParams, normalizedTone);

    let args: string[];
    if (isVideo) {
      // Same as server: copy video stream untouched, clean + re-encode audio
      args = [
        '-i', inputName,
        '-af', filterString,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-b:a', '256k',
        '-movflags', '+faststart',
        '-y', outputName,
      ];
    } else if (targetExt === 'mp3') {
      args = [
        '-i', inputName,
        '-vn',
        '-af', filterString,
        '-c:a', 'libmp3lame',
        '-b:a', '320k',
        '-y', outputName,
      ];
    } else {
      const pcmCodec = bitDepth === 24 ? 'pcm_s24le' : 'pcm_s16le';
      args = [
        '-i', inputName,
        '-vn',
        '-af', filterString,
        '-c:a', pcmCodec,
        '-y', outputName,
      ];
    }

    onProgress?.(35, 'Studio DSP: Hum Cut, Denoise, EQ, Loudness... (phone par)');
    ffmpeg.on('progress', onFfmpegProgress);
    let exitCode = 1;
    try {
      exitCode = await ffmpeg.exec(args);
    } finally {
      ffmpeg.off('progress', onFfmpegProgress);
    }
    if (exitCode !== 0) {
      throw new Error(`Studio engine exited with code ${exitCode}`);
    }

    onProgress?.(95, 'Download taiyar ho raha hai...');
    const outData = await ffmpeg.readFile(outputName);
    const mime =
      targetExt === 'mp3' ? 'audio/mpeg' : targetExt === 'wav' ? 'audio/wav' : 'video/mp4';
    // Copy out of the wasm heap before cleanup
    const blob = new Blob([outData.slice().buffer as ArrayBuffer], { type: mime });
    const blobUrl = URL.createObjectURL(blob);

    onProgress?.(100, 'Mukammal! File taiyar hai.');
    return { fileName: finalFileName, blobUrl };
  } finally {
    // Free wasm FS memory (best effort)
    try { await ffmpeg.deleteFile(inputName); } catch {}
    try { await ffmpeg.deleteFile(outputName); } catch {}
  }
}

/** Quick check: is the Node backend reachable? */
export async function isBackendReachable(timeoutMs = 7000): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch('/api/upload-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: '__probe__', fileSize: 0, totalChunks: 0 }),
      signal: ctrl.signal,
    }).finally(() => clearTimeout(t));
    // Any JSON response (even 400 for the dummy probe) means the backend is alive.
    // 405/404/501 from a static host means no backend.
    return res.status !== 405 && res.status !== 404 && res.status !== 501;
  } catch {
    return false;
  }
}
