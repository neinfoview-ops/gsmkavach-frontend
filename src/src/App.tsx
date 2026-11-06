import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Download, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  Info, 
  X 
} from 'lucide-react';
import { ToolCredentials } from '../types';

interface CredentialDisplayCardProps {
  serviceName: string;
  credentials: ToolCredentials;
  orderNumber?: string;
  onClose: () => void;
}

export const CredentialDisplayCard: React.FC<CredentialDisplayCardProps> = ({
  serviceName,
  credentials,
  orderNumber,
  onClose,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // 1. Live Countdown Timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = credentials.expiryTimestamp - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [credentials.expiryTimestamp]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden animate-in fade-in duration-300">
      
      {/* 1. Header Row (Service Activated + Big Visible Order Ref) */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <span>Service Activated Successfully!</span>
            </h2>
            
            {/* BIG & BOLD ORDER REF (Camera Friendly) */}
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-100">
                Order Ref:
              </span>
              <span className="bg-black/30 px-3 py-1 rounded-xl font-mono text-sm sm:text-base font-black text-white tracking-wider border border-white/25 shadow-inner">
                {orderNumber || 'COMPLETED'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Timer Pill */}
        {timeLeft && timeLeft !== 'Expired' && (
          <div className="self-start sm:self-auto flex items-center gap-2 bg-black/25 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
            <Clock className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span className="font-mono text-xs sm:text-sm font-black tracking-wider text-emerald-200">
              {timeLeft}
            </span>
          </div>
        )}
      </div>

      {/* 2. Main Body Content */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Service Name Banner */}
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
            Active Tool Access
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {serviceName}
          </h3>
        </div>

        {/* 3. Credentials Display (Bigger Font, High Contrast) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* USERNAME BOX */}
          <div className="p-4 bg-slate-50 border-2 border-slate-200/90 rounded-2xl space-y-2 hover:border-blue-400 transition">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500">
              <span>Username / Login ID</span>
              <button
                type="button"
                onClick={() => handleCopy(credentials.username, 'username')}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold transition cursor-pointer"
              >
                {copiedField === 'username' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-base sm:text-lg font-black text-slate-900 select-all break-all">
              {credentials.username}
            </div>
          </div>

          {/* PASSWORD BOX */}
          <div className="p-4 bg-slate-50 border-2 border-slate-200/90 rounded-2xl space-y-2 hover:border-blue-400 transition">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500">
              <span>Password / Access Key</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(credentials.password, 'password')}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold transition cursor-pointer"
                >
                  {copiedField === 'password' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-base sm:text-lg font-black text-slate-900 select-all break-all">
              {showPassword ? credentials.password : '••••••••••••'}
            </div>
          </div>
        </div>

        {/* 4. Official Tool Download Bar */}
        {credentials.toolDownloadUrl && (
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Official Tool Launcher
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Download official setup to run on your workstation
                </p>
              </div>
            </div>
            <a
              href={credentials.toolDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shrink-0 shadow-sm"
            >
              <span>Download Tool</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* 5. Instructions & Usage Rules */}
        {credentials.instructions && credentials.instructions.length > 0 && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Quick Usage Guide</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
              {credentials.instructions.map((inst, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 6. Close / Done Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-2xl transition cursor-pointer shadow-md"
        >
          Close Window (Saved to Order History)
        </button>

      </div>
    </div>
  );
};
