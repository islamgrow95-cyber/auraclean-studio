import React from 'react';
import { VolumeX, Waves, Mic2, Activity, Zap, Check } from 'lucide-react';
import { DSPParams } from '../audio/audioUtils';

interface DSPControlRackProps {
  params: DSPParams;
  onChange: (updated: Partial<DSPParams>) => void;
  gateAttenuationDb: number;
}

export const DSPControlRack: React.FC<DSPControlRackProps> = ({
  params,
  onChange,
  gateAttenuationDb,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Panel 1: Dynamic Noise Gate */}
      <div className="bg-[#0f172a]/75 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <VolumeX className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-slate-200">Dynamic Noise Gate</h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={params.gateEnabled}
              onChange={(e) => onChange({ gateEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>

        <div className="space-y-3.5 flex-1">
          {/* Threshold */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Threshold</span>
              <span className="font-mono tabular-nums text-cyan-400">{params.gateThreshold} dB</span>
            </div>
            <input
              type="range"
              min="-80"
              max="-10"
              step="1"
              value={params.gateThreshold}
              disabled={!params.gateEnabled}
              onChange={(e) => onChange({ gateThreshold: parseInt(e.target.value) })}
              className="w-full disabled:opacity-40"
            />
          </div>

          {/* Release Speed */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Release Time</span>
              <span className="font-mono tabular-nums text-cyan-400">{params.gateRelease} ms</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="5"
              value={params.gateRelease}
              disabled={!params.gateEnabled}
              onChange={(e) => onChange({ gateRelease: parseInt(e.target.value) })}
              className="w-full disabled:opacity-40"
            />
          </div>

          {/* Gate Floor / Attenuation */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Noise Floor Cut</span>
              <span className="font-mono tabular-nums text-cyan-400">{params.gateFloor} dB</span>
            </div>
            <input
              type="range"
              min="-60"
              max="-6"
              step="2"
              value={params.gateFloor}
              disabled={!params.gateEnabled}
              onChange={(e) => onChange({ gateFloor: parseInt(e.target.value) })}
              className="w-full disabled:opacity-40"
            />
          </div>

          {/* Live Gate Attenuation Meter */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-500">Gate Clamping Meter</span>
              <span className="font-mono text-cyan-400 tabular-nums">
                {gateAttenuationDb < -0.5 ? `${gateAttenuationDb.toFixed(1)} dB` : 'Open (0 dB)'}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-rose-500 transition-all duration-75"
                style={{
                  width: `${Math.min(100, (Math.abs(gateAttenuationDb) / 40) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Panel 2: Frequency Shaping & Low/High Cut */}
      <div className="bg-[#0f172a]/75 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold text-slate-200">Rumble & Hiss Filters</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Biquad Cut</span>
        </div>

        <div className="space-y-3.5 flex-1">
          {/* High Pass (Low-Cut Rumble) */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">High-Pass (Low Rumble Cut)</span>
              <span className="font-mono tabular-nums text-indigo-400">{params.hpCutoff} Hz</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="5"
              value={params.hpCutoff}
              onChange={(e) => onChange({ hpCutoff: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Low Pass (High-Cut Hiss) */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Low-Pass (High Hiss Cut)</span>
              <span className="font-mono tabular-nums text-indigo-400">{params.lpCutoff} Hz</span>
            </div>
            <input
              type="range"
              min="2000"
              max="20000"
              step="100"
              value={params.lpCutoff}
              onChange={(e) => onChange({ lpCutoff: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Notch Filters (Mains Hum & Harmonics) */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium block">Electrical Mains Hum Notch:</span>
              <button
                type="button"
                onClick={() => {
                  const is50 = params.humRemoval50HzHarmonics !== false && params.notch50Hz !== false;
                  const is60 = Boolean(params.notch60Hz || params.humRemoval60HzHarmonics);
                  const bothActive = is50 && is60;
                  const next = !bothActive;
                  onChange({
                    humRemoval50HzHarmonics: next,
                    notch50Hz: next,
                    notch100Hz: next,
                    notch150Hz: next,
                    notch200Hz: next,
                    humRemoval60HzHarmonics: next,
                    notch60Hz: next,
                    notch120Hz: next,
                    notch180Hz: next,
                    notch240Hz: next,
                  });
                }}
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                  (params.humRemoval50HzHarmonics !== false && params.notch50Hz !== false) &&
                  Boolean(params.notch60Hz || params.humRemoval60HzHarmonics)
                    ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                Both 50Hz+60Hz
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const next = !(params.humRemoval50HzHarmonics !== false && params.notch50Hz !== false);
                  onChange({
                    humRemoval50HzHarmonics: next,
                    notch50Hz: next,
                    notch100Hz: next,
                    notch150Hz: next,
                    notch200Hz: next,
                  });
                }}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center gap-1 border ${
                  params.humRemoval50HzHarmonics !== false && params.notch50Hz !== false
                    ? 'border-indigo-500/60 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
                title="50 Hz fundamental + 100Hz, 150Hz, 200Hz harmonics (Pakistan / UK / EU)"
              >
                {(params.humRemoval50HzHarmonics !== false && params.notch50Hz !== false) && <Check className="w-3 h-3 text-indigo-400" />}
                <span>50Hz (PK/EU)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = !Boolean(params.notch60Hz || params.humRemoval60HzHarmonics);
                  onChange({
                    humRemoval60HzHarmonics: next,
                    notch60Hz: next,
                    notch120Hz: next,
                    notch180Hz: next,
                    notch240Hz: next,
                  });
                }}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center gap-1 border ${
                  Boolean(params.notch60Hz || params.humRemoval60HzHarmonics)
                    ? 'border-cyan-500/60 bg-cyan-500/20 text-cyan-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
                title="60 Hz fundamental + 120Hz, 180Hz, 240Hz harmonics (US & Ground Loops)"
              >
                {Boolean(params.notch60Hz || params.humRemoval60HzHarmonics) && <Check className="w-3 h-3 text-cyan-400" />}
                <span>60Hz (US/Buzz)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel 3: Voice Isolation & Parametric EQ */}
      <div className="bg-[#0f172a]/75 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Mic2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-slate-200">Voice Isolation Mode</h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400/90">Peaking EQ</span>
        </div>

        <div className="space-y-3.5 flex-1">
          {/* Vocal Band Gain */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Vocal Gain Boost / Cut</span>
              <span className="font-mono tabular-nums text-emerald-400">
                {params.vocalGain > 0 ? `+${params.vocalGain}` : params.vocalGain} dB
              </span>
            </div>
            <input
              type="range"
              min="-24"
              max="18"
              step="0.5"
              value={params.vocalGain}
              onChange={(e) => onChange({ vocalGain: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Vocal Center Frequency */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Vocal Formant Frequency</span>
              <span className="font-mono tabular-nums text-emerald-400">{params.vocalFreq} Hz</span>
            </div>
            <input
              type="range"
              min="500"
              max="4500"
              step="50"
              value={params.vocalFreq}
              onChange={(e) => onChange({ vocalFreq: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Bandwidth Q */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Bandwidth (Q Factor)</span>
              <span className="font-mono tabular-nums text-emerald-400">{params.vocalQ.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={params.vocalQ}
              onChange={(e) => onChange({ vocalQ: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* De-Esser Toggle */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">De-Esser (Sibilance Cut)</span>
            <button
              type="button"
              onClick={() => onChange({ deEsserEnabled: !params.deEsserEnabled })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                params.deEsserEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {params.deEsserEnabled ? 'Active (-6dB @ 6.4kHz)' : 'Off'}
            </button>
          </div>
        </div>
      </div>

      {/* Panel 4: Dynamics Compressor & Studio Leveler */}
      <div className="bg-[#0f172a]/75 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold text-slate-200">Dynamics & Leveler</h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={params.compressorEnabled}
              onChange={(e) => onChange({ compressorEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        <div className="space-y-3.5 flex-1">
          {/* Compressor Threshold */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Compression Threshold</span>
              <span className="font-mono tabular-nums text-amber-400">{params.compThreshold} dB</span>
            </div>
            <input
              type="range"
              min="-40"
              max="0"
              step="1"
              value={params.compThreshold}
              disabled={!params.compressorEnabled}
              onChange={(e) => onChange({ compThreshold: parseInt(e.target.value) })}
              className="w-full disabled:opacity-40"
            />
          </div>

          {/* Compression Ratio */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Compression Ratio</span>
              <span className="font-mono tabular-nums text-amber-400">{params.compRatio.toFixed(1)}:1</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={params.compRatio}
              disabled={!params.compressorEnabled}
              onChange={(e) => onChange({ compRatio: parseFloat(e.target.value) })}
              className="w-full disabled:opacity-40"
            />
          </div>

          {/* Master Output Gain */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Master Level Makeup</span>
              <span className="font-mono tabular-nums text-amber-400">{params.masterGain.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="2.5"
              step="0.05"
              value={params.masterGain}
              onChange={(e) => onChange({ masterGain: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* DSP Invariants Status */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Peak Limiter:</span>
            <span className="text-emerald-400 font-mono">Anti-Clipping (-0.1 dBFS)</span>
          </div>
        </div>
      </div>

      {/* Panel 5: Vocal Focus (Center-Channel Extraction) */}
      <div className="bg-[#0f172a]/75 border border-emerald-500/40 rounded-2xl p-4 space-y-4 shadow-xl shadow-emerald-500/10 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Mic2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-slate-200">Vocal Focus</h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={params.vocalFocus !== false}
              onChange={(e) => onChange({ vocalFocus: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        <div className="space-y-3.5 flex-1">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Center mein boli gayi awaz (bayan) rakhta hai, sides par phaili hui background music ko kam karta hai. Mono recordings par koi asar nahi.
          </p>

          {/* Background Reduction Amount */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Background Music Reduction</span>
              <span className="font-mono tabular-nums text-emerald-400">{params.vocalFocusAmount ?? 70}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={params.vocalFocusAmount ?? 70}
              disabled={params.vocalFocus === false}
              onChange={(e) => onChange({ vocalFocusAmount: parseInt(e.target.value) })}
              className="w-full disabled:opacity-40"
            />
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Status:</span>
            <span className={`font-mono ${params.vocalFocus !== false ? 'text-emerald-400' : 'text-slate-500'}`}>
              {params.vocalFocus !== false ? 'Voice isolated from music' : 'Off — full stereo mix'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
