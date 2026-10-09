import React from 'react';
import {
  Activity,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Layers,
  Gauge,
  Wind,
} from 'lucide-react';
import { AudioAnalysisReport } from '../types';

interface AudioAnalysisCardProps {
  report: AudioAnalysisReport | null;
  isProcessing?: boolean;
}

export const AudioAnalysisCard: React.FC<AudioAnalysisCardProps> = ({
  report,
  isProcessing = false,
}) => {
  if (!report) return null;

  return (
    <div className="bg-[#0b1118]/90 border border-cyan-500/30 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Smart Audio Quality Diagnostics</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Live Acoustic Analysis
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Calculated directly from uploaded audio spectrum and time-domain samples
            </p>
          </div>
        </div>

        {/* Comparison Score Badges */}
        <div className="flex items-center gap-2 bg-[#060a12] border border-slate-800 px-3 py-1.5 rounded-xl">
          <div className="text-right">
            <span className="text-[9px] uppercase font-mono text-slate-400 block">Original</span>
            <span className="text-xs font-mono font-bold text-rose-400">
              {report.originalQualityScore}/100
            </span>
          </div>
          <span className="text-slate-600 font-bold">→</span>
          <div className="text-left">
            <span className="text-[9px] uppercase font-mono text-cyan-400 block">AI Enhanced</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {report.enhancedQualityScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Diagnostic Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Noise Level */}
        <div className="bg-[#060a12] border border-slate-800/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>NOISE FLOOR</span>
            <span
              className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                report.noiseLevel === 'Low'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : report.noiseLevel === 'Medium'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}
            >
              {report.noiseLevel}
            </span>
          </div>
          <p className="text-base font-bold font-mono text-white">
            {report.noiseLevelDb} <span className="text-xs text-slate-400 font-normal">dB</span>
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                report.noiseLevel === 'Low' ? 'bg-emerald-400' : report.noiseLevel === 'Medium' ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(10, (report.noiseLevelDb + 80) * 1.5))}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Voice Clarity */}
        <div className="bg-[#060a12] border border-slate-800/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>VOICE CLARITY</span>
            <span className="text-cyan-400 font-bold">{report.voiceClarity}</span>
          </div>
          <p className="text-base font-bold font-mono text-cyan-300">
            {report.voiceClarity === 'Crystal'
              ? '98%'
              : report.voiceClarity === 'High'
              ? '88%'
              : report.voiceClarity === 'Medium'
              ? '68%'
              : '45%'}
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500"
              style={{
                width:
                  report.voiceClarity === 'Crystal'
                    ? '98%'
                    : report.voiceClarity === 'High'
                    ? '88%'
                    : report.voiceClarity === 'Medium'
                    ? '68%'
                    : '45%',
              }}
            />
          </div>
        </div>

        {/* Metric 3: Loudness (LUFS) */}
        <div className="bg-[#060a12] border border-slate-800/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>LOUDNESS</span>
            <span className="text-slate-300 font-mono">Target: -14</span>
          </div>
          <p className="text-base font-bold font-mono text-amber-300">
            {report.loudnessLufs} <span className="text-xs text-slate-400 font-normal">LUFS</span>
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400"
              style={{ width: `${Math.min(100, Math.max(15, (report.loudnessLufs + 32) * 4))}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Clipping & Dynamic Range */}
        <div className="bg-[#060a12] border border-slate-800/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>CLIPPING & PEAK</span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                report.clippingStatus === 'None'
                  ? 'bg-emerald-950 text-emerald-400'
                  : 'bg-rose-950 text-rose-400'
              }`}
            >
              {report.clippingStatus === 'None' ? 'Clean Peak' : `${report.clippingCount} Clips`}
            </span>
          </div>
          <p className="text-base font-bold font-mono text-white">
            {report.peakLevelDb} <span className="text-xs text-slate-400 font-normal">dBFS</span>
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${report.peakLevelDb > -0.5 ? 'bg-rose-500' : 'bg-cyan-400'}`}
              style={{ width: `${Math.min(100, Math.max(10, (report.peakLevelDb + 30) * 3.3))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Artifact Detection Tags */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60 text-xs">
        <span className="text-[10px] font-mono text-slate-400">Detected Anomalies:</span>

        {report.humDetected && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/50 text-amber-300 text-[10px] font-semibold">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>50/60Hz Mains Hum</span>
          </span>
        )}

        {report.hissDetected && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-800/50 text-rose-300 text-[10px] font-semibold">
            <Volume2 className="w-3 h-3 text-rose-400" />
            <span>AC / Fan Air Hiss</span>
          </span>
        )}

        {report.windDetected && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-[10px] font-semibold">
            <Wind className="w-3 h-3 text-indigo-400" />
            <span>Wind / Sub-bass Rumble</span>
          </span>
        )}

        {report.echoDetected && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-300 text-[10px] font-semibold">
            <Layers className="w-3 h-3 text-purple-400" />
            <span>Room Echo & Reflections</span>
          </span>
        )}

        {!report.humDetected && !report.hissDetected && !report.windDetected && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-[10px] font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Clean Baseline Profile</span>
          </span>
        )}
      </div>
    </div>
  );
};
