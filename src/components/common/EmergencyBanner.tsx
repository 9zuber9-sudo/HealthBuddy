import React from 'react';
import { ShieldAlert, PhoneCall, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface EmergencyBannerProps {
  title?: string;
  message?: string;
  onOpenEmergency?: () => void;
  onFindHealthcare?: () => void;
  emergencyNumber?: string;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  title = 'Seek Emergency Medical Care Now',
  message = 'Based on your reported symptoms, immediate medical evaluation is required. Do not wait for symptoms to worsen.',
  onOpenEmergency,
  onFindHealthcare,
  emergencyNumber = '911',
}) => {
  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 rounded-2xl shadow-xl border border-red-500 my-4 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-xs rounded-xl shrink-0">
            <ShieldAlert className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold tracking-wider uppercase mb-1">
              🚨 Urgent Action Required
            </div>
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
            <p className="text-sm text-red-100 mt-1 max-w-xl leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={`tel:${emergencyNumber}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-red-600 font-bold hover:bg-red-50 transition-all shadow-md active:scale-95 text-sm"
          >
            <PhoneCall className="w-4 h-4 fill-current" />
            Call {emergencyNumber}
          </a>
          {onOpenEmergency && (
            <Button
              variant="emergency"
              size="md"
              onClick={onOpenEmergency}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Emergency Mode
            </Button>
          )}
          {onFindHealthcare && (
            <Button
              variant="outline"
              size="md"
              className="border-white/40 text-white hover:bg-white/10"
              onClick={onFindHealthcare}
            >
              Nearby Hospitals
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
