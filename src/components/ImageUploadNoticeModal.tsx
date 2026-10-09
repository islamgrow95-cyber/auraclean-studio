import React from 'react';
import {
  Image as ImageIcon,
  AlertCircle,
  Mic,
  Sparkles,
  FileAudio,
  X,
} from 'lucide-react';

interface ImageUploadNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFileName: string;
  onBrowseAudio: () => void;
  onOpenMic: () => void;
  onLoadDemo: (type: 'podcast-hvac' | 'ground-hum' | 'street-interview') => void;
}

export const ImageUploadNoticeModal: React.FC<ImageUploadNoticeModalProps> = ({
  isOpen,
  onClose,
  imageFileName,
  onBrowseAudio,
  onOpenMic,
  onLoadDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b101e] border border-amber-500/40 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-amber-400">
            <ImageIcon className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">
              Image File Detected (Tasveer Select Hui Hai)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Body */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-amber-200">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-amber-300">
                &ldquo;{imageFileName}&rdquo; aik Tasveer (Image) file hai!
              </p>
              <p className="text-slate-300 leading-relaxed">
                AuraClean Studio mein aawaz aur background noise saaf karne ke liye audio ya video file (MP3, WAV, MP4, MOV) upload karein.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons for Audio */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              onBrowseAudio();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <FileAudio className="w-4 h-4" />
            <span>Select Audio / Video File (MP3, WAV, MP4, Voice Note)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenMic();
              }}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Mic className="w-3.5 h-3.5 text-rose-400" />
              <span>Record Mic Now</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onLoadDemo('podcast-hvac');
              }}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Audio Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
