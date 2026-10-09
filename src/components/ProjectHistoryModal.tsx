import React, { useState, useEffect } from 'react';
import {
  X,
  FolderOpen,
  Calendar,
  Clock,
  Download,
  Trash2,
  FileAudio,
  Film,
  Play,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { ProjectHistoryItem } from '../types';
import { formatBytes, formatTime } from '../audio/audioUtils';

interface ProjectHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReopenProject?: (item: ProjectHistoryItem) => void;
}

export const ProjectHistoryModal: React.FC<ProjectHistoryModalProps> = ({
  isOpen,
  onClose,
  onReopenProject,
}) => {
  const [history, setHistory] = useState<ProjectHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('auraclean_project_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'proj-1',
        name: 'Podcast_Episode_14_Master',
        fileType: 'audio',
        originalFileName: 'Podcast_Episode_14_Raw.wav',
        fileSizeBytes: 48500000,
        durationSeconds: 942,
        dateCreated: '2026-10-06 14:20',
        presetName: '🎙 Podcast Voice',
        qualityScoreBefore: 62,
        qualityScoreAfter: 95,
      },
      {
        id: 'proj-2',
        name: 'Peer_Ajmal_Raza_Qadri_Bayan_Clean',
        fileType: 'video',
        originalFileName: 'Ajmal_Qadri_New_Bayan_2026.mp4',
        fileSizeBytes: 184000000,
        durationSeconds: 1530,
        dateCreated: '2026-10-05 19:45',
        presetName: '📢 Islamic Bayan',
        qualityScoreBefore: 58,
        qualityScoreAfter: 96,
      },
      {
        id: 'proj-3',
        name: 'Tech_Review_Vlog_Cleaned',
        fileType: 'video',
        originalFileName: 'YouTube_Tech_Review_4K.mov',
        fileSizeBytes: 340000000,
        durationSeconds: 720,
        dateCreated: '2026-10-04 11:12',
        presetName: '🎥 YouTube Voice PRO',
        qualityScoreBefore: 65,
        qualityScoreAfter: 94,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('auraclean_project_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((p) => p.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b1118] border border-cyan-500/30 rounded-2xl p-6 max-w-4xl w-full space-y-5 shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Projects & Processing History</h3>
              <p className="text-xs text-slate-400">
                View, download, and manage your recent audio & video voice enhancement projects
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Projects */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No processing history yet. Clean your first audio or video to see it here!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-[#060a12] border border-slate-800/90 hover:border-cyan-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-cyan-400">
                    {item.fileType === 'video' ? <Film className="w-5 h-5 text-rose-400" /> : <FileAudio className="w-5 h-5 text-cyan-400" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                      {item.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{item.dateCreated}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{formatTime(item.durationSeconds)}</span>
                      </span>
                      <span>·</span>
                      <span>{formatBytes(item.fileSizeBytes)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  {/* Quality Score Gain */}
                  <div className="text-right">
                    <span className="text-[9px] font-mono uppercase text-slate-500 block">Quality Boost</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {item.qualityScoreBefore}% → {item.qualityScoreAfter}%
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{history.length} Saved Projects</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
