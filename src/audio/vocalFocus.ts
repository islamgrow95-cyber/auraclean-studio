/**
 * AuraClean Studio - Vocal Focus (center-channel extraction)
 *
 * Keeps what's panned CENTER (the bayan voice) and reduces what's spread
 * across the STEREO field (background nasheeds / music beds).
 *
 * Math: mid = 0.5*(L+R), side = 0.5*(L-R)
 *   outL = mid + k*side, outR = mid - k*side,  where k = 1 - amount/100
 *
 * Safe no-op on dual-mono sources (side = 0). True-mono sources are bypassed
 * by the caller to avoid any level change.
 */

export interface VocalFocusNodes {
  input: GainNode;
  output: GainNode;
  /** enabled: feature on/off, amount: 0-100, isMono: bypass when true */
  update: (enabled: boolean, amount: number, isMono: boolean) => void;
  dispose: () => void;
}

export function createVocalFocus(ctx: BaseAudioContext): VocalFocusNodes {
  const input = ctx.createGain();
  const output = ctx.createGain();

  const bypassGain = ctx.createGain();
  const focusGain = ctx.createGain();
  input.connect(bypassGain);
  bypassGain.connect(output);

  const splitter = ctx.createChannelSplitter(2);

  // mid = 0.5*L + 0.5*R  (GainNode sums its inputs)
  const midL = ctx.createGain(); midL.gain.value = 0.5;
  const midR = ctx.createGain(); midR.gain.value = 0.5;
  const mid = ctx.createGain();
  splitter.connect(midL, 0);
  splitter.connect(midR, 1);
  midL.connect(mid);
  midR.connect(mid);

  // side = 0.5*L - 0.5*R
  const sideL = ctx.createGain(); sideL.gain.value = 0.5;
  const sideR = ctx.createGain(); sideR.gain.value = -0.5;
  const side = ctx.createGain();
  splitter.connect(sideL, 0);
  splitter.connect(sideR, 1);
  sideL.connect(side);
  sideR.connect(side);

  // stereo out: L' = mid + k*side, R' = mid - k*side
  const kGain = ctx.createGain();
  const kGainInv = ctx.createGain();
  const merger = ctx.createChannelMerger(2);
  mid.connect(merger, 0, 0);
  mid.connect(merger, 0, 1);
  side.connect(kGain);
  kGain.connect(merger, 0, 0);
  side.connect(kGainInv);
  kGainInv.connect(merger, 0, 1);

  input.connect(splitter);
  merger.connect(focusGain);
  focusGain.connect(output);

  const update = (enabled: boolean, amount: number, isMono: boolean) => {
    const k = Math.max(0, Math.min(1, 1 - amount / 100));
    const active = enabled && !isMono;
    // setValueAtTime for sample-accurate offline renders; smooth enough live
    const t = ctx.currentTime;
    bypassGain.gain.setTargetAtTime(active ? 0 : 1, t, 0.015);
    focusGain.gain.setTargetAtTime(active ? 1 : 0, t, 0.015);
    kGain.gain.setTargetAtTime(k, t, 0.015);
    kGainInv.gain.setTargetAtTime(-k, t, 0.015);
  };

  update(true, 70, false);

  const dispose = () => {
    try { input.disconnect(); } catch {}
    try { output.disconnect(); } catch {}
  };

  return { input, output, update, dispose };
}
