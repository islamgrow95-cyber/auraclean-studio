import React from 'react';
import {
  Mic,
  Video,
  BookOpen,
  Radio,
  Smartphone,
  Headphones,
  Car,
  Home,
  Wind,
  PhoneCall,
  Sparkles,
  Zap,
  Check,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { DSPParams, PresetId, ProcessingMode } from '../types';
import { SMART_PRESETS, PROCESSING_MODES } from '../audio/audioUtils';

interface SmartPresetsRackProps {
  activePresetId: PresetId | null;
  activeMode: ProcessingMode;
  onSelectPreset: (presetId: PresetId, params: Partial<DSPParams>) => void;
  onSelectMode: (mode: ProcessingMode) => void;
}

export const SmartPresetsRack: React.FC<SmartPresetsRackProps> = ({
  activePresetId,
  activeMode,
  onSelectPreset,
  onSelectMode,
}) => {
  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mic':
        return <Mic className="w-4 h-4 text-cyan-400" />;
      case 'Video':
        return <Video className="w-4 h-4 text-rose-400" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'Radio':
        return <Radio className="w-4 h-4 text-purple-400" />;
      case 'Smartphone':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'Headphones':
        return <Headphones className="w-4 h-4 text-blue-400" />;
      case 'Car':
        return <Car className="w-4 h-4 text-orange-400" />;
      case 'Home':
        return <Home className="w-4 h-4 text-teal-400" />;
      case 'Wind':
        return <Wind className="w-4 h-4 text-indigo-400" />;
      case 'PhoneCall':
        return <PhoneCall className="w-4 h-4 text-pink-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="bg-[#0b1118]/90 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
      
      {/* SECTION 1: 4 PRIMARY CLEANING MODES */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Voice Cleaner Profiles (4 Core Modes):</span>
          </label>
          <span className="text-[10px] font-mono text-slate-400">1-Click Processing Engine</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {(['quick', 'pro', 'studio', 'natural'] as ProcessingMode[]).map((modeKey) => {
            const m = PROCESSING_MODES[modeKey];
            const isSelected = activeMode === modeKey;

            return (
              <button
                key={modeKey}
                type="button"
                onClick={() => onSelectMode(modeKey)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-950/40'
                    : 'bg-[#060a12] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                      {m.name}
                    </span>
                    {isSelected ? (
                      <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono uppercase text-slate-500 bg-slate-800/80 px-1.5 py-0.2 rounded">
                        {m.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    {m.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: 10 SMART TARGET PRESETS */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>10 Smart Audio Presets (Acoustic Contexts):</span>
          </label>
          <span className="text-[10px] font-mono text-amber-400/90">Auto-tuned DSP Chains</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {SMART_PRESETS.map((p) => {
            const isSelected = activePresetId === p.id;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPreset(p.id, p.params)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border-amber-400/80 ring-1 ring-amber-400/50 shadow-md'
                    : 'bg-[#060a12] border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      {getPresetIcon(p.icon)}
                      <span className="font-bold text-[11px] text-white truncate">
                        {p.name}
                      </span>
                    </div>
                    {p.id === 'islamic-bayan' && (
                      <span className="text-[8px] font-mono text-amber-300 bg-amber-950/80 border border-amber-600/50 px-1.5 py-0.2 rounded shrink-0">
                        100% Asli Awaaz
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-400 line-clamp-2 leading-tight">
                    {p.description}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-slate-500 border-t border-slate-800/60 pt-1">
                  <span>{p.targetLufs}</span>
                  {isSelected ? (
                    <span className="text-amber-400 font-bold">
                      {p.id === 'islamic-bayan' ? 'ACTIVE (Asli Awaaz)' : 'ACTIVE'}
                    </span>
                  ) : p.id === 'islamic-bayan' ? (
                    <span className="text-cyan-400 font-semibold">Gold Preset</span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
