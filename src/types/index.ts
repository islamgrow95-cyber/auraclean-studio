/**
 * AuraClean Studio PRO - Master Type Definitions
 */

export type UserPlan = 'free' | 'pro' | 'annual' | 'lifetime';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  plan: UserPlan;
  role?: 'user' | 'admin';
  planActivatedDate?: string;
  planExpiryDate?: string;
  transactionId?: string;
  paymentMethod?: 'easypaisa' | 'jazzcash' | 'card' | 'none';
  audioProcessedMinutes?: number;
  videoProcessedMinutes?: number;
}

export type ProcessingMode = 'quick' | 'pro' | 'studio' | 'natural' | 'custom';
export type ListeningMode = 'cleaned' | 'original' | 'delta';

export type PresetId =
  | 'podcast-voice'
  | 'youtube-voice-pro'
  | 'islamic-bayan'
  | 'studio-voice'
  | 'mobile-recording'
  | 'headphone-recording'
  | 'car-recording'
  | 'room-recording'
  | 'windy-recording'
  | 'telephone-recording'
  | 'custom';

export interface Preset {
  id: string;
  name: string;
  category: string;
  description: string;
  params: Partial<DSPParams>;
}

export interface DSPParams {
  // Noise Gate
  gateEnabled: boolean;
  gateThreshold: number; // dB (-80 to -10)
  gateRelease: number;   // ms (20 to 500)
  gateAttack: number;    // ms (2 to 50)
  gateFloor: number;     // dB attenuation floor (-60 to 0)

  // Filters & Mains Hum Harmonics
  hpCutoff: number;      // Hz (20 to 500)
  lpCutoff: number;      // Hz (2000 to 20000)
  notch50Hz: boolean;    // 50Hz EU / Asia / Pakistan mains hum
  notch60Hz: boolean;    // 60Hz US / ground loop / power supply hum
  humRemoval50HzHarmonics?: boolean; // 50 Hz fundamental + 100Hz, 150Hz, 200Hz harmonics
  humRemoval60HzHarmonics?: boolean; // 60 Hz fundamental + 120Hz, 180Hz, 240Hz harmonics
  notch100Hz?: boolean;
  notch120Hz?: boolean;
  notch150Hz?: boolean;
  notch180Hz?: boolean;
  notch200Hz?: boolean;
  notch240Hz?: boolean;

  // De-Clip & Anti-Distortion
  deClipEnabled?: boolean; // Repairs distorted, clipped, or "phati hui" speech

  // 5-Band Surgical EQ for Bayan, Speech & Voice Master
  eq80HzGain: number;    // 80 Hz: -3 dB (rumble / sub mud cut)
  eq250HzGain: number;   // 200-300 Hz: -2 dB (boxy resonance cut)
  eq3kHzGain: number;    // 2-4 kHz: +1.5 dB (vocal clarity & intelligibility)
  eq7kHzGain: number;    // 6-8 kHz: +1.0 dB (crisp speech articulation)
  eq10kHzGain: number;   // 10 kHz+: +1.0 dB max (clean air & sheen)

  // 3-Band EQ & Vocal Peaking Filter (Legacy/Compatible mappings)
  bassGain: number;      // dB (-12 to +12)
  midGain: number;       // dB (-12 to +12)
  midFreq: number;       // Hz (500 to 4500)
  trebleGain: number;    // dB (-12 to +12)
  vocalGain: number;     // alias for midGain
  vocalFreq: number;     // alias for midFreq
  vocalQ: number;        // Q factor (0.5 to 5.0)

  // De-Esser
  deEsserEnabled: boolean;
  deEsserFreq: number;   // Hz (4000 to 9000)
  deEsserGain: number;   // dB (-18 to 0)

  // Dynamics & Master
  compressorEnabled: boolean;
  compThreshold: number; // dB (-40 to 0)
  compRatio: number;     // ratio (2:1 to 3:1 recommended, e.g. 2.5:1)
  masterGain: number;    // linear multiplier (0 to 3.0)

  // Advanced Sliders (0-100%)
  noiseReductionPercent: number; // 30-40% optimal for zero-artifact speech
  voiceEnhancePercent: number;   // 0 to 100%
  voiceIsolationPercent: number; // 60-75% optimal vocal separation
  clarityPercent: number;        // 0 to 100%
  echoReductionPercent: number;  // 0 to 100%
  reverbReductionPercent: number;// 20-35% de-reverb
  deReverbPercent?: number;      // alias 20-35%
  targetLufs: number;            // -24 to -8 LUFS
  limiterCeilingDb: number;      // -1.0 dB standard peak ceiling

  // Voice Tone & Pitch (Preserves duration & speech speed)
  voiceTone: 'original' | 'mota' | 'bareek' | 'custom';
  pitchSemitones: number;        // -12 to +12 semitones
  speedRatio: number;            // 0.5 to 2.0 (1.0 = normal)

  // Cleaning Pipeline & Speaker Priority
  cleaningIntensity: 'auto' | 'light' | 'medium' | 'strong';
  speakerPriority: 'main' | 'all';
  preserveIdentity: boolean;
  echoReverbReduction: boolean;
  backgroundVoiceSuppression: boolean;

