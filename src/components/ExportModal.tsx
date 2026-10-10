import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  X,
  CheckCircle2,
  Cpu,
  FileAudio,
  Film,
  ArrowLeft,
  RefreshCw,
  TrendingDown,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { AudioEngine } from '../audio/AudioEngine';
import {
  audioBufferToWav,
  formatBytes,
  formatTime,
  muxVideoWithCleanedAudio,
  playStudioChimeAndVoice,
} from '../audio/audioUtils';
import { uploadAndProcessMedia } from '../audio/serverExportClient';
import { exportWithBrowserEngine } from '../audio/clientExportEngine';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  engine: AudioEngine;
  sourceFileName: string;
  onBackToUpload?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  engine,
  sourceFileName,
  onBackToUpload,
}) => {
  const [exportType, setExportType] = useState<'video' | 'audio'>('audio');
  const [audioFormat, setAudioFormat] = useState<'wav' | 'mp3'>('wav');
  const [bitDepth, setBitDepth] = useState<16 | 24>(24);
  const [exportFlavor, setExportFlavor] = useState<'cleaned' | 'mota' | 'bareek'>('cleaned');
  const [exportName, setExportName] = useState('');
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isExported, setIsExported] = useState(false);
  const [downloadResultUrl, setDownloadResultUrl] = useState<string | null>(null);
  const [exportedFileType, setExportedFileType] = useState<'video' | 'audio'>('audio');
  const [metrics, setMetrics] = useState<{
    originalRms: number;
    cleanedRms: number;
    noiseReductionDb: number;
  } | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const activeFile = engine.getActiveFile();
  const isSourceVideo =
    /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(sourceFileName) ||
    Boolean(activeFile?.type.startsWith('video/'));

  const totalDuration = engine.getDuration();

  const prevIsOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      const base = sourceFileName.replace(/\.[^/.]+$/, '');
      const suffix =
        exportFlavor === 'mota'
          ? '_Mota_Deep'
          : exportFlavor === 'bareek'
          ? '_Bareek_High'
          : '_Cleaned_Studio';

      if (isSourceVideo) {
        setExportType('video');
        setExportName(`AuraClean_${base || 'Video'}${suffix}.mp4`);
      } else {
        setExportType('audio');
        setExportName(`AuraClean_${base || 'Audio'}${suffix}.${audioFormat}`);
      }

      setIsExported(false);
      setDownloadResultUrl(null);
      setRenderProgress(0);

      engine
        .computeMetrics()
        .then((res) => {
          setMetrics(res);
        })
        .catch(console.error);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, sourceFileName, engine, isSourceVideo]);

  const triggerBrowserDownload = (url: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExport = async () => {
    setIsRendering(true);
    setRenderProgress(10);
    setExportError(null);

    try {
      let customParams: any = {};
      if (exportFlavor === 'cleaned') {
        customParams = { voiceTone: 'original', pitchSemitones: 0 };
      } else if (exportFlavor === 'mota') {
        customParams = { voiceTone: 'mota', pitchSemitones: -3.5 };
      } else if (exportFlavor === 'bareek') {
        customParams = { voiceTone: 'bareek', pitchSemitones: 3.5 };
      }

      // 1. If original file is available (large audio or 30-min to 1-hour video), use High-Speed Studio Chunked FFmpeg Engine
      // This completely solves Cloud Run / proxy 413 (Payload Too Large) by uploading safe 8MB chunks
      if (activeFile) {
        let serverWorked = false;
        try {
          setRenderProgress(10);
          setStatusMessage('Media session prepare ho raha hai...');

          const result = await uploadAndProcessMedia({
            file: activeFile,
            exportType,
            exportFormat: exportType === 'video' ? 'mp4' : audioFormat,
            voiceTone: exportFlavor,
            dspParams: { ...engine.getDSPParams(), ...customParams },
            bitDepth,
            exportName,
            onProgress: (pct, stage) => {
              setRenderProgress(pct);
              setStatusMessage(stage);
            },
          });

          setExportedFileType(exportType);
          setDownloadResultUrl(result.downloadUrl);
          setRenderProgress(100);
          setIsRendering(false);
          setIsExported(true);
          playStudioChimeAndVoice(
            engine.getContext(),
            exportType === 'video'
              ? 'Aap ki mukammal video aur aawaz clean ho kar download ho chuki hai!'
              : 'Aap ki aawaz mukammal clean ho kar download ho chuki hai!'
          );
          serverWorked = true;
          return;
        } catch (serverErr: any) {
          const msg = String(serverErr?.message || '');
          // 405/404/Network failure = no backend on this deployment (static hosting).
          // Fall through to the on-device studio engine instead of showing an error.
          const noBackend = /405|Failed to fetch|NetworkError|Load failed|Network request failed|fetch failed/i.test(msg);
          if (!noBackend) throw serverErr;
          setStatusMessage('Server maujood nahi — export aap ke device par hi ho raha hai...');
        }

        if (!serverWorked) {
          // 1b. ON-DEVICE FALLBACK: same studio DSP chain via in-browser FFmpeg engine.
          // Works fully offline after first load, no upload needed.
          const smallAudioNoVideo =
            !isSourceVideo && activeFile.size <= 15 * 1024 * 1024;
          const useWebAudioRender =
            smallAudioNoVideo && exportType === 'audio' && audioFormat === 'wav';

          if (useWebAudioRender) {
            // Premium Web-Audio render path (voice isolation) for small WAV exports
            setStatusMessage('Device par studio render ho raha hai...');
            const renderedBuffer = await engine.renderProcessedBuffer(customParams);
            setRenderProgress(70);
            const wavBlob = audioBufferToWav(renderedBuffer, bitDepth);
            const url = URL.createObjectURL(wavBlob);
            const outName = exportName.endsWith('.wav') ? exportName : `${exportName}.wav`;
            triggerBrowserDownload(url, outName);
            setExportedFileType('audio');
            setDownloadResultUrl(url);
            setRenderProgress(100);
          } else {
            // Universal path: video files, large files, and MP3 — via in-browser FFmpeg
            const result = await exportWithBrowserEngine({
              file: activeFile,
              exportType,
              exportFormat: exportType === 'video' ? 'mp4' : audioFormat,
              voiceTone: exportFlavor,
              dspParams: { ...engine.getDSPParams(), ...customParams },
              bitDepth,
              exportName,
              onProgress: (pct, stage) => {
                setRenderProgress(pct);
                setStatusMessage(stage);
              },
            });
            triggerBrowserDownload(result.blobUrl, result.fileName);
            setExportedFileType(exportType);
            setDownloadResultUrl(result.blobUrl);
            setRenderProgress(100);
          }

          setIsRendering(false);
          setIsExported(true);
          playStudioChimeAndVoice(
            engine.getContext(),
            exportType === 'video'
              ? 'Aap ki mukammal video aur aawaz clean ho kar download ho chuki hai!'
              : 'Aap ki aawaz mukammal clean ho kar download ho chuki hai!'
          );
          return;
        }
      }

      // 2. Client-side rendering fallback for recorded audio buffers or synthetic samples
      const renderedBuffer = await engine.renderProcessedBuffer(customParams);
      setRenderProgress(70);

      const wavBlob = audioBufferToWav(renderedBuffer, bitDepth);
      const url = URL.createObjectURL(wavBlob);
      setDownloadResultUrl(url);

      const a = document.createElement('a');
      a.href = url;
      a.download = exportName.endsWith('.wav') ? exportName : `${exportName}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setExportedFileType('audio');
      setRenderProgress(100);

      setTimeout(() => {
        URL.revokeObjectURL(url);
        setIsRendering(false);
        setIsExported(true);
        playStudioChimeAndVoice(
          engine.getContext(),
          'Aap ki aawaz mukammal clean ho kar export ho chuki hai!'
        );
      }, 300);
    } catch (err: any) {
      console.error('Export error:', err);
      setIsRendering(false);
      setExportError(
        'Media export encountered an issue: ' + (err.message || 'Please try again.')
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b101e] border border-cyan-500/30 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white text-base">
              {isExported
                ? `${exportedFileType === 'video' ? 'Full Video' : 'Full Audio'} Exported!`
                : isSourceVideo
                ? 'Export Cleaned Video / Audio'
                : 'Export Studio Clean Audio'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Full File Duration & 5GB Capability Badge */}
        {totalDuration > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 bg-cyan-950/30 border border-cyan-500/30 rounded-xl px-3.5 py-2 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-300">
              <span className="font-medium">Full File Duration:</span>
              <span className="font-mono text-cyan-400 font-bold">
                {formatTime(totalDuration, true)} (100% Complete)
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-0.5 rounded-full font-semibold">
              Supports up to 5 GB
            </span>
          </div>
        )}

        {exportError && (
          <div className="bg-rose-950/70 border border-rose-500/50 rounded-xl px-3.5 py-2.5 text-xs text-rose-200">
            {exportError}
          </div>
        )}

        {/* Success View after cleaning & export */}
        {isExported ? (
          <div className="space-y-5 text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-semibold text-white">
                {exportedFileType === 'video' ? 'Full Video Cleaned & Downloaded' : 'Full Audio Cleaned & Downloaded'}
              </h4>
              <p className="text-xs text-slate-400">
                Mukammal file (100% duration) baghair kisi cut ya limit ke successfully export ho chuki hai.
              </p>
            </div>

            {metrics && (
              <div className="inline-flex items-center gap-2 bg-[#060911] border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-emerald-400">
                <TrendingDown className="w-4 h-4" />
                <span>Reduced {metrics.noiseReductionDb} dB of background noise</span>
              </div>
            )}

            {/* Direct Prominent Download Button for Mobile Chrome & WebViews */}
            {downloadResultUrl && (
              <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/50 space-y-2.5 shadow-xl text-left">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Clean File Download Ready:</span>
                </div>
                <a
                  href={downloadResultUrl}
                  download={exportName}
                  target="_self"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 hover:opacity-95 transition-opacity active:scale-95 cursor-pointer text-center"
                >
                  <Download className="w-5 h-5 text-slate-950 shrink-0" />
                  <span>📥 DOWNLOAD CLEAN FILE NOW ({exportedFileType === 'video' ? 'MP4' : audioFormat.toUpperCase()})</span>
                </a>
                <p className="text-[10px] text-slate-400 text-center">
                  Agar mobile par automatic download block ho jaye to is green button par tap karein.
                </p>
              </div>
            )}

            {/* Back Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 border-t border-slate-800">
              {onBackToUpload && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBackToUpload();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-cyan-400" />
                  <span>Back to Upload (New File)</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
              >
                Keep Editing
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* If source is video, choose between Full Video and Audio track */}
            {isSourceVideo && (
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Choose Export Target
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExportType('video')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      exportType === 'video'
                        ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/20'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Film className="w-4 h-4" />
                    <span>Cleaned Full Video (MP4)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setExportType('audio');
                      setExportName((prev) => prev.replace(/\.(mp4|mov|webm|mkv|avi)$/i, `.${audioFormat}`));
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      exportType === 'audio'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <FileAudio className="w-4 h-4" />
                    <span>Cleaned Audio ({audioFormat.toUpperCase()})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Audio Format Selection (WAV Lossless vs MP3 320kbps) */}
            {exportType === 'audio' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Audio Format & Bitrate
                  </label>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {audioFormat === 'wav' ? '24-bit PCM Lossless Master' : '320 kbps Studio Quality'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAudioFormat('wav');
                      setExportName((prev) => prev.replace(/\.(mp3|wav)$/i, '') + '.wav');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      audioFormat === 'wav'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>WAV (Studio Lossless Master)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAudioFormat('mp3');
                      setExportName((prev) => prev.replace(/\.(mp3|wav)$/i, '') + '.mp3');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      audioFormat === 'mp3'
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>MP3 (320 kbps High Quality)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Voice Tone Selection */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Voice Tone Flavor to Export
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setExportFlavor('cleaned')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                    exportFlavor === 'cleaned'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Asli Fittri Awaaz (100% Real)
                </button>
                <button
                  type="button"
                  onClick={() => setExportFlavor('mota')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                    exportFlavor === 'mota'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Mota / Deep (-3.5 st)
                </button>
                <button
                  type="button"
                  onClick={() => setExportFlavor('bareek')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                    exportFlavor === 'bareek'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  Bareek / High (+3.5 st)
                </button>
              </div>
            </div>

            {/* Export File Name */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Export File Name
              </label>
              <input
                type="text"
                value={exportName}
                onChange={(e) => setExportName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Progress indicator during rendering */}
            {isRendering && (
              <div className="space-y-2 bg-slate-900 border border-cyan-500/40 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-cyan-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    <span>
                      {exportType === 'video'
                        ? 'Processing & Muxing Studio Clean Video...'
                        : 'Processing Full Studio Audio...'}
                    </span>
                  </span>
                  <span className="font-mono font-bold text-cyan-400">{renderProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
                {statusMessage && (
                  <p className="text-[11px] text-slate-300 font-mono animate-pulse">
                    {statusMessage}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isRendering}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExport}
                disabled={isRendering}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
              >
                {isRendering ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>Exporting Full File...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>
                      {exportType === 'video'
                        ? 'Download Full Cleaned Video (MP4)'
                        : `Download Full Audio (${audioFormat.toUpperCase()})`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
