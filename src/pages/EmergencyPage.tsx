import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  Heart,
  Droplet,
  Flame,
  Activity,
  Wind,
  HeartPulse,
  Zap,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { PageId, FirstAidGuide, UserProfile } from '../types';
import { Card } from '../components/common/Card';
import { getFirstAidGuides } from '../services/healthService';
import { getCurrentUser, getSettings } from '../services/authService';

interface EmergencyPageProps {
  onNavigate: (page: PageId) => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onNavigate }) => {
  const [guides, setGuides] = useState<FirstAidGuide[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [emergencyNumber, setEmergencyNumber] = useState('911');
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>('fa-cardiac');

  useEffect(() => {
    const load = async () => {
      const [gData, uData, sData] = await Promise.all([
        getFirstAidGuides(),
        getCurrentUser(),
        getSettings(),
      ]);
      setGuides(gData);
      setUser(uData);
      setEmergencyNumber(sData.emergencyNumber || '911');
    };
    load();
  }, []);

  const getGuideIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplet': return <Droplet className="w-5 h-5 text-rose-500" />;
      case 'Flame': return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Activity': return <Activity className="w-5 h-5 text-sky-500" />;
      case 'Wind': return <Wind className="w-5 h-5 text-teal-500" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-red-500" />;
      case 'Zap': return <Zap className="w-5 h-5 text-purple-500" />;
      default: return <ShieldAlert className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-red-600 via-rose-700 to-red-800 text-white p-6 sm:p-10 rounded-3xl shadow-2xl border-2 border-red-500 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4 animate-bounce" /> 🚨 Emergency Mode Active
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">🚨 Emergency Mode</h1>

          <p className="text-sm sm:text-base text-red-100 max-w-xl mx-auto font-medium leading-relaxed">
            If you believe this is a medical emergency, seek professional emergency care immediately.
          </p>

          <div className="pt-4 pb-2">
            <a
              href={`tel:${emergencyNumber}`}
              className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-white text-red-600 font-extrabold text-xl sm:text-2xl shadow-2xl hover:bg-red-50 active:scale-95 transition-all border-4 border-red-200"
            >
              <PhoneCall className="w-7 h-7 fill-current animate-pulse" />
              CALL EMERGENCY SERVICES ({emergencyNumber})
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-4">
            <a
              href={`tel:${emergencyNumber}`}
              className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4" /> Call {emergencyNumber}
            </a>

            <button
              onClick={() => onNavigate('healthcare')}
              className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <MapPin className="w-4 h-4 text-teal-200" /> Find Nearby Hospital
            </button>

            <a
              href={`tel:${user?.emergencyContactPhone || '911'}`}
              className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Heart className="w-4 h-4 text-rose-200" /> Call Emergency Contact
            </a>
          </div>
        </div>
      </div>

      {user && (
        <Card className="bg-white border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Designated Personal Emergency Contact</span>
                <h4 className="text-base font-bold text-slate-900">{user.emergencyContactName}</h4>
                <p className="text-xs text-slate-600 font-mono mt-0.5">{user.emergencyContactPhone}</p>
              </div>
            </div>

            <a
              href={`tel:${user.emergencyContactPhone}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <PhoneCall className="w-4 h-4" /> Call Contact Now
            </a>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">First-Aid Guidance</h2>
            <p className="text-xs text-slate-500">Brief, safety-focused emergency response procedures.</p>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold uppercase">6 Protocols</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guides.map((guide) => {
            const isExpanded = expandedGuideId === guide.id;
            return (
              <Card
                key={guide.id}
                className={`transition-all ${
                  isExpanded ? 'border-teal-400 ring-1 ring-teal-200 bg-white' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div
                  onClick={() => setExpandedGuideId(isExpanded ? null : guide.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                      {getGuideIcon(guide.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{guide.title}</h4>
                      <span className="text-[11px] text-slate-500 font-medium">{guide.category}</span>
                    </div>
                  </div>

                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Immediate Action Steps:</h5>
                      <ol className="space-y-1.5 text-xs text-slate-700 pl-4 list-decimal leading-relaxed">
                        {guide.steps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {guide.warnings.length > 0 && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-rose-700">
                          <AlertTriangle className="w-3.5 h-3.5" /> CRITICAL SAFETY WARNINGS:
                        </div>
                        {guide.warnings.map((warn, idx) => (
                          <p key={idx} className="opacity-90">• {warn}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">
            “First-aid information is not a substitute for emergency medical care. Always prioritize calling emergency services immediately when severe injuries or medical crises occur.”
          </p>
        </div>
      </div>
    </div>
  );
};
