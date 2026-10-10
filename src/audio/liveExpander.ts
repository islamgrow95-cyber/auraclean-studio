/**
 * AuraClean Studio - Live Multiband Downward Expander
 *
 * Real-time noise + reverb-tail (gunj) reduction for the LIVE preview chain.
 * This is what makes cleaning AUDIBLE on large/streaming files, where the
 * heavy offline spectral processing cannot run.
 *
 * How it works: splits the signal into 3 bands (low/mid/high). In each band,
 * an envelope follower measures the level; anything below the band threshold
 * (steady noise, decaying reverb tails between words) is pushed down with a
 * gentle 2:1 downward expansion. Speech peaks pass through untouched.
 *
 * Safe by design: at 0% amount it's a hard bypass; even at 100% the maximum
 * cut is capped so voice can never be muted.
 */

export interface LiveExpander {
  input: GainNode;
  output: GainNode;
  /** enabled: feature on/off, amount: 0-100 (scales max reduction) */
  update: (enabled: boolean, amount: number) => void;
  dispose: () => void;
}

interface BandDef {
  thresholdDb: number;
  build: (ctx: BaseAudioContext) => BiquadFilterNode[];
}

const BANDS: BandDef[] = [
  {
    // Low band: rumble, mic handling, room boom
    thresholdDb: -45,
    build: (ctx) => {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 350;
      lp.Q.value = 0.7;
      return [lp];
    },
  },
  {
    // Mid band: speech core (bayan voice lives here)
    thresholdDb: -38,
    build: (ctx) => {
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 350;
      hp.Q.value = 0.7;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 4000;
      lp.Q.value = 0.7;
      return [hp, lp];
    },
  },
  {
    // High band: hiss, fan sizzle, reverb shimmer
    thresholdDb: -42,
    build: (ctx) => {
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 4000;
      hp.Q.value = 0.7;
      return [hp];
    },
  },
];

const EXPANSION_RATIO = 2; // 2:1 downward expansion below threshold
const MAX_CUT_DB = 14; // hard cap so voice is never muted
const ATTACK_SEC = 0.008; // fast: catch the decay as soon as speech stops
const RELEASE_SEC = 0.15; // medium: ride the reverb tail down smoothly

export function createLiveExpander(ctx: BaseAudioContext): LiveExpander {
  const input = ctx.createGain();
  const output = ctx.createGain();

  // Hard bypass path (used when disabled or amount = 0)
  const bypassGain = ctx.createGain();
  input.connect(bypassGain);
  bypassGain.connect(output);

  const bandGains: GainNode[] = [];
  const bandAnalysers: AnalyserNode[] = [];
  const scratch = new Float32Array(512);

  BANDS.forEach((band) => {
    const chain = band.build(ctx);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    const g = ctx.createGain();
    g.gain.value = 1;

    // input -> band filters -> tap (analyser) -> expansion gain -> output
    let node: AudioNode = input;
    chain.forEach((f) => {
      node.connect(f);
      node = f;
    });
    node.connect(analyser);
    node.connect(g);
    g.connect(output);

    bandAnalysers.push(analyser);
    bandGains.push(g);
  });

  const measureBandDb = (analyser: AnalyserNode): number => {
    analyser.getFloatTimeDomainData(scratch);
    let sum = 0;
    for (let i = 0; i < scratch.length; i++) {
      const v = scratch[i];
      sum += v * v;
    }
    const rms = Math.sqrt(sum / scratch.length);
    return rms > 0.00001 ? 20 * Math.log10(rms) : -100;
  };

  const update = (enabled: boolean, amount: number) => {
    const t = ctx.currentTime;
    const amt = Math.max(0, Math.min(100, amount)) / 100;
    const active = enabled && amt > 0.01;
    const maxCutDb = MAX_CUT_DB * amt;

    bypassGain.gain.setTargetAtTime(active ? 0 : 1, t, 0.02);

    bandAnalysers.forEach((analyser, i) => {
      const g = bandGains[i];
      const band = BANDS[i];
      if (!active || !band) {
        g.gain.setTargetAtTime(1, t, 0.02);
        return;
      }
      const levelDb = measureBandDb(analyser);
      let cutDb = 0;
      if (levelDb < band.thresholdDb) {
        // Downward expansion: push sub-threshold content down
        cutDb = Math.max(-maxCutDb, (levelDb - band.thresholdDb) * (1 - 1 / EXPANSION_RATIO));
      }
      const targetGain = Math.pow(10, cutDb / 20);
      const tc = targetGain < g.gain.value ? ATTACK_SEC : RELEASE_SEC;
      g.gain.setTargetAtTime(targetGain, t, Math.max(0.005, tc));
    });
  };

  const dispose = () => {
    try {
      input.disconnect();
    } catch {
      /* noop */
    }
    try {
      output.disconnect();
    } catch {
      /* noop */
    }
  };

  return { input, output, update, dispose };
}
