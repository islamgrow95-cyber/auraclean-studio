import React, { useState } from 'react';
import {
  X,
  Check,
  Crown,
  Sparkles,
  Phone,
  Copy,
  CheckCheck,
  ShieldCheck,
  Send,
  Zap,
  ArrowRight,
  MessageCircle,
  CreditCard,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  PKR_PRICING_PLANS,
  PAYMENT_RECIPIENT_INFO,
  UserAccount,
  UserPlan,
  PricingPlan,
} from '../types/auth';
import { playStudioChimeAndVoice } from '../audio/audioUtils';
import logoImg from '../assets/images/auraclean_logo_1790880528622.jpg';

interface PricingPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUpgradePlan: (plan: UserPlan, transactionId?: string) => void;
  audioCtx: AudioContext | null;
}

export const PricingPlansModal: React.FC<PricingPlansModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpgradePlan,
  audioCtx,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<UserPlan>('pro');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'easypaisa' | 'jazzcash'>('easypaisa');
  const [tid, setTid] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPlanObj = PKR_PRICING_PLANS.find((p) => p.id === selectedPlan) || PKR_PRICING_PLANS[1];

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(PAYMENT_RECIPIENT_INFO.accountNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tid.trim()) {
      alert('Meharbani karke Transaction ID (TID) darj karein.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationSuccess(true);

      // Play success chime & voice
      playStudioChimeAndVoice(
        audioCtx,
        `Mubarak ho! Aap ka ${currentPlanObj.name} plan kamyabi se activate ho chuka hai.`
      );

      onUpgradePlan(selectedPlan, tid.trim());
    }, 1200);
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Sajid Ali Bhai! Maine AuraClean Studio ke liye ${currentPlanObj.name} (PKR ${currentPlanObj.pricePkr}) transfer kiye hain.\n\nTransaction ID: ${tid || 'Pending'}\nSender: ${senderNumber || 'User'}`
    );
    window.open(`https://wa.me/${PAYMENT_RECIPIENT_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b101d] border border-cyan-500/30 rounded-2xl w-full max-w-5xl p-5 sm:p-6 shadow-2xl relative my-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-amber-500/40 shadow-lg shadow-amber-500/20 shrink-0 relative">
              <img
                src={logoImg}
                alt="AuraClean Studio Logo"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 right-0 p-0.5 bg-amber-500 rounded-tl text-slate-950">
                <Crown className="w-2.5 h-2.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  AuraClean Studio VIP Plans (PKR)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Easypaisa & JazzCash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Apni pasand ka plan select karein aur foran 5GB audio cleaning unlock karein
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing Cards Grid (4 Plans) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {PKR_PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isUserCurrent = currentUser?.plan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-400 ring-2 ring-cyan-500/40 shadow-xl shadow-cyan-950/50'
                    : 'bg-[#060a13] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Popular or Best Value Badge */}
                {plan.badge && (
                  <span
                    className={`absolute -top-2.5 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow ${
                      plan.id === 'pro'
                        ? 'bg-cyan-500 text-slate-950'
                        : plan.id === 'annual'
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 ring-1 ring-amber-300'
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-bold text-white">{plan.name}</h3>
                    {isUserCurrent && (
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mb-2.5 min-h-[28px] leading-tight">
                    {plan.tagline}
                  </p>

                  <div className="mb-3 pb-2.5 border-b border-slate-800/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold font-mono text-white">
                        PKR {plan.pricePkr.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{plan.period}</span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-1.5 text-xs">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-300">
                        <Check className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" />
                        <span className="text-[10px] leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full mt-3 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span>{isSelected ? 'Selected' : 'Select'}</span>
                  {isSelected && <Check className="w-3 h-3" />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Payment Transfer Section for Selected Paid Plan */}
        {selectedPlan !== 'free' && (
          <div className="bg-[#070c17] border border-cyan-500/30 rounded-xl p-4 sm:p-5 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Payment Method (PKR Checkout)
                </span>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Pay via Easypaisa / JazzCash</span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    Total: PKR {currentPlanObj.pricePkr}
                  </span>
                </h4>
              </div>

              {/* Method Toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('easypaisa')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    selectedMethod === 'easypaisa'
                      ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-950'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Easypaisa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('jazzcash')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    selectedMethod === 'jazzcash'
                      ? 'bg-amber-600/30 border-amber-400 text-amber-300 shadow-md shadow-amber-950'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>JazzCash</span>
                </button>
              </div>
            </div>

            {/* Official Account Box */}
            <div className="bg-[#0b1222] border border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Account Title (Naam):</span>
                  <span className="text-sm font-bold text-white font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                    {PAYMENT_RECIPIENT_INFO.accountName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Mobile Account Number:</span>
                  <span className="text-base font-bold text-cyan-300 font-mono tracking-wider">
                    {PAYMENT_RECIPIENT_INFO.accountNumber}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                    {selectedMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-all shadow"
                >
                  {copiedNumber ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow"
                  title="WhatsApp support for instant activation"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Verification Form */}
            {verificationSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm">
                      Payment Verification Success!
                    </div>
                    <div>Aap ka {currentPlanObj.name} plan kamyabi se active ho gaya hai.</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  Start Using Pro Studio →
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmPayment} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Your Mobile / Sender Number
                  </label>
                  <input
                    type="tel"
                    placeholder="03xxxxxxxxx"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Transaction ID (TID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 84729183719"
                    value={tid}
                    onChange={(e) => setTid(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <span>Verifying TID...</span>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Confirm & Activate Now</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Urdu instructions note */}
            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              💡 <strong>Tariqa:</strong> Easypaisa ya JazzCash app khol kar <strong>{PAYMENT_RECIPIENT_INFO.accountNumber}</strong> (Sajid Ali) par amount transfer karein aur milne wali <strong>TID (Transaction ID)</strong> yahan darj karke Activate karein ya WhatsApp par screenshot send karein.
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
