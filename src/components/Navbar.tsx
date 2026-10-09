import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Mic,
  Sparkles,
  AudioWaveform,
  HelpCircle,
  ArrowLeft,
  Crown,
  User,
  LogOut,
  ChevronDown,
  FolderOpen,
  ShieldAlert,
  BookOpen,
} from 'lucide-react';
import { UserAccount } from '../types';
import logoImg from '../assets/images/auraclean_logo_1790880528622.jpg';

interface NavbarProps {
  onReset: () => void;
  onOpenMic: () => void;
  onLoadDemo: (sampleType: 'podcast-hvac' | 'ground-hum' | 'street-interview') => void;
  hasAudio: boolean;
  onToggleHelp: () => void;
  onBackToUpload: () => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  onOpenHistory: () => void;
  onOpenAdmin: () => void;
  onOpenGuides: (tab?: string) => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onReset,
  onOpenMic,
  onLoadDemo,
  hasAudio,
  onToggleHelp,
  onBackToUpload,
  onOpenPricing,
  onOpenAuth,
  onOpenHistory,
  onOpenAdmin,
  onOpenGuides,
  currentUser,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Zone 1: Logo & Back Button */}
        <div className="flex items-center gap-3">
          {hasAudio && (
            <button
              onClick={onBackToUpload}
              className="mr-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
              title="Go back to file upload screen"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold hidden sm:inline">Back to Upload</span>
            </button>
          )}

          {/* Studio Brand Logo */}
          <div className="relative group shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-400/50 shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-500/30 transition-transform group-hover:scale-105 bg-[#0b0f19]">
              <img
                src={logoImg}
                alt="AuraClean Studio Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0b0f19] shadow"
              title="Studio DSP Engine Online"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                AuraClean Studio
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                PRO 5GB
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links (History, Guides, Admin) */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 rounded-xl p-1">
          <button
            type="button"
            onClick={onOpenHistory}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition-all"
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Projects</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenGuides('about')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Guides</span>
          </button>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-purple-300 hover:bg-slate-800 flex items-center gap-1.5 transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin</span>
          </button>
        </div>

        {/* Zone 3: Primary Actions (Plans, Auth, Mic, Help) */}
        <div className="flex items-center gap-2">
          
          {/* Pricing Plans in PKR Button */}
          <button
            type="button"
            onClick={onOpenPricing}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="View PKR Pricing Plans & Easypaisa/JazzCash"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span className="hidden sm:inline">VIP Plans</span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1 py-0.2 rounded border border-amber-500/30">
              PKR
            </span>
          </button>

          {/* User Sign In / Profile Button */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-cyan-500/40 text-slate-200 text-xs font-medium flex items-center gap-2 transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="truncate max-w-[90px] sm:max-w-[120px] font-semibold">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {currentUser.plan}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-cyan-400">
                      <Crown className="w-3 h-3" />
                      <span className="uppercase font-mono font-semibold">{currentUser.plan} Plan Active</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenHistory();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>My Projects History</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenPricing();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Manage VIP Plan</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-slate-800 flex items-center gap-2 border-t border-slate-800"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Login</span>
            </button>
          )}

          {/* Record Microphone Modal Button */}
          <button
            onClick={onOpenMic}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
            title="Record directly from microphone"
          >
            <Mic className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Record Mic</span>
          </button>

          {/* Help & Guide Modal Button */}
          <button
            onClick={onToggleHelp}
            className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-all shadow-sm"
            title="DSP Guide & Hotkeys (?)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Reset All DSP Knobs Button */}
          {hasAudio && (
            <button
              onClick={onReset}
              className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-all shadow-sm"
              title="Reset DSP parameters to default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
