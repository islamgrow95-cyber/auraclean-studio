/**
 * AuraClean Studio - Chunked Media Upload & Streaming Export Client
 * Bypasses Cloud Run / GFE 32MB payload limits by slicing large video/audio into safe chunks.
 * Built for gigantic media files: handles up to 5GB audio & full-length video without 413 or timeout errors.
 */

export interface ServerExportOptions {
  file: File;
  exportType: 'video' | 'audio';
  exportFormat?: string;
  voiceTone?: 'original' | 'mota' | 'bareek' | 'cleaned';
  dspParams?: any;
  bitDepth?: 16 | 24;
  exportName?: string;
  onProgress?: (progress: number, stageText: string) => void;
}

export async function uploadAndProcessMedia(options: ServerExportOptions): Promise<{
  fileName: string;
  downloadUrl: string;
}> {
  const {
    file,
    exportType,
    exportFormat = exportType === 'video' ? 'mp4' : 'wav',
    voiceTone = 'original',
    dspParams = {},
    bitDepth = 24,
    exportName,
    onProgress,
  } = options;

  // Dynamic chunk sizing tailored for up to 5GB files:
  // Files > 1GB: 16 MB per chunk (halves total requests while strictly under 32MB Cloud Run limit)
  // Files > 150MB: 12 MB per chunk
  // Smaller files: 8 MB per chunk
  const CHUNK_SIZE =
    file.size > 1024 * 1024 * 1024
      ? 16 * 1024 * 1024
      : file.size > 150 * 1024 * 1024
      ? 12 * 1024 * 1024
      : 8 * 1024 * 1024;

  const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
  const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
  const fileSizeGb = (file.size / (1024 * 1024 * 1024)).toFixed(2);
  const sizeLabel = file.size > 1024 * 1024 * 1024 ? `${fileSizeGb} GB` : `${fileSizeMb} MB`;

  onProgress?.(3, `Studio session initialize ho raha hai (${sizeLabel})...`);

  // Step 1: Create upload session on server
  const sessionRes = await fetch('/api/upload-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileSize: file.size,
      totalChunks,
    }),
  });

  if (!sessionRes.ok) {
    const errText = await sessionRes.text().catch(() => '');
    throw new Error(`Upload session creation failed (${sessionRes.status}): ${errText}`);
  }

  const { sessionId } = await sessionRes.json();
  if (!sessionId) {
    throw new Error('Server returned invalid upload session ID.');
  }

  // Step 2: Upload chunks sequentially with retry mechanism
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const chunkBlob = file.slice(start, end);

    let uploaded = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!uploaded && attempts < maxAttempts) {
      attempts++;
      try {
        const formData = new FormData();
        formData.append('sessionId', sessionId);
        formData.append('chunkIndex', String(chunkIndex));
        formData.append('totalChunks', String(totalChunks));
        formData.append('chunk', chunkBlob, `chunk_${chunkIndex}.part`);

        const chunkRes = await fetch('/api/upload-chunk', {
          method: 'POST',
          body: formData,
        });

        if (!chunkRes.ok) {
          throw new Error(`Chunk ${chunkIndex + 1}/${totalChunks} upload error: HTTP ${chunkRes.status}`);
        }

        uploaded = true;
      } catch (err: any) {
        if (attempts >= maxAttempts) {
          throw new Error(`Chunk ${chunkIndex + 1}/${totalChunks} upload fail ho gaya: ${err.message}`);
        }
        await new Promise((r) => setTimeout(r, 600 * attempts));
      }
    }

    // Progress: chunks cover 3% to 65% of overall process
    const chunkPercent = Math.round(3 + ((chunkIndex + 1) / totalChunks) * 62);
    const uploadedMb = (end / (1024 * 1024)).toFixed(1);
    onProgress?.(
      chunkPercent,
      `Uploading chunks: ${chunkIndex + 1} of ${totalChunks} (${uploadedMb} MB / ${sizeLabel})...`
    );
  }

  // Step 3: Trigger High-Speed Studio DSP FFmpeg processing in background with async polling
  onProgress?.(
    68,
    'FFmpeg Studio Engine: 50Hz/60Hz Hum Cut, Spectral Denoise aur Vocal Presence process ho rahi hai...'
  );

  const processRes = await fetch('/api/process-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      exportType,
      exportFormat,
      voiceTone: voiceTone === 'cleaned' ? 'original' : voiceTone,
      dspParams,
      bitDepth,
      exportName,
      async: true,
    }),
  });

  if (!processRes.ok) {
    const errorJson = await processRes.json().catch(() => null);
    const msg = errorJson?.error || `Processing failed with status ${processRes.status}`;
    throw new Error(msg);
  }

  const initialResponse = await processRes.json();
  let downloadUrl = initialResponse.downloadUrl;
  let finalFileName = initialResponse.fileName;

  // Step 4: If not immediately ready, poll /api/session-status until complete
  // This guarantees zero gateway timeouts even for 5GB audio files that take several minutes
  if (!downloadUrl) {
    const startTime = Date.now();
    let pollComplete = false;

    while (!pollComplete) {
      await new Promise((r) => setTimeout(r, 1500));

      const statusRes = await fetch(`/api/session-status?sessionId=${encodeURIComponent(sessionId)}`);
      if (!statusRes.ok) {
        throw new Error(`Status polling failed with HTTP ${statusRes.status}`);
      }

      const statusData = await statusRes.json();

      if (statusData.status === 'error') {
        throw new Error(statusData.error || 'Server processing error occurred.');
      }

      const elapsedSec = Math.round((Date.now() - startTime) / 1000);
      const elapsedText =
        elapsedSec >= 60
          ? `${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s`
          : `${elapsedSec}s`;

      if (statusData.status === 'ready') {
        downloadUrl = statusData.downloadUrl;
        finalFileName = statusData.fileName;
        pollComplete = true;
      } else {
        // Smoothly progress from 70% to 94% during processing
        const estimatedPct = Math.min(94, 70 + Math.floor(elapsedSec * 0.8));
        const stageMsg =
          statusData.progressStage ||
          'FFmpeg Studio Engine: 50Hz/60Hz Hum Cut, Voice Shield & Denoise...';
        onProgress?.(estimatedPct, `${stageMsg} (elapsed: ${elapsedText})`);
      }
    }
  }

  if (!downloadUrl) {
    throw new Error('Server processing finished without generating a download URL.');
  }

  onProgress?.(96, 'High-speed stream download shuru ho raha hai...');

  // Step 5: Trigger browser download via invisible <a> click (safe for iframe SPAs)
  const link = document.createElement('a');
  link.href = downloadUrl;
  if (finalFileName) {
    link.setAttribute('download', finalFileName);
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  onProgress?.(100, 'Mukammal clean file download ho chuki hai!');

  return {
    fileName: finalFileName || `Cleaned_${file.name}`,
    downloadUrl,
  };
}
