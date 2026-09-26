import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  ShieldAlert,
  Pill,
  FileText,
  Users,
  MapPin,
  Settings,
  HeartPulse,
} from 'lucide-react';
import type { PageId } from '../../types';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-guide' as PageId, label: 'AI Health Guide', icon: Sparkles, badge: 'AI' },
    { id: 'emergency' as PageId, label: 'Emergency', icon: ShieldAlert, danger: true },
    { id: 'medicines' as PageId, label: 'Medicines', icon: Pill },
    { id: 'records' as PageId, label: 'Health Records', icon: FileText },
    { id: 'family' as PageId, label: 'Family Health', icon: Users },
    { id: 'healthcare' as PageId, label: 'Find Healthcare', icon: MapPin },
    { id: 'profile' as PageId, label: 'Profile / Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 min-h-screen sticky top-0 h-screen select-none z-30">
      <div className="p-6 border-b border-slate-800/80">
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-md group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-none">HealthBuddy</h1>
            <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400">Post-Care SaaS</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          let itemClasses = 'flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer ';

          if (isActive) {
            itemClasses += item.danger
              ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-900/30'
              : 'bg-teal-600 text-white font-bold shadow-md shadow-teal-900/20';
          } else {
            itemClasses += item.danger
              ? 'text-rose-400 hover:bg-rose-950/40 hover:text-rose-300'
              : 'text-slate-400 hover:bg-slate-800/60 hover:text-white';
          }

          return (
            <div key={item.id} onClick={() => onNavigate(item.id)} className={itemClasses}>
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : item.danger ? 'text-rose-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {item.badge}
                </span>
              )}

              {item.danger && !isActive && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/80">
        <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-200">"Survival is only the first step."</p>
          <p className="text-[11px] mt-1 text-slate-400">Post-recovery care platform.</p>
        </div>
      </div>
    </aside>
  );
};
