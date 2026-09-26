import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  ShieldAlert,
  Pill,
  MoreHorizontal,
  FileText,
  Users,
  MapPin,
  Settings,
  X,
  HeartPulse,
} from 'lucide-react';
import type { PageId } from '../../types';

interface MobileNavProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activePage, onNavigate }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard' as PageId, label: 'Home', icon: LayoutDashboard },
    { id: 'ai-guide' as PageId, label: 'AI Guide', icon: Sparkles },
    { id: 'emergency' as PageId, label: 'Emergency', icon: ShieldAlert, danger: true },
    { id: 'medicines' as PageId, label: 'Medicines', icon: Pill },
  ];

  const moreItems = [
    { id: 'records' as PageId, label: 'Health Records', icon: FileText, desc: 'Prescriptions & lab reports' },
    { id: 'family' as PageId, label: 'Family Health', icon: Users, desc: 'Profiles for relatives' },
    { id: 'healthcare' as PageId, label: 'Find Healthcare', icon: MapPin, desc: 'Hospitals & pharmacies' },
    { id: 'profile' as PageId, label: 'Profile & Settings', icon: Settings, desc: 'Account & preferences' },
  ];

  const handleSelectMore = (id: PageId) => {
    setIsMoreOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsMoreOpen(false)}
          />
          <div className="relative bg-white rounded-t-3xl p-6 border-t border-slate-200 shadow-2xl z-10 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">All Modules</h3>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectMore(item.id)}
                    className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-teal-50 border-teal-300 text-teal-900'
                        : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-white shadow-2xs text-teal-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{item.label}</h4>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around shadow-lg">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePage === tab.id;

          if (tab.danger) {
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
                  isActive ? 'text-rose-600 scale-105' : 'text-rose-500'
                }`}
              >
                <div className="p-2 rounded-xl bg-rose-600 text-white shadow-md shadow-rose-500/30">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold mt-1 text-rose-600">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all ${
                isActive ? 'text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600 stroke-[2.5]' : ''}`} />
              <span className="text-[11px] mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsMoreOpen(true)}
          className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all ${
            moreItems.some((m) => m.id === activePage) ? 'text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[11px] mt-1 font-medium">More</span>
        </button>
      </nav>
    </>
  );
};
