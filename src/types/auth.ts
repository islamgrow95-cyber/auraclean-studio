export type UserPlan = 'free' | 'pro' | 'annual' | 'lifetime';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  plan: UserPlan;
  planActivatedDate?: string;
  planExpiryDate?: string;
  transactionId?: string;
  paymentMethod?: 'easypaisa' | 'jazzcash' | 'card' | 'none';
}

export interface PricingPlan {
  id: UserPlan;
  name: string;
  tagline: string;
  pricePkr: number;
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
  methods: [
    {
      id: 'easypaisa',
      name: 'Easypaisa',
      color: 'emerald',
      title: 'Sajid Ali',
      number: '03280264770',
      tag: 'Instant Mobile Transfer',
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      color: 'amber',
      title: 'Sajid Ali',
      number: '03280264770',
      tag: 'Instant Mobile Transfer',
    },
  ],
  whatsappNumber: '923280264770',
};
