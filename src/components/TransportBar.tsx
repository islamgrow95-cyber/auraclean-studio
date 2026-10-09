import React from 'react';
import { Play, Pause, Square, Repeat, Download, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { ListeningMode, formatTime } from '../audio/audioUtils';

interface TransportBarProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loop: boolean;
  listeningMode: ListeningMode;
  masterGain: number;
  onPlayPause: () => void;
  onStop: () => void;
  onToggleLoop: () => void;
  onModeChange: (mode: ListeningMode) => void;
  onSeek: (seconds: number) => void;
  onMasterGainChange: (gain: number) => void;
  onOpenExport: () => void;
  hasAudio: boolean;
}

export const TransportBar: React.FC<TransportBarProps> = ({
  isPlaying,
  currentTime,
  duration,
  loop,
  listeningMode,
  masterGain,
  onPlayPause,
  onStop,
  onToggleLoop,
  onModeChange,
  onSeek,
  onMasterGainChange,
  onOpenExport,
  hasAudio,
}) => {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-4">
      
      {/* Top Row: Playback Controls + A/B Switcher + Export */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Play / Stop / Loop Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
          <button
            type="button"
            onClick={onPlayPause}
            disabled={!hasAudio}
            className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-cyan-500 hover:from-cyan-500 hover:to-indigo-500 text-white flex items-center justify-center text-lg shadow-lg shadow-cyan-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            title="Play / Pause (Spacebar)"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onStop}
            disabled={!hasAudio}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Stop & Reset to beginning"
          >
            <Square className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleLoop}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              loop
                ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Loop Playback"
          >
            <Repeat className="w-4 h-4" />
          </button>

          <div className="h-6 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

          {/* 3-Way Listening Mode Switcher */}
          <div className="bg-[#060911] border border-slate-800 p-1 rounded-xl flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => onModeChange('cleaned')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                listeningMode === 'cleaned'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🟢 Cleaned Audio
            </button>
            <button
              type="button"
              onClick={() => onModeChange('original')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                listeningMode === 'original'
                  ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🔴 Bypass / Raw
            </button>
            <button
              type="button"
              onClick={() => onModeChange('delta')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                listeningMode === 'delta'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Hear what was filtered out (subtracted noise)"
            >
              Delta (Noise Only)
            </button>
          </div>
        </div>

        {/* Master Output Gain slider */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              min="0"
              max="2.5"
              step="0.05"
              value={masterGain}
              onChange={(e) => onMasterGainChange(parseFloat(e.target.value))}
              className="w-20 sm:w-28"
            />
            <span className="text-xs font-mono tabular-nums text-slate-300 w-10 text-right">
              {masterGain.toFixed(1)}x
            </span>
          </div>

          {/* Export WAV Button */}
          <button
            type="button"
            onClick={onOpenExport}
            disabled={!hasAudio}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Export Clean WAV</span>
          </button>
        </div>

      </div>

      {/* Bottom Row: Timeline Scrubber with Millisecond Readout */}
      <div className="flex items-center gap-3 pt-1 border-t border-slate-800/80">
        <span className="text-xs font-mono tabular-nums text-cyan-400 w-12 text-right">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min="0"
          max={duration || 1}
          step="0.01"
          value={currentTime}
          disabled={!hasAudio}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="flex-1"
        />
        <span className="text-xs font-mono tabular-nums text-slate-400 w-12">
          {formatTime(duration)}
        </span>
      </div>

    </div>
  );
};
