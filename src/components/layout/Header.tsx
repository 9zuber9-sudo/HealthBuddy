import React from 'react';
import { ShieldAlert, HeartPulse, LogOut } from 'lucide-react';
import type { PageId, UserProfile } from '../../types';
import { Button } from '../common/Button';

interface HeaderProps {
  activePage: PageId;
  user: UserProfile | null;
  onNavigate: (page: PageId) => void;
  onTriggerEmergency: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  user,
  onNavigate,
  onTriggerEmergency,
  onSignOut,
}) => {
  const getPageTitle = (page: PageId) => {
    switch (page) {
      case 'landing': return 'Welcome to HealthBridge';
      case 'auth': return 'Sign In / Register';
      case 'dashboard': return 'Health Overview';
      case 'ai-guide': return 'AI Health Guide';
      case 'emergency': return '🚨 Emergency Mode';
      case 'medicines': return 'My Medicines';
      case 'records': return 'Health Records';
      case 'family': return 'Family Health';
      case 'healthcare': return 'Find Healthcare Near You';
      case 'profile': return 'Profile & Settings';
      default: return 'HealthBridge';
    }
  };

  if (activePage === 'landing' || activePage === 'auth') return null;

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div
          onClick={() => onNavigate('dashboard')}
          className="lg:hidden p-2 rounded-xl bg-teal-600 text-white cursor-pointer"
        >
          <HeartPulse className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-none">
            {getPageTitle(activePage)}
          </h2>
          <span className="text-[11px] text-slate-500 hidden sm:inline-block">
            HealthBridge • Post-care management platform
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {activePage !== 'emergency' && (
          <Button
            variant="emergency"
            size="sm"
            onClick={onTriggerEmergency}
            leftIcon={<ShieldAlert className="w-4 h-4 fill-current" />}
            className="animate-pulse"
          >
            <span className="hidden sm:inline">Emergency Mode</span>
            <span className="sm:hidden">🚨 911</span>
          </Button>
        )}

        <div
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors border border-slate-200/60"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-700 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
            {user ? user.name.split(' ').map((n) => n[0]).join('') : 'AM'}
          </div>
          <div className="hidden md:block text-left pr-1">
            <p className="text-xs font-bold text-slate-900 leading-tight">{user ? user.name : 'Alex Morgan'}</p>
            <p className="text-[10px] text-teal-700 font-medium">{user ? `Blood: ${user.bloodGroup}` : 'O+'}</p>
          </div>
        </div>

        {onSignOut && (
          <button
            onClick={onSignOut}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
