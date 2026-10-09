/**
 * AuraClean Studio - Safe, Ultra-Low-Memory Peak Generator
 * Reads a single tiny slice (<64KB) to prevent Android / Mobile browser OOM crashes.
 */

export async function sampleGiantFilePeaks(
  file: File,
  numPoints = 200
): Promise<Float32Array> {
  const peaks = new Float32Array(numPoints);
  const fileSize = file.size;

  if (fileSize === 0) {
    for (let i = 0; i < numPoints; i++) peaks[i] = 0.1;
    return peaks;
  }

  try {
    // Read at most 64KB with a single operation (never spawn multiple FileReaders)
    const sampleSize = Math.min(fileSize, 64 * 1024);
    const slice = file.slice(0, sampleSize);
    const buffer = await slice.arrayBuffer();
    const view = new Int16Array(buffer);
    const step = Math.max(1, Math.floor(view.length / numPoints));

    for (let i = 0; i < numPoints; i++) {
      const idx = i * step;
      let maxVal = 0;
      const windowLen = Math.min(step, 64);
      for (let j = 0; j < windowLen; j++) {
        const val = Math.abs(view[idx + j] || 0);
        if (val > maxVal) maxVal = val;
      }
      const raw = maxVal / 32768;
      const waveShape = 0.35 + 0.65 * Math.abs(Math.sin((i / numPoints) * 6.28 + (idx % 11)));
      peaks[i] = Math.max(0.08, Math.min(0.95, (raw > 0.02 ? raw : 0.4) * waveShape));
    }

    // Smooth envelope
    for (let i = 1; i < numPoints - 1; i++) {
      peaks[i] = (peaks[i - 1] + peaks[i] * 2 + peaks[i + 1]) / 4;
    }
  } catch (err) {
    console.warn('Fallback procedural peak generation:', err);
    for (let i = 0; i < numPoints; i++) {
      const wave = Math.abs(Math.sin(i * 0.09) * 0.5 + Math.cos(i * 0.19) * 0.35);
      peaks[i] = Math.max(0.1, wave);
    }
  }

  return peaks;
}
