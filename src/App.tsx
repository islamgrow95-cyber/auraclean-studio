import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  FileAudio,
  Film,
  HardDrive,
  Crown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Download,
  Activity,
  Sparkles,
  Sliders,
  FolderOpen,
  HelpCircle,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Dropzone } from './components/Dropzone';
import { WaveformStage } from './components/WaveformStage';
import { TransportBar } from './components/TransportBar';
import { AudioAnalysisCard } from './components/AudioAnalysisCard';
import { SmartPresetsRack } from './components/SmartPresetsRack';
import { AdvancedManualControls } from './components/AdvancedManualControls';
import { DifferenceAuditionHub } from './components/DifferenceAuditionHub';
import { VoicePurityRadar } from './components/VoicePurityRadar';
import { VoiceToneAndResultsHub } from './components/VoiceToneAndResultsHub';
import { MicRecordModal } from './components/MicRecordModal';
import { ExportModal } from './components/ExportModal';
import { HelpModal } from './components/HelpModal';
import { AuthModal } from './components/AuthModal';
import { PricingPlansModal } from './components/PricingPlansModal';
import { ProjectHistoryModal } from './components/ProjectHistoryModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { SeoPagesModal } from './components/SeoPagesModal';
import { ImageUploadNoticeModal } from './components/ImageUploadNoticeModal';
import { AudioEngine } from './audio/AudioEngine';
import {
  UserAccount,
  UserPlan,
  DSPParams,
  PresetId,
  ProcessingMode,
  AudioAnalysisReport,
  ProjectHistoryItem,
} from './types';
import {
  DEFAULT_DSP_PARAMS,
  SMART_PRESETS,
  PROCESSING_MODES,
  analyzeAudioQuality,
  createStreamingAnalysisReport,
  createSyntheticDemoBuffer,
  formatBytes,
} from './audio/audioUtils';

