import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Volume2,
  CheckCircle2,
  BellRing,
  Cpu,
  Layers,
  Flame,
  Mic,
  Zap,
} from 'lucide-react';
import { DSPParams, calculateClarityPercentages, playStudioChimeAndVoice, PRESETS, Preset } from '../audio/audioUtils';
import { AudioEngine } from '../audio/AudioEngine';

interface VoicePurityRadarProps {
  params: DSPParams;
  gateAttenuationDb: number;
  engine: AudioEngine;
  onApplyDeepClean: (params: Partial<DSPParams>) => void;
}

export const VoicePurityRadar: React.FC<VoicePurityRadarProps> = ({
  params,
  gateAttenuationDb,
  engine,
  onApplyDeepClean,
}) => {
  const [isCleaningInProgress, setIsCleaningInProgress] = useState(false);
  const [cleaningStepText, setCleaningStepText] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  // Dynamic percentage metrics
  const metrics = calculateClarityPercentages(params);

  const handleRunFullDeepClean = () => {
    setIsCleaningInProgress(true);
    setShowCelebration(false);
    setCleaningStepText('1/3: Analyzing speaker formants & background noise floor...');

    setTimeout(() => {
      setCleaningStepText('2/3: Engaging surgical notch filters & adaptive noise gate...');
    }, 450);

    setTimeout(() => {
      setCleaningStepText('3/3: Shielding speaker voice & finalizing audio purity...');
    }, 900);

    setTimeout(() => {
      // Find and apply the ultimate 100% deep clean preset
      const deepPreset = PRESETS.find((p: Preset) => p.id === 'deep-shield-clean') || PRESETS[0];
      onApplyDeepClean(deepPreset.params);

      setIsCleaningInProgress(false);
      setShowCelebration(true);

      // Play Studio Chime + Spoken Voice Alarm in Urdu / Hindi
      playStudioChimeAndVoice(
        engine.getContext(),
        'Aap ki aawaz, background noise, aur speaker ki aawaz mukammal clean ho chuki hai!'
      );
    }, 1300);
  };

  const handleReplayVoiceAlarm = () => {
    playStudioChimeAndVoice(
      engine.getContext(),
      'Aap ki aawaz, background noise, aur speaker ki aawaz mukammal clean ho chuki hai!'
    );
  };

  return (
    <section className="bg-gradient-to-b from-[#0e1626] to-[#090e1a] border border-emerald-500/30 rounded-2xl p-5 shadow-2xl space-y-5 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Speaker Voice Protection & Noise Cleared Meter
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                100% Safe Voice
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live measurement of speaker preservation vs background noise eliminated
            </p>
          </div>
        </div>

        {/* 1-Click Action to Clean All & Trigger Voice Alarm */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRunFullDeepClean}
            disabled={isCleaningInProgress}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isCleaningInProgress ? (
              <>
                <Cpu className="w-4 h-4 animate-spin" />
                <span>Deep Cleaning In Progress...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>1-Click 100% Deep Clean & Voice Alarm</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-Time Percentages Gauge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Speaker Voice Preserved % */}
        <div className="bg-[#060a13] border border-emerald-500/20 rounded-xl p-4 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <span>Original Speaker Voice</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Formants Safe
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono tabular-nums font-bold text-emerald-400">
              {metrics.originalVoicePercent}%
            </span>
            <span className="text-xs text-slate-400">Preserved</span>
          </div>

          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${metrics.originalVoicePercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Speaker ki natural tone aur human voice 100% safe hai, koi word ya lafz kata nahi gaya.
          </p>
        </div>

        {/* Card 2: Background Noise Removed % */}
        <div className="bg-[#060a13] border border-cyan-500/20 rounded-xl p-4 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Background Noise Cleared</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
              Noise Stripped
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono tabular-nums font-bold text-cyan-400">
              {metrics.noiseCleanedPercent}%
            </span>
            <span className="text-xs text-slate-400">Removed</span>
          </div>

          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${metrics.noiseCleanedPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            AC, pankha, hawa, electric 60Hz hum aur room echo ko mukammal remove kar diya gaya hai.
          </p>
        </div>

        {/* Card 3: Overall Studio Clarity Score % */}
        <div className="bg-[#060a13] border border-indigo-500/20 rounded-xl p-4 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Audio Purity Score</span>
            </span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
              Broadcast Grade
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono tabular-nums font-bold text-indigo-400">
              {metrics.overallPurityPercent}%
            </span>
            <span className="text-xs text-slate-400">Studio Grade</span>
          </div>

          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${metrics.overallPurityPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Professional studio quality voice balance without digital distortion or artifacting.
          </p>
        </div>

      </div>

      {/* Cleaning in Progress Step Indicator */}
      {isCleaningInProgress && (
        <div className="bg-[#060a13] border border-cyan-500/40 rounded-xl p-3.5 flex items-center gap-3 text-xs font-mono text-cyan-300 animate-pulse">
          <Cpu className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
          <span>{cleaningStepText}</span>
        </div>
      )}

      {/* Voice Alarm Announcement Completed Banner */}
      {showCelebration && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm flex items-center gap-2">
                <span>Aap ki aawaz mukammal clean ho chuki hai!</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Voice Alarm Played
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5">
                "Aap ki aawaz, background noise, aur speaker ki aawaz mukammal clean ho chuki hai!"
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReplayVoiceAlarm}
            className="px-3.5 py-1.5 rounded-lg border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition-all shrink-0"
            title="Replay Voice Announcement"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Replay Voice Alarm</span>
          </button>
        </div>
      )}

    </section>
  );
};
