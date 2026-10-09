import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, X, AlertTriangle, CheckCircle, AudioWaveform } from 'lucide-react';
import { formatTime } from '../audio/audioUtils';

interface MicRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAudioRecorded: (buffer: AudioBuffer, fileName: string) => void;
  audioCtx: AudioContext | null;
}

export const MicRecordModal: React.FC<MicRecordModalProps> = ({
  isOpen,
  onClose,
  onAudioRecorded,
  audioCtx,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [liveMeter, setLiveMeter] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      cleanup();
    }
  }, [isOpen]);

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setElapsed(0);
    setLiveMeter(0);
    setErrorMsg(null);
  };

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Audio level analyser
      const localCtx = audioCtx || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (localCtx.state === 'suspended') {
        await localCtx.resume();
      }

      const micSource = localCtx.createMediaStreamSource(stream);
      const analyser = localCtx.createAnalyser();
      analyser.fftSize = 256;
      micSource.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateMeter = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setLiveMeter(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };
      animFrameRef.current = requestAnimationFrame(updateMeter);

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : MediaRecorder.isTypeSupported('audio/ogg')
        ? 'audio/ogg'
        : '';

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const recordedMime = recorder.mimeType || mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: recordedMime });
        const arrayBuf = await audioBlob.arrayBuffer();
        try {
          const copy = arrayBuf.slice(0);
          const decoded = await new Promise<AudioBuffer>((resolve, reject) => {
            try {
              const res = localCtx.decodeAudioData(
                copy,
                (b) => resolve(b),
                (e) => reject(e)
              );
              if (res && typeof res.then === 'function') {
                res.then(resolve).catch(reject);
              }
            } catch (e) {
              reject(e);
            }
          });
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(11, 19);
          onAudioRecorded(decoded, `Live-Mic-Recording-${timestamp}.wav`);
          onClose();
        } catch (err) {
          setErrorMsg('Failed to decode recorded microphone audio.');
          console.error(err);
        }
      };

      recorder.start(100);
      setIsRecording(true);

      const startTime = Date.now();
      timerRef.current = window.setInterval(() => {
        setElapsed((Date.now() - startTime) / 1000);
      }, 100);

    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Microphone access denied or unavailable. Please check browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsRecording(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-rose-500 animate-pulse" />
            <h3 className="font-semibold text-white text-base">Record Microphone Input</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg ? (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        ) : null}

        {/* Recording Timer and Visualizer */}
        <div className="bg-[#060911] border border-slate-800 rounded-xl p-6 text-center space-y-4">
          <div className="text-3xl font-mono tabular-nums font-bold text-white tracking-wider">
            {formatTime(elapsed, true)}
          </div>

          {/* Live Volume Meter Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>MIC LEVEL</span>
              <span>{liveMeter}%</span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-75 ${
                  liveMeter > 85 ? 'bg-rose-500' : liveMeter > 50 ? 'bg-amber-400' : 'bg-cyan-500'
                }`}
                style={{ width: `${liveMeter}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-slate-400">
            {isRecording
              ? 'Speak into your microphone. Background room noise will be captured for cleaning.'
              : 'Click Start to begin recording a test voice snippet.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            Cancel
          </button>

          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 flex items-center gap-2"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop & Load into Studio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
