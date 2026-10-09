import React from 'react';
import { X, HelpCircle, VolumeX, Waves, Mic2, Activity, ArrowLeftRight } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white text-base">AuraClean Studio DSP Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <h4 className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <VolumeX className="w-4 h-4" />
              <span>1. Dynamic Noise Gate</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Silences background room tone, air conditioner hiss, and fan noise when no speech is present. Adjust the <strong className="text-slate-200">Threshold</strong> until the gate closes during pauses between words.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <h4 className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <Waves className="w-4 h-4" />
              <span>2. Low-Cut & High-Cut Surgical Filters</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Human speech rarely contains useful vocal information below 80 Hz or above 10,000 Hz. The <strong className="text-slate-200">High-Pass Filter (80-120 Hz)</strong> eliminates desk bumps, traffic rumble, and wind gusts. The <strong className="text-slate-200">Low-Pass Filter (6,000-8,000 Hz)</strong> removes electrical hiss and squeal.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <h4 className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <Mic2 className="w-4 h-4" />
              <span>3. Vocal Peaking EQ & Isolation</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Boosts or scoops vocal intelligibility formants around <strong className="text-slate-200">2,000 to 2,500 Hz</strong>. Boosting provides crisp presence in podcast dialogue, while cutting isolates background backing audio (Karaoke mode).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <h4 className="font-semibold text-amber-300 flex items-center gap-1.5">
              <ArrowLeftRight className="w-4 h-4" />
              <span>4. Delta (Noise Only) Monitoring Mode</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Switch the listening mode to <strong className="text-slate-200">Delta</strong> to listen exclusively to the sound that is being subtracted. If you can hear intelligible voice in the Delta channel, lower the filter aggression to preserve natural vocal tone.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
