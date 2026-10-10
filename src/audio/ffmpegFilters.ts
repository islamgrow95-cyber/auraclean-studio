/**
 * AuraClean Studio - Shared FFmpeg DSP Filter Builder
 * Framework-free (works in Node server.ts AND in the browser via ffmpeg.wasm).
 * Produces the identical studio filter chain on both paths so exports sound the same.
 */

export function buildFFmpegFilters(dspParams: any, voiceTone: string): string {
  const filters: string[] = [];

  // 0. Vocal Focus (center-channel extraction) — keeps centered voice, reduces
  //    stereo-spread background music. Safe no-op on mono/dual-mono sources.
  if (dspParams.vocalFocus) {
    const amount = typeof dspParams.vocalFocusAmount === 'number'
      ? Math.max(0, Math.min(100, dspParams.vocalFocusAmount))
      : 70;
    const a = (0.5 * (1 - amount / 100)).toFixed(4);
    filters.push(
      `aformat=channel_layouts=stereo,pan=stereo|c0=0.5*c0+0.5*c1+${a}*c0-${a}*c1|c1=0.5*c0+0.5*c1-${a}*c0+${a}*c1`
    );
  }

  // 1. Highpass filter: 70 Hz (protects deep baritone chest voice fundamentals down to 75Hz, cuts sub-rumble)
  const hpFreq = typeof dspParams.hpCutoff === 'number' ? Math.max(50, Math.min(100, dspParams.hpCutoff)) : 70;
  filters.push(`highpass=f=${hpFreq}`);

  // 2. 50 Hz Mains Hum Fundamental + 100Hz Harmonic (Pakistan, UK, EU, Asia)
  const is50Hum = dspParams.notch50Hz !== false || dspParams.humRemoval50HzHarmonics !== false;
  if (is50Hum) {
    filters.push(
      'equalizer=f=50:t=q:w=20:g=-36',
      'equalizer=f=100:t=q:w=24:g=-20'
    );
  }

  // 3. 60 Hz Ground Hum & Harmonics (US, charger & power supply buzz)
  const is60Hum = Boolean(dspParams.notch60Hz || dspParams.humRemoval60HzHarmonics);
  if (is60Hum) {
    filters.push(
      'equalizer=f=60:t=q:w=20:g=-36',
      'equalizer=f=120:t=q:w=24:g=-20'
    );
  }

  // 4. Studio 5-Band Surgical EQ (Warmth, Vocal Presence & Air Sheen)
  const eq80 = typeof dspParams.eq80HzGain === 'number' ? dspParams.eq80HzGain : -1.0;
  const eq250 = typeof dspParams.eq250HzGain === 'number' ? dspParams.eq250HzGain : 1.2;
  const eq3k = typeof dspParams.eq3kHzGain === 'number' ? dspParams.eq3kHzGain : 2.2;
  const eq7k = typeof dspParams.eq7kHzGain === 'number' ? dspParams.eq7kHzGain : 1.2;
  const eq10k = typeof dspParams.eq10kHzGain === 'number' ? dspParams.eq10kHzGain : 0.8;

  filters.push(
    `equalizer=f=80:t=q:w=1:g=${eq80}`,
    `equalizer=f=250:t=q:w=1.2:g=${eq250}`,
    `equalizer=f=3000:t=q:w=1.2:g=${eq3k}`,
    `equalizer=f=7000:t=q:w=1:g=${eq7k}`,
    `equalizer=f=10000:t=q:w=1:g=${eq10k}`
  );

  // 5. Precision De-Esser (Cuts harsh mic sibilance around 6.5kHz)
  if (dspParams.deEsserEnabled !== false) {
    const deEssGain = typeof dspParams.deEsserGain === 'number' ? dspParams.deEsserGain : -5.0;
    filters.push(`equalizer=f=6500:t=q:w=2.5:g=${deEssGain}`);
  }

  // 6. Natural Organic Spectral Denoise (Smooth, zero watery/robotic phase artifacts)
  const nrAmount = typeof dspParams.noiseReductionPercent === 'number'
    ? Math.max(8, Math.min(14, Math.round(dspParams.noiseReductionPercent * 0.15)))
    : 11;
  filters.push(`afftdn=nr=${nrAmount}:nf=-42:tn=1`);

  // 7. Voice Tone Variation Adjustments
  if (voiceTone === 'mota') {
    filters.push('equalizer=f=160:t=q:w=1.2:g=4.0', 'equalizer=f=300:t=q:w=1.2:g=2.0');
  } else if (voiceTone === 'bareek') {
    filters.push('equalizer=f=3200:t=q:w=1.2:g=3.0', 'equalizer=f=7500:t=q:w=1.2:g=2.0');
  }

  // 8. Multi-Stage Dynamic Speech Leveling & Compression
  const compRatio = typeof dspParams.compRatio === 'number' ? dspParams.compRatio : 2.8;
  if (compRatio > 3.0) {
    filters.push('compand=attacks=0.02:decays=0.15:points=-60/-60|-30/-26|-14/-8|0/-1.5');
  } else {
    filters.push('compand=attacks=0.03:decays=0.2:points=-60/-60|-28/-28|-12/-8.5|0/-1.2');
  }

  // 9. Broadcast Loudness Normalization (-14 LUFS Target, -1 dB Peak Limit for YouTube/Broadcast Quality)
  const targetLufs = typeof dspParams.targetLufs === 'number' ? dspParams.targetLufs : -14;
  filters.push(`loudnorm=I=${targetLufs}:LRA=11:TP=-1.0`);

  return filters.join(',');
}