export default function App() {
  const engineRef = useRef<AudioEngine | null>(null);

  if (!engineRef.current) {
    engineRef.current = new AudioEngine();
  }
  const engine = engineRef.current;

  // File & Playback States
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [processedBuffer, setProcessedBuffer] = useState<AudioBuffer | null>(null);
  const [isRenderingClean, setIsRenderingClean] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [loop, setLoop] = useState<boolean>(false);
  const [listeningMode, setListeningMode] = useState<'cleaned' | 'original' | 'delta'>('cleaned');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Smart Quality Analysis Report
  const [analysisReport, setAnalysisReport] = useState<AudioAnalysisReport | null>(null);

  // Active DSP Mode & Preset
  const [activeMode, setActiveMode] = useState<ProcessingMode>('pro');
  const [activePresetId, setActivePresetId] = useState<PresetId | null>('islamic-bayan');
  const [dspParams, setDspParams] = useState<DSPParams>({ ...DEFAULT_DSP_PARAMS });
  const [gateAttenuationDb, setGateAttenuationDb] = useState<number>(0);

  // Previous file restore
  const [previousBuffer, setPreviousBuffer] = useState<AudioBuffer | null>(null);
  const [previousFileName, setPreviousFileName] = useState<string>('');

  // User Account
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('auraclean_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals
  const [isMicOpen, setIsMicOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [seoInitialTab, setSeoInitialTab] = useState('about');
  const [isImageNoticeOpen, setIsImageNoticeOpen] = useState(false);
  const [detectedImageName, setDetectedImageName] = useState('');
  const [fileErrorToast, setFileErrorToast] = useState<string | null>(null);

  const hasAudio = audioBuffer !== null || duration > 0;
  const isVideoFile =
    /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(fileName) ||
    Boolean(engine.getActiveFile()?.type.startsWith('video/'));

  // Initialize engine callbacks
  useEffect(() => {
    engine.setCallbacks({
      onStateChange: (playing) => {
        setIsPlaying(playing);
      },
      onTimeUpdate: (time, dur) => {
        setCurrentTime(time);
        if (dur > 0) {
          setDuration(dur);
        }
      },
      onGateActivity: (attenuation) => {
        setGateAttenuationDb(attenuation);
      },
    });
  }, [engine]);

  // Sync animation timer during playback
  useEffect(() => {
    let animId: number;
    const tick = () => {
      if (engine.isCurrentlyPlaying()) {
        setCurrentTime(engine.getCurrentTime());
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [engine]);

  // Keyboard shortcut: Spacebar for Play/Pause
  const handlePlayPauseRef = useRef<(() => Promise<void>) | undefined>(undefined);
  useEffect(() => {
    handlePlayPauseRef.current = handlePlayPause;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return;
        }
        e.preventDefault();
        handlePlayPauseRef.current?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Run Smart Audio Analysis on loaded buffer
  const runDiagnosticsOnBuffer = (buf: AudioBuffer) => {
    try {
      const report = analyzeAudioQuality(buf);
      setAnalysisReport(report);
    } catch (e) {
      console.warn('Diagnostics notice:', e);
    }
  };

  // Render Cleaned Buffer for instant Red & Green dual waveform visualization & playback
  const renderCleanBuffer = async (buf: AudioBuffer, paramsToUse = dspParams) => {
    setIsRenderingClean(true);
    try {
      const clean = await engine.renderProcessedBuffer(paramsToUse);
      setProcessedBuffer(clean);
    } catch (e) {
      console.warn('Render clean buffer notice:', e);
    } finally {
      setIsRenderingClean(false);
    }
  };

  // Load a file (Audio or Video)
  const handleFileSelect = async (file: File) => {
    const isImage =
      file.type.startsWith('image/') ||
      /\.(jpe?g|png|webp|gif|bmp|svg|tiff|ico|heic|raw)$/i.test(file.name);

    if (isImage) {
      setDetectedImageName(file.name);
      setIsImageNoticeOpen(true);
      return;
    }

    setIsLoading(true);
    setFileSize(file.size);
    setFileErrorToast(null);
    try {
      const res = await engine.loadAudioFile(file);
      setFileName(file.name);
      setDuration(res.duration);
      setIsStreaming(res.mode === 'stream');
      const buf = engine.getOriginalBuffer();
      setAudioBuffer(buf);
      setCurrentTime(0);

      if (buf) {
        runDiagnosticsOnBuffer(buf);
        renderCleanBuffer(buf, dspParams);
      } else if (res.mode === 'stream') {
        setAnalysisReport(createStreamingAnalysisReport(res.duration, file.size));
      }
    } catch (err) {
      setFileErrorToast('Unable to load this audio or video file. Please ensure it is a supported voice/media format (MP3, WAV, M4A, AAC, OGG, FLAC, MP4, MOV, WEBM).');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load Synthetic Demo Sample
  const handleLoadDemo = async (type: 'podcast-hvac' | 'ground-hum' | 'street-interview') => {
    setIsLoading(true);
    setFileSize(0);
    setIsStreaming(false);
    try {
      const ctx = await engine.initContext();
      const syntheticBuffer = createSyntheticDemoBuffer(ctx, type);
      await engine.loadBuffer(syntheticBuffer);
      setAudioBuffer(syntheticBuffer);

      let name = 'Podcast-HVAC-Room-Noise.wav';
      if (type === 'ground-hum') name = '60Hz-Electrical-Hum-Ground.wav';
      if (type === 'street-interview') name = 'Outdoor-Street-Interview.wav';
      setFileName(name);
      setDuration(syntheticBuffer.duration);
      setCurrentTime(0);

      runDiagnosticsOnBuffer(syntheticBuffer);

      let pToUse = { ...dspParams };
      if (type === 'ground-hum') {
        const p = SMART_PRESETS.find((x) => x.id === 'podcast-voice');
        if (p) {
          pToUse = { ...dspParams, notch60Hz: true, notch50Hz: true, ...p.params };
          handleSelectPreset(p.id, pToUse);
        }
      } else if (type === 'podcast-hvac') {
        const p = SMART_PRESETS.find((x) => x.id === 'podcast-voice');
        if (p) {
          pToUse = { ...dspParams, ...p.params };
          handleSelectPreset(p.id, p.params);
        }
      } else if (type === 'street-interview') {
        const p = SMART_PRESETS.find((x) => x.id === 'windy-recording');
        if (p) {
          pToUse = { ...dspParams, ...p.params };
          handleSelectPreset(p.id, p.params);
        }
      }

      renderCleanBuffer(syntheticBuffer, pToUse);
    } catch (err) {
      console.error('Error generating synthetic demo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load recorded microphone buffer
  const handleAudioRecorded = (buffer: AudioBuffer, recFileName: string) => {
    engine.loadBuffer(buffer);
    setAudioBuffer(buffer);
    setFileName(recFileName);
    setFileSize(0);
    setIsStreaming(false);
    setDuration(buffer.duration);
    setCurrentTime(0);
    runDiagnosticsOnBuffer(buffer);
    renderCleanBuffer(buffer, dspParams);
  };

  // Back to Upload screen handler
  const handleBackToUpload = () => {
    engine.stop();
    if ((audioBuffer || duration > 0) && fileName) {
      setPreviousBuffer(audioBuffer);
      setPreviousFileName(fileName);
    }
    setAudioBuffer(null);
    setProcessedBuffer(null);
    setFileName('');
    setFileSize(0);
    setIsStreaming(false);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setAnalysisReport(null);
  };

  // Restore previously opened file
  const handleRestorePrevious = async () => {
    if (previousBuffer && previousFileName) {
      await engine.loadBuffer(previousBuffer);
      setAudioBuffer(previousBuffer);
      setFileName(previousFileName);
      setDuration(previousBuffer.duration);
      setCurrentTime(0);
      runDiagnosticsOnBuffer(previousBuffer);
      setPreviousBuffer(null);
    }
  };

  // Select Preset Handler
  const handleSelectPreset = (presetId: PresetId, presetParams: Partial<DSPParams>) => {
    setActivePresetId(presetId);
    const updated = {
      ...dspParams,
      ...presetParams,
    };
    setDspParams(updated);
    engine.updateDSPParams(updated);
    if (audioBuffer) {
      renderCleanBuffer(audioBuffer, updated);
    }
  };

  // Select Mode Handler (Quick, Pro, Studio, Natural)
  const handleSelectMode = (mode: ProcessingMode) => {
    setActiveMode(mode);
    const modeConfig = PROCESSING_MODES[mode];
    if (modeConfig && modeConfig.params) {
      const updated = {
        ...dspParams,
        ...modeConfig.params,
      };
      setDspParams(updated);
      engine.updateDSPParams(updated);
      if (audioBuffer) {
        renderCleanBuffer(audioBuffer, updated);
      }
    }
  };

  // DSP Parameter update
  const handleParamChange = (updated: Partial<DSPParams>) => {
    setActivePresetId(null);
    setActiveMode('custom');
    const newParams = { ...dspParams, ...updated };
    setDspParams(newParams);
    engine.updateDSPParams(newParams);
    if (audioBuffer) {
      renderCleanBuffer(audioBuffer, newParams);
    }
  };

  // Reset DSP settings
  const handleReset = () => {
    setDspParams({ ...DEFAULT_DSP_PARAMS });
    engine.updateDSPParams({ ...DEFAULT_DSP_PARAMS });
    setActivePresetId('islamic-bayan');
    setActiveMode('pro');
    if (audioBuffer) {
      renderCleanBuffer(audioBuffer, { ...DEFAULT_DSP_PARAMS });
    }
  };

  // Playback handlers
  const handlePlayPause = async () => {
    if (!hasAudio) return;
    if (isPlaying) {
      engine.pause();
    } else {
      await engine.play();
    }
  };

  const handleStop = () => {
    engine.stop();
  };

  const handleToggleLoop = () => {
    const next = !loop;
    setLoop(next);
    engine.setLoop(next);
  };

  const handleModeChange = (mode: 'cleaned' | 'original' | 'delta') => {
    setListeningMode(mode);
    engine.setListeningMode(mode);
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    engine.seek(seconds);
  };

  const handleMasterGainChange = (gain: number) => {
    handleParamChange({ masterGain: gain });
  };

  // User Auth & Upgrade Handlers
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('auraclean_user', JSON.stringify(user));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('auraclean_user');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpgradePlan = (plan: UserPlan) => {
    if (currentUser) {
      const updated = { ...currentUser, plan };
      setCurrentUser(updated);
      try {
        localStorage.setItem('auraclean_user', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    } else {
      const guestUser: UserAccount = {
        id: `usr-${Date.now()}`,
        name: 'VIP Creator',
        email: 'creator@auraclean.pk',
        plan,
        planActivatedDate: new Date().toISOString(),
      };
      setCurrentUser(guestUser);
      try {
        localStorage.setItem('auraclean_user', JSON.stringify(guestUser));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openSeoGuides = (tab = 'about') => {
    setSeoInitialTab(tab);
    setIsSeoOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        onReset={handleReset}
        onOpenMic={() => setIsMicOpen(true)}
        onLoadDemo={handleLoadDemo}
        hasAudio={hasAudio}
        onToggleHelp={() => setIsHelpOpen(true)}
        onBackToUpload={handleBackToUpload}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenGuides={openSeoGuides}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* VIP Plan Promo Banner with SajidAli Easypaisa / JazzCash */}
        <div className="bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-purple-500/10 border border-amber-500/30 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">AuraClean Studio PRO Suite:</span>
              <span className="text-slate-300 ml-1.5 hidden sm:inline">
                Full 5GB Video & Audio Voice Cleaner via Easypaisa & JazzCash (SajidAli: 03280264770)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPricingOpen(true)}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow transition-all flex items-center gap-1.5"
            >
              <span>View PKR Plans (From PKR 999)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* File Load Error Toast Notice */}
        {fileErrorToast && (
          <div className="bg-rose-950/70 border border-rose-500/50 rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-xs text-rose-200 shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <span>{fileErrorToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setFileErrorToast(null)}
              className="px-2.5 py-1 rounded-md bg-rose-900/50 hover:bg-rose-900 text-rose-300 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Video & Audio Cleaner Studio Workspace */}
        {!hasAudio ? (
          <div className="space-y-4">
            {/* Optional Restore Banner if user navigated back */}
            {previousBuffer && (
              <div className="bg-[#0b1118]/90 border border-slate-800 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
                <div className="flex items-center gap-2.5">
                  <FileAudio className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-400">Previous file:</span>
                  <span className="font-mono text-slate-200 font-medium truncate max-w-xs sm:max-w-md">
                    {previousFileName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRestorePrevious}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all"
                >
                  Reopen Cleaned File →
                </button>
              </div>
            )}

            <Dropzone
              onFileSelect={handleFileSelect}
              onLoadDemo={handleLoadDemo}
              onOpenMic={() => setIsMicOpen(true)}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Top Workspace Session Bar with Back to Upload Button & File Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0b1118]/90 border border-slate-800 rounded-xl px-4 py-2.5 text-xs shadow-md">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBackToUpload}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 text-slate-200 font-medium flex items-center gap-1.5 transition-all shadow-sm"
                  title="Return to upload screen"
                >
                  <ArrowLeft className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold">Back to Upload</span>
                </button>

                <div className="h-4 w-px bg-slate-800 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="text-slate-300 font-medium">Session Active</span>
                  <span className="text-slate-600">·</span>
                  {isVideoFile ? (
                    <Film className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <FileAudio className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  <span className="font-mono text-slate-300 font-semibold truncate max-w-[180px] sm:max-w-xs">
                    {fileName}
                  </span>
                  {fileSize > 0 && (
                    <span className="font-mono text-[11px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {formatBytes(fileSize)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExportOpen(true)}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>{isVideoFile ? 'Export Cleaned Video / Audio' : 'Export Studio Audio'}</span>
                </button>
              </div>
            </div>

            {/* Smart Audio Quality Report Card */}
            <AudioAnalysisCard
              report={analysisReport}
              isProcessing={isLoading}
            />

            {/* Main Interactive Waveform Stage */}
            <WaveformStage
              engine={engine}
              buffer={audioBuffer}
              processedBuffer={processedBuffer}
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              fileName={fileName}
              fileSize={fileSize}
              isStreaming={isStreaming}
              isRenderingClean={isRenderingClean}
              onSeek={handleSeek}
            />

            {/* Primary Transport & Listening Mode Switcher */}
            <TransportBar
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              loop={loop}
              listeningMode={listeningMode}
              masterGain={dspParams.masterGain}
              onPlayPause={handlePlayPause}
              onStop={handleStop}
              onToggleLoop={handleToggleLoop}
              onModeChange={handleModeChange}
              onSeek={handleSeek}
              onMasterGainChange={handleMasterGainChange}
              onOpenExport={() => setIsExportOpen(true)}
              hasAudio={hasAudio}
            />

            {/* 4 Core Modes & 10 Smart Presets Rack */}
            <SmartPresetsRack
              activePresetId={activePresetId}
              activeMode={activeMode}
              onSelectPreset={handleSelectPreset}
              onSelectMode={handleSelectMode}
            />

            {/* Voice Tone & Instant Auditioning Hub */}
            <VoiceToneAndResultsHub
              engine={engine}
              params={dspParams}
              onChange={handleParamChange}
              audioBuffer={audioBuffer}
              processedBuffer={processedBuffer}
              onCleanBufferReady={(buf) => setProcessedBuffer(buf)}
              fileName={fileName}
            />

            {/* Difference Audition Hub */}
            <DifferenceAuditionHub
              engine={engine}
              listeningMode={listeningMode}
              onModeChange={handleModeChange}
              isPlaying={isPlaying}
              gateAttenuationDb={gateAttenuationDb}
            />

            {/* Voice Purity & Speaker Shielding Analysis */}
            <VoicePurityRadar
              params={dspParams}
              gateAttenuationDb={gateAttenuationDb}
              engine={engine}
              onApplyDeepClean={(updated) => handleParamChange(updated)}
            />

            {/* Advanced 15-Stage Manual Audio Controls */}
            <AdvancedManualControls
              params={dspParams}
              onChange={handleParamChange}
              onReset={handleReset}
              onPreview={handlePlayPause}
              isPlaying={isPlaying}
            />

          </div>
        )}

      </main>

      {/* Footer with SEO Links */}
      <footer className="border-t border-slate-900 bg-[#05070B] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">AuraClean Studio PRO</span>
              <span>·</span>
              <span>Professional AI Audio & Voice Enhancement Studio</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <button type="button" onClick={() => openSeoGuides('about')} className="hover:text-white transition-colors">About</button>
              <button type="button" onClick={() => openSeoGuides('podcast')} className="hover:text-white transition-colors">Podcast Cleaner</button>
              <button type="button" onClick={() => openSeoGuides('youtube')} className="hover:text-white transition-colors">YouTube Voice</button>
              <button type="button" onClick={() => openSeoGuides('privacy')} className="hover:text-white transition-colors">Privacy</button>
              <button type="button" onClick={() => openSeoGuides('terms')} className="hover:text-white transition-colors">Terms</button>
              <button type="button" onClick={() => openSeoGuides('contact')} className="hover:text-white transition-colors">Contact</button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-900 pt-3">
            <span>Easypaisa / JazzCash Account: 03280264770 (SajidAli)</span>
            <span>Zero Data Retention Guarantee · In-Memory DSP Processing</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MicRecordModal
        isOpen={isMicOpen}
        onClose={() => setIsMicOpen(false)}
        onAudioRecorded={handleAudioRecorded}
        audioCtx={engine.getContext()}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        engine={engine}
        sourceFileName={fileName || 'Recorded_Audio.wav'}
        onBackToUpload={handleBackToUpload}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onOpenPricing={() => {
          setIsAuthOpen(false);
          setIsPricingOpen(true);
        }}
      />

      <PricingPlansModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        currentUser={currentUser}
        onUpgradePlan={handleUpgradePlan}
        audioCtx={engine.getContext()}
      />

      <ProjectHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <SeoPagesModal
        isOpen={isSeoOpen}
        onClose={() => setIsSeoOpen(false)}
        initialTab={seoInitialTab}
      />

      <ImageUploadNoticeModal
        isOpen={isImageNoticeOpen}
        onClose={() => setIsImageNoticeOpen(false)}
        imageFileName={detectedImageName}
        onBrowseAudio={() => {}}
        onOpenMic={() => setIsMicOpen(true)}
        onLoadDemo={handleLoadDemo}
      />

    </div>
  );
}
