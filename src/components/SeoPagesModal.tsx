import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Video,
  Mic,
  Volume2,
  FileText,
  Lock,
  Mail,
  HelpCircle,
} from 'lucide-react';

interface SeoPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const SeoPagesModal: React.FC<SeoPagesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'about',
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b1118] border border-slate-800 rounded-2xl p-6 max-w-4xl w-full space-y-5 shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Header & Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">AuraClean Studio PRO — Knowledge & Guides</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 shrink-0 border-b border-slate-800/80">
          {[
            { id: 'about', label: 'About AuraClean' },
            { id: 'podcast', label: 'Podcast Cleaner' },
            { id: 'youtube', label: 'YouTube Voice PRO' },
            { id: 'video', label: 'Video Audio Cleaner' },
            { id: 'privacy', label: 'Privacy & Security' },
            { id: 'terms', label: 'Terms of Service' },
            { id: 'contact', label: 'Contact & Support' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto space-y-4 pr-1 text-xs text-slate-300 leading-relaxed flex-1">
          {activeTab === 'about' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">AuraClean Studio PRO — Professional AI Voice & Audio Workstation</h4>
              <p>
                AuraClean Studio PRO is engineered for podcasters, YouTube creators, documentary filmmakers, Islamic scholars, and content creators. It combines advanced Web Audio DSP filters, spectral subtraction noise algorithms, voice format shifters, and high-fidelity video audio replacement.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#060a12] border border-slate-800 space-y-1">
                  <h5 className="font-bold text-cyan-400">Zero Loss Video Muxing</h5>
                  <p className="text-[11px] text-slate-400">Preserves original 4K/1080p video frames while replacing noisy audio with crystal-clear voice.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#060a12] border border-slate-800 space-y-1">
                  <h5 className="font-bold text-amber-400">In-Speech Noise Shield</h5>
                  <p className="text-[11px] text-slate-400">Eliminates background fans and room hum even while the speaker is talking.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'podcast' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Podcast Audio Cleaner & Vocal Intelligibility</h4>
              <p>
                Designed for Shure SM7B, Rode, Blue Yeti, and USB podcast microphones. Removes air conditioner drone, computer fan hum, and table rumble while giving your voice that deep, authoritative radio presence.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
                <li>High-pass rumble filter at 85Hz</li>
                <li>Dynamic multi-band compression at 3.2:1 ratio</li>
                <li>Broadcast de-esser to tame harsh &lsquo;s&rsquo; and &lsquo;t&rsquo; sibilants</li>
                <li>Integrated target loudness: -16 LUFS (Spotify & Apple Podcasts Standard)</li>
              </ul>
            </div>
          )}

          {activeTab === 'youtube' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">YouTube Voice PRO — High Retention Audio Master</h4>
              <p>
                YouTube algorithm favors videos with high watch time. Crisp, clear, fatigue-free audio is the #1 factor in viewer retention. YouTube Voice PRO applies surgical high-frequency presence, sub-bass cut, and broadcast limiter to achieve clean -14 LUFS loudness.
              </p>
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Direct Video Audio Cleaner (MP4, MOV, WebM)</h4>
              <p>
                Upload your raw video recording. AuraClean extracts the audio track in memory, processes it through our 15-stage DSP cleaning chain, and automatically remuxes the enhanced studio audio back into the original video file.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Privacy & Data Security Guarantee</span>
              </h4>
              <p>
                We respect your privacy and creative intellectual property. All media processing occurs securely with temporary in-memory processing. Temporary files are automatically purged after export, and your voice recordings are never used for training external models without consent.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Terms of Service</h4>
              <p>
                AuraClean Studio PRO grants you full commercial rights to all exported audio and video files. You retain 100% ownership of your voice and video content.
              </p>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Customer Support & VIP WhatsApp Helpline</span>
              </h4>
              <p>
                Have questions or need custom audio engineering assistance? Contact our team directly:
              </p>
              <div className="p-3 rounded-xl bg-[#060a12] border border-slate-800 space-y-1.5 font-mono text-xs">
                <p><span className="text-slate-400">WhatsApp / Helpline:</span> <span className="text-emerald-400 font-bold">03280264770 (SajidAli)</span></p>
                <p><span className="text-slate-400">Email:</span> <span className="text-cyan-400">support@auraclean.pk</span></p>
                <p><span className="text-slate-400">Hours:</span> <span className="text-slate-300">24/7 Priority Support for VIP & Pro Members</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