  // Vocal Focus (center-channel extraction) — keeps centered voice, reduces
  // stereo-spread background music/nasheeds. Safe no-op on mono sources.
  vocalFocus: boolean;      // true = enable mid/side vocal focus
  vocalFocusAmount: number; // 0-100% (higher = more background reduction)
}

export interface AudioAnalysisReport {
  noiseLevel: 'Low' | 'Medium' | 'High' | 'Severe';
  noiseLevelDb: number;
  voiceClarity: 'Low' | 'Medium' | 'High' | 'Crystal';
  clippingStatus: 'None' | 'Low' | 'Moderate' | 'Severe';
  clippingCount: number;
  loudnessLufs: number;
  peakLevelDb: number;
  dynamicRangeDb: number;
  humDetected: boolean;
  hissDetected: boolean;
  windDetected: boolean;
  echoDetected: boolean;
  originalQualityScore: number; // 0-100
  enhancedQualityScore: number; // 0-100
  durationSeconds: number;
  sampleRate: number;
  channels: number;
}

export interface ProjectHistoryItem {
  id: string;
  name: string;
  fileType: 'audio' | 'video';
  originalFileName: string;
  fileSizeBytes: number;
  durationSeconds: number;
  dateCreated: string;
  presetName: string;
  qualityScoreBefore: number;
  qualityScoreAfter: number;
  exportWavBlobUrl?: string;
  notes?: string;
}

export interface SmartPreset {
  id: PresetId;
  name: string;
  category: 'Voice' | 'Environment' | 'Device' | 'Special';
  icon: string;
  description: string;
  targetLufs: string;
  recommendedFor: string;
  params: Partial<DSPParams>;
}

export interface PricingPlan {
  id: UserPlan;
  name: string;
  tagline: string;
  pricePkr: number;
  priceUsd: number;
  period: string;
  popular?: boolean;
  features: string[];
  badge?: string;
}

export const PKR_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Basic Free',
    tagline: 'Rozmarrah ki standard voice cleaning ke liye',
    pricePkr: 0,
    priceUsd: 0,
    period: 'Forever Free',
    features: [
      'Standard Background Noise Reduction',
      'Max 100MB File Upload',
      '16-Bit WAV Export',
      'Vocal EQ & High-Pass / Low-Pass Filters',
      'Web-based Realtime Playback',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Studio (Monthly)',
    tagline: 'Podcasters, YouTubers aur Content Creators ke liye',
    pricePkr: 999,
    priceUsd: 4.99,
    period: '1 Month (Maahana)',
    popular: true,
    badge: 'Popular',
    features: [
      '100% Full Noise Removal + Speaker Voice Shield',
      'Huge 5GB Large File Streaming Support',
      'Studio Quality 24-Bit Studio WAV Audio Export',
      'Instant A/B Difference Crossfader & Auto-Swap',
      'Realtime Speech Clarity & Noise Radar',
      'Voice Alarm & Audio Announcement Alerts',
      'Priority Fast Processing Engine',
    ],
  },
  {
    id: 'annual',
    name: 'VIP Studio (1 Year)',
    tagline: '1 Saal (12 Maah) ke liye mukammal unlimited pro access',
    pricePkr: 2999,
    priceUsd: 14.99,
    period: '1 Year (1 Saal)',
    badge: 'Best Value',
    features: [
      'Poore 1 Saal (12 Months) Ke Liye Access',
      'Everything in Pro Studio Plan Included',
      'Unlimited 5GB Audio Files Cleaning',
      'Commercial Broadcast & Music Licensing',
      'Custom DSP Audio Presets Save & Export',
      'Direct WhatsApp VIP Support (03280264770)',
      'Monthly plan ke muqable mein 75% bachat',
    ],
  },
  {
    id: 'lifetime',
    name: 'VIP Lifetime Master',
    tagline: 'Sirf 1 martaba payment, zindagibhar ke liye sab kuch unlock',
    pricePkr: 9999,
    priceUsd: 49.99,
    period: 'Lifetime (Hamesha Ke Liye)',
    badge: 'King Offer',
    features: [
      'Lifetime Access (Koi Monthly ya Salana Charges Nahi)',
      'Unlimited 5GB Audio Files Cleaning Hamesha Ke Liye',
      'All Future AI & Studio Updates Free Included',
      'Ultra 24-Bit Studio Broadcast Master Export',
      'Instant Priority WhatsApp VIP Support (03280264770)',
      'Multi-device access & Commercial Studio License',
    ],
  },
];

export const PAYMENT_RECIPIENT_INFO = {
  accountName: 'SajidAli',
  accountNumber: '03280264770',
  whatsappNumber: '923280264770',
  methods: [
    {
      id: 'easypaisa',
      name: 'Easypaisa',
      accountNumber: '03280264770',
      accountTitle: 'SajidAli',
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      accountNumber: '03280264770',
      accountTitle: 'SajidAli',
    },
  ],
};

export interface AdminSystemStats {
  totalUsers: number;
  totalProjects: number;
  audioProcessedHours: number;
  videoProcessedHours: number;
  storageUsedGb: number;
  systemHealth: 'Optimal' | 'Degraded' | 'Offline';
  queueActiveJobs: number;
  recentJobs: {
    id: string;
    userName: string;
    file: string;
    status: 'Completed' | 'Processing' | 'Failed';
    date: string;
    duration: string;
  }[];
}
