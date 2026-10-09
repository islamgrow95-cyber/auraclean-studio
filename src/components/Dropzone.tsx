import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Mic,
  Sparkles,
  FileAudio,
  Film,
  HardDrive,
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import logoImg from '../assets/images/auraclean_logo_1790880528622.jpg';
import { SyntheticDemoSamples } from './SyntheticDemoSamples';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  onLoadDemo: (sampleType: 'podcast-hvac' | 'ground-hum' | 'street-interview') => void;
  onOpenMic: () => void;
  isLoading: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelect,
  onLoadDemo,
  onOpenMic,
  isLoading,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setErrorMessage(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.size <= 5.5 * 1024 * 1024 * 1024) {
        onFileSelect(file);
      } else {
        setErrorMessage('File exceeds the 5 GB maximum limit. Please choose a smaller file.');
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size <= 5.5 * 1024 * 1024 * 1024) {
        onFileSelect(file);
      } else {
        setErrorMessage('File exceeds the 5 GB maximum limit. Please choose a smaller file.');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Header Section */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Professional AI Audio & Voice Enhancement Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Turn noisy recordings into <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">clean, studio audio</span>.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Deep AI voice isolation, in-speech fan & AC noise removal, 15-stage surgical DSP rack, and full-length video & WAV export.
        </p>
      </div>

      {/* Primary 5GB Upload Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer group backdrop-blur-md ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-950/30 shadow-2xl shadow-cyan-500/20 scale-[1.01]'
            : 'border-slate-800 hover:border-cyan-500/50 bg-[#0b1118]/80 hover:bg-[#0b1118]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,video/*,.mp3,.wav,.m4a,.aac,.ogg,.flac,.mp4,.mov,.webm,.mkv,.3gp,.amr,.opus,.caf,.m4v,.avi,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onClick={(e) => {
            (e.target as HTMLInputElement).value = '';
          }}
          onChange={handleFileInputChange}
        />

        {errorMessage && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs px-3 py-2 rounded-xl mb-3">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative group/logo">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-cyan-400/60 shadow-2xl shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300 ring-4 ring-cyan-500/20 bg-[#090d16]">
              <img
                src={logoImg}
                alt="AuraClean Studio Logo"
                className="w-full h-full object-cover"
              />
            </div>
            {isLoading ? (
              <div className="absolute inset-0 bg-black/70 rounded-3xl flex items-center justify-center backdrop-blur-xs">
                <Cpu className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            ) : (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg">
                <UploadCloud className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {isLoading ? 'Analyzing & Initializing Audio Engine...' : 'Drop your audio or video file here'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Supported Formats: <span className="text-cyan-300 font-mono font-semibold">MP3 • WAV • M4A • AAC • OGG • FLAC • MP4 • MOV • WEBM</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] pt-1">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                <HardDrive className="w-3.5 h-3.5" />
                <span>Supports Large Files up to 5 GB</span>
              </span>
              <span className="inline-flex items-center gap-1 text-cyan-400 font-mono bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Private In-Memory Processing</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 hover:opacity-95 transition-opacity flex items-center gap-2 transform active:scale-95 cursor-pointer"
            >
              <FileAudio className="w-4 h-4" />
              <span>Browse Audio / Video (Up to 5GB)</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenMic();
              }}
              className="px-5 py-3 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              <Mic className="w-4 h-4 text-rose-400" />
              <span>Record Microphone</span>
            </button>
          </div>
        </div>
      </div>

      {/* Synthetic Demo Test Audio Section */}
      <SyntheticDemoSamples
        onLoadDemo={onLoadDemo}
        isLoading={isLoading}
      />

    </div>
  );
};
