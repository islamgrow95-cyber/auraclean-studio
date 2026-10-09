import React, { useState } from 'react';
import { Sliders, Sparkles, BookmarkPlus, Check, Info } from 'lucide-react';
import { PRESETS, Preset, DSPParams } from '../audio/audioUtils';

interface PresetSelectorProps {
  currentPresetId: string | null;
  onSelectPreset: (preset: Preset) => void;
  currentParams: DSPParams;
  onSaveCustomPreset: (name: string) => void;
  customPresets: Preset[];
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentPresetId,
  onSelectPreset,
  currentParams,
  onSaveCustomPreset,
  customPresets,
}) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [customName, setCustomName] = useState('');

  const allPresets = [...PRESETS, ...customPresets];
  const activePreset = allPresets.find((p) => p.id === currentPresetId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onSaveCustomPreset(customName.trim());
    setCustomName('');
    setShowSaveModal(false);
  };

  return (
    <section className="bg-[#0f172a]/70 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">
            Intelligent Cleaning Presets:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSaveModal(true)}
            className="text-xs text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-800 hover:border-cyan-500/40"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>Save Current as Preset</span>
          </button>
        </div>
      </div>

      {/* Preset Buttons Grid */}
      <div className="flex flex-wrap items-center gap-2">
        {allPresets.map((preset) => {
          const isActive = preset.id === currentPresetId;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'border border-cyan-500/60 bg-cyan-500/20 text-cyan-300 shadow-sm shadow-cyan-500/20'
                  : 'border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              {isActive && <Check className="w-3 h-3 text-cyan-400" />}
              <span>{preset.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Preset Description Banner */}
      {activePreset && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{activePreset.description}</span>
        </div>
      )}

      {/* Save Custom Preset Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h4 className="text-sm font-semibold text-white">Save Custom DSP Preset</h4>
            <p className="text-xs text-slate-400">
              Saves current noise gate, EQ, and voice isolation parameters to your browser storage.
            </p>
            <form onSubmit={handleSave} className="space-y-3">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. My Studio Podcast Mic"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                >
                  Save Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
