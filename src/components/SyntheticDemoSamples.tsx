import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Activity,
  ShieldCheck,
  ArrowRight,
  Mic,
  Zap,
  Volume2,
  Sliders,
} from 'lucide-react';

interface SyntheticDemoSamplesProps {
  onLoadDemo: (type: 'podcast-hvac' | 'ground-hum' | 'street-interview') => void;
  isLoading: boolean;
}

const DEMO_SAMPLES = [
  {
    id: 'podcast-hvac' as const,
    num: '01',
    title: 'Podcast + HVAC Airflow',
    tag: 'HVAC / AC Noise',
    description: 'Indoor podcast speech corrupted by heavy background air conditioner rumble and ceiling fan whir.',
    anomaly: '50Hz Sub-rumble + 4kHz Air Hiss',
    color: 'from-amber-500/20 to-cyan-500/10 border-amber-500/30',
  },
  {
    id: 'ground-hum' as const,
    num: '02',
    title: '60Hz Electrical Ground Hum',
    tag: 'Mains Ground Loop',
    description: 'Vocal recording with loud electrical buzzing from ungrounded audio interface and dirty power.',
    anomaly: '60Hz, 120Hz, 180Hz Harmonics',
    color: 'from-rose-500/20 to-purple-500/10 border-rose-500/30',
  },
  {
    id: 'street-interview' as const,
    num: '03',
    title: 'Outdoor Street Interview',
    tag: 'Traffic & Wind',
    description: 'Mobile reporter voice recording masked by passing cars, wind gusts, and bustling street ambiance.',
    anomaly: 'Sub-bass Buffeting + Random Traffic',
    color: 'from-cyan-500/20 to-indigo-500/10 border-cyan-500/30',
  },
];

export const SyntheticDemoSamples: React.FC<SyntheticDemoSamplesProps> = ({
  onLoadDemo,
  isLoading,
}) => {
  return (
    <div className="bg-[#0b1118]/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Instant Synthetic Test Audio Samples
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Real Synthesized DSP Signals
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Load bundled test samples with 1-click to audition real noise separation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {DEMO_SAMPLES.map((sample) => (
          <div
            key={sample.id}
            className={`rounded-xl p-4 border bg-gradient-to-b ${sample.color} flex flex-col justify-between space-y-3 relative group hover:border-cyan-400/80 transition-all`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {sample.num}
                </span>
                <span className="text-[9px] font-mono uppercase bg-slate-900/90 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full">
                  {sample.tag}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                {sample.title}
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {sample.description}
              </p>
              <div className="mt-2 text-[10px] font-mono text-amber-300/90 bg-slate-950/60 p-1.5 rounded border border-slate-800/80 flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{sample.anomaly}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onLoadDemo(sample.id)}
              disabled={isLoading}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-cyan-500 text-slate-200 hover:text-slate-950 font-bold text-xs border border-slate-700 hover:border-cyan-400 shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Load & Auto-Clean Sample</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
