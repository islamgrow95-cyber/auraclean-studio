import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Play,
  Check,
  Zap,
  Volume2,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  VolumeX,
} from 'lucide-react';
import { DSPParams } from '../types';
import { DEFAULT_DSP_PARAMS } from '../audio/audioUtils';

interface AdvancedManualControlsProps {
  params: DSPParams;
  onChange: (updated: Partial<DSPParams>) => void;
  onReset: () => void;
  onPreview: () => void;
  isPlaying: boolean;
}

export const AdvancedManualControls: React.FC<AdvancedManualControlsProps> = ({
  params,
  onChange,
  onReset,
  onPreview,
  isPlaying,
}) => {
  const [isApplied, setIsApplied] = useState(false);

  const handleApply = () => {
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 2000);
  };

  return (
    <div className="bg-[#0b1118]/90 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-xl">
      
      {/* Header with Title and Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 shadow-md shadow-purple-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Advanced 15-Stage Manual Audio Rack</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                DSP Precision
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Fine-tune surgical parameters across noise separation, parametric EQ, dynamics, and broadcast loudness
            </p>
          </div>
        </div>

        {/* Global Action Bar: RESET, PREVIEW, APPLY */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onChange({
                voiceIsolationPercent: 68,
                noiseReductionPercent: 32,
                humRemoval50HzHarmonics: true,
                notch50Hz: true,
                notch100Hz: true,
                notch150Hz: false,
                notch200Hz: false,
                reverbReductionPercent: 24,
                deReverbPercent: 24,
                deClipEnabled: true,
                eq80HzGain: -1.0,
                eq250HzGain: 0.8,
                eq3kHzGain: 1.8,
                eq7kHzGain: 1.0,
                eq10kHzGain: 0.5,
                compressorEnabled: true,
                compRatio: 2.2,
                compThreshold: -19,
                limiterCeilingDb: -1.0,
                hpCutoff: 65,
                lpCutoff: 9000,
              });
              handleApply();
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-400/50 hover:border-amber-400 text-amber-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            title="Apply 100% Asli Awaaz Golden DSP settings for Peer Ajmal Raza Qadri & Islamic Bayan"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Apply Peer Ajmal Qadri Bayan Preset</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>

          <button
            type="button"
            onClick={onPreview}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-cyan-500/40'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isPlaying ? 'fill-slate-950' : ''}`} />
            <span>{isPlaying ? 'PLAYING PREVIEW' : 'PREVIEW'}</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
          >
            {isApplied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>APPLIED!</span>
              </>
            ) : (
              <span>APPLY</span>
            )}
          </button>
        </div>
      </div>

      {/* 4 Control Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Column 1: AI Separation & Clarity */}
        <div className="bg-[#060a12] border border-slate-800/80 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs border-b border-slate-800/60 pb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Separation & Clarity</span>
          </div>

          {/* Noise Reduction 0-100% */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Noise Reduction:</span>
              <span className="font-mono font-bold text-cyan-400">{params.noiseReductionPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.noiseReductionPercent}
              onChange={(e) => onChange({ noiseReductionPercent: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Voice Enhancement 0-100% */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Voice Enhancement:</span>
              <span className="font-mono font-bold text-cyan-400">{params.voiceEnhancePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.voiceEnhancePercent}
              onChange={(e) => onChange({ voiceEnhancePercent: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Voice Isolation 0-100% */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Voice Isolation:</span>
              <span className="font-mono font-bold text-cyan-400">{params.voiceIsolationPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.voiceIsolationPercent}
              onChange={(e) => onChange({ voiceIsolationPercent: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Vocal Focus: center-channel extraction (keeps bayan voice, reduces stereo music) */}
          <div className="space-y-1 pt-1 border-t border-cyan-500/20">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-cyan-300">Vocal Focus (music kam):</span>
              <button
                type="button"
                onClick={() => onChange({ vocalFocus: params.vocalFocus === false })}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                  params.vocalFocus !== false
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {params.vocalFocus !== false ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Background music reduction:</span>
              <span className="font-mono font-bold text-cyan-400">{params.vocalFocusAmount ?? 70}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={params.vocalFocusAmount ?? 70}
              disabled={params.vocalFocus === false}
              onChange={(e) => onChange({ vocalFocusAmount: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* Clarity 0-100% */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Clarity:</span>
              <span className="font-mono font-bold text-cyan-400">{params.clarityPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.clarityPercent}
              onChange={(e) => onChange({ clarityPercent: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Column 2: 5-Band Precision Surgical EQ */}
        <div className="bg-[#060a12] border border-slate-800/80 rounded-xl p-4 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
              <Activity className="w-4 h-4" />
              <span>5-Band Surgical EQ</span>
            </div>
            <span className="text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Golden Curve
            </span>
          </div>

          {/* 80 Hz: -3 dB */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <span>80 Hz</span>
                <span className="text-[10px] text-slate-500">(Rumble Cut)</span>
              </span>
              <span className="font-mono font-bold text-amber-400">
                {(params.eq80HzGain !== undefined ? params.eq80HzGain : -3.0) > 0 ? `+${params.eq80HzGain}` : (params.eq80HzGain !== undefined ? params.eq80HzGain : -3.0)} dB
              </span>
            </div>
            <input
              type="range"
              min="-12"
              max="6"
              step="0.5"
              value={params.eq80HzGain !== undefined ? params.eq80HzGain : -3.0}
              onChange={(e) => onChange({ eq80HzGain: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 200–300 Hz: -2 dB */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <span>200–300 Hz</span>
                <span className="text-[10px] text-slate-500">(Boxy Cut)</span>
              </span>
              <span className="font-mono font-bold text-amber-400">
                {(params.eq250HzGain !== undefined ? params.eq250HzGain : -2.0) > 0 ? `+${params.eq250HzGain}` : (params.eq250HzGain !== undefined ? params.eq250HzGain : -2.0)} dB
              </span>
            </div>
            <input
              type="range"
              min="-8"
              max="6"
              step="0.5"
              value={params.eq250HzGain !== undefined ? params.eq250HzGain : -2.0}
              onChange={(e) => onChange({ eq250HzGain: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 2–4 kHz: +1.5 dB */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <span>2–4 kHz</span>
                <span className="text-[10px] text-slate-500">(Clarity)</span>
              </span>
              <span className="font-mono font-bold text-amber-400">
                {(params.eq3kHzGain !== undefined ? params.eq3kHzGain : 1.5) > 0 ? `+${params.eq3kHzGain !== undefined ? params.eq3kHzGain : 1.5}` : (params.eq3kHzGain !== undefined ? params.eq3kHzGain : 1.5)} dB
              </span>
            </div>
            <input
              type="range"
              min="-6"
              max="8"
              step="0.5"
              value={params.eq3kHzGain !== undefined ? params.eq3kHzGain : 1.5}
              onChange={(e) => onChange({ eq3kHzGain: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 6–8 kHz: +1.0 dB */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <span>6–8 kHz</span>
                <span className="text-[10px] text-slate-500">(Speech Presence)</span>
              </span>
              <span className="font-mono font-bold text-amber-400">
                {(params.eq7kHzGain !== undefined ? params.eq7kHzGain : 1.0) > 0 ? `+${params.eq7kHzGain !== undefined ? params.eq7kHzGain : 1.0}` : (params.eq7kHzGain !== undefined ? params.eq7kHzGain : 1.0)} dB
              </span>
            </div>
            <input
              type="range"
              min="-6"
              max="8"
              step="0.5"
              value={params.eq7kHzGain !== undefined ? params.eq7kHzGain : 1.0}
              onChange={(e) => onChange({ eq7kHzGain: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 10 kHz+: +1.0 dB max */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <span>10 kHz+</span>
                <span className="text-[10px] text-slate-500">(Air Sheen, max +1dB)</span>
              </span>
              <span className="font-mono font-bold text-amber-400">
                {(params.eq10kHzGain !== undefined ? params.eq10kHzGain : 1.0) > 0 ? `+${params.eq10kHzGain !== undefined ? params.eq10kHzGain : 1.0}` : (params.eq10kHzGain !== undefined ? params.eq10kHzGain : 1.0)} dB
              </span>
            </div>
            <input
              type="range"
              min="-6"
              max="2"
              step="0.5"
              value={params.eq10kHzGain !== undefined ? params.eq10kHzGain : 1.0}
              onChange={(e) => onChange({ eq10kHzGain: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Column 3: Dynamics, De-Clip & De-Reverb */}
        <div className="bg-[#060a12] border border-slate-800/80 rounded-xl p-4 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs">
              <Zap className="w-4 h-4" />
              <span>Dynamics & De-Clip</span>
            </div>
            <span className="text-[10px] font-mono text-purple-400/90 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
              Anti-Distortion
            </span>
          </div>

          {/* De-Clip Switch (ON for distorted / "phati hui" awaaz) */}
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>De-Clip (Distortion Fix)</span>
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={params.deClipEnabled !== false}
                  onChange={(e) => onChange({ deClipEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-7 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              ON: Agar awaaz distorted/phati hui hai to spline interpolation se theek karta hai
            </p>
          </div>

          {/* Compressor: 2:1 to 3:1 ratio */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Compressor (2:1 to 3:1):</span>
              <span className="font-mono font-bold text-purple-400">
                {(params.compRatio || 2.5).toFixed(1)}:1
              </span>
            </div>
            <input
              type="range"
              min="1.5"
              max="4.0"
              step="0.1"
              value={params.compRatio || 2.5}
              onChange={(e) => onChange({ compRatio: parseFloat(e.target.value), compressorEnabled: true })}
              className="w-full accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* De-Reverb (20–35%) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>De-Reverb (20–35%):</span>
              <span className="font-mono font-bold text-purple-400">{params.reverbReductionPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="1"
              value={params.reverbReductionPercent}
              onChange={(e) => onChange({ reverbReductionPercent: parseInt(e.target.value), deReverbPercent: parseInt(e.target.value) })}
              className="w-full accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* De-Esser */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>De-Esser Sibilance:</span>
              <span className="font-mono font-bold text-purple-400">
                {Math.round(Math.abs(params.deEsserGain) * 6)}%
              </span>
            </div>
            <input
              type="range"
              min="-18"
              max="0"
              step="0.5"
              value={params.deEsserGain}
              onChange={(e) => onChange({ deEsserGain: parseFloat(e.target.value), deEsserEnabled: true })}
              className="w-full accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Column 4: Hum Removal & Master Limiter */}
        <div className="bg-[#060a12] border border-slate-800/80 rounded-xl p-4 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
              <Volume2 className="w-4 h-4" />
              <span>Hum Removal & Limiter</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              -1 dB Safe
            </span>
          </div>

          {/* Hum Removal: 50 Hz & 60 Hz + Harmonics Controls */}
          <div className="space-y-2">
            {/* 50 Hz Mains Hum (Pakistan / UK / EU / Asia) */}
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200">
                    50 Hz Hum + Harmonics
                  </span>
                  <span className="ml-1.5 text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                    Asia / PK / EU
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.humRemoval50HzHarmonics !== false && params.notch50Hz !== false}
                    onChange={(e) => onChange({
                      humRemoval50HzHarmonics: e.target.checked,
                      notch50Hz: e.target.checked,
                      notch100Hz: e.target.checked,
                      notch150Hz: e.target.checked,
                      notch200Hz: e.target.checked,
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Cuts 50 Hz, 100 Hz, 150 Hz, 200 Hz electrical power grid hum
              </p>
            </div>

            {/* 60 Hz Ground & Electrical Hum (US / Chargers / Ground Loop) */}
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200">
                    60 Hz Hum + Harmonics
                  </span>
                  <span className="ml-1.5 text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    US / Ground Buzz
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(params.notch60Hz || params.humRemoval60HzHarmonics)}
                    onChange={(e) => onChange({
                      humRemoval60HzHarmonics: e.target.checked,
                      notch60Hz: e.target.checked,
                      notch120Hz: e.target.checked,
                      notch180Hz: e.target.checked,
                      notch200Hz: params.notch200Hz,
                      notch240Hz: e.target.checked,
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Cuts 60 Hz, 120 Hz, 180 Hz, 240 Hz equipment & charger ground buzz
              </p>
            </div>

            {/* Quick Both 50Hz + 60Hz Preset Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">Dual Hum Protection:</span>
              <button
                type="button"
                onClick={() => {
                  const bothActive =
                    (params.humRemoval50HzHarmonics !== false && params.notch50Hz !== false) &&
                    Boolean(params.notch60Hz || params.humRemoval60HzHarmonics);
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
                className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                  (params.humRemoval50HzHarmonics !== false && params.notch50Hz !== false) &&
                  Boolean(params.notch60Hz || params.humRemoval60HzHarmonics)
                    ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300'
                    : 'border-slate-700 bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                Both (50Hz + 60Hz) Active
              </button>
            </div>
          </div>

          {/* Limiter: −1 dB ceiling */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-emerald-400">Limiter Peak Ceiling:</span>
              <span className="font-mono font-bold text-emerald-400">{params.limiterCeilingDb} dB</span>
            </div>
            <input
              type="range"
              min="-6"
              max="0"
              step="0.2"
              value={params.limiterCeilingDb}
              onChange={(e) => onChange({ limiterCeilingDb: parseFloat(e.target.value) })}
              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Dynamic Noise Gate Floor */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Gate Floor Threshold:</span>
              <span className="font-mono font-bold text-emerald-400">{params.gateThreshold} dB</span>
            </div>
            <input
              type="range"
              min="-60"
              max="-20"
              value={params.gateThreshold}
              onChange={(e) => onChange({ gateThreshold: parseInt(e.target.value), gateEnabled: true })}
              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Fori Safai (Live): real-time noise + gunj reducer for large/streaming files */}
          <div className="space-y-1 pt-2 border-t border-emerald-500/20">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-emerald-300">Fori Safai — shor + gunj kam:</span>
              <button
                type="button"
                onClick={() => onChange({ liveCleanup: params.liveCleanup === false })}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                  params.liveCleanup !== false
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {params.liveCleanup !== false ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Safai ki miqdar:</span>
              <span className="font-mono font-bold text-emerald-400">{params.liveCleanupAmount ?? 70}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={params.liveCleanupAmount ?? 70}
              disabled={params.liveCleanup === false}
              onChange={(e) => onChange({ liveCleanupAmount: parseInt(e.target.value) })}
              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-40"
            />
            <p className="text-[10px] text-slate-500 leading-snug">
              Bari bayan files par foran asar — bolne ke darmiyan shor aur gunj dab jayegi.
            </p>
          </div>

          {/* Master Output Gain */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Master Gain:</span>
              <span className="font-mono font-bold text-emerald-400">{Math.round(params.masterGain * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.05"
              value={params.masterGain}
              onChange={(e) => onChange({ masterGain: parseFloat(e.target.value) })}
              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
