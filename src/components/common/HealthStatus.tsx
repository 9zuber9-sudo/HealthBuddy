import React from 'react';
import { ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';

interface HealthStatusProps {
  status?: 'optimal' | 'attention' | 'critical';
  title?: string;
  subtitle?: string;
}

export const HealthStatus: React.FC<HealthStatusProps> = ({
  status = 'optimal',
  title = 'Health Status: Stable',
  subtitle = 'All vital records and routine medication schedules up to date.',
}) => {
  const configs = {
    optimal: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      badge: 'All Systems Clear',
    },
    attention: {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-900',
      icon: <HeartPulse className="w-5 h-5 text-amber-600" />,
      badge: 'Attention Needed',
    },
    critical: {
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-900',
      icon: <Sparkles className="w-5 h-5 text-rose-600 animate-pulse" />,
      badge: 'Action Required',
    },
  };

  const current = configs[status];

  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border ${current.bg} transition-all`}>
      <div className="p-2.5 rounded-xl bg-white/80 shadow-xs shrink-0">{current.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold">{title}</h4>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/80 shadow-2xs">
            {current.badge}
          </span>
        </div>
        <p className="text-xs opacity-80 mt-0.5 truncate">{subtitle}</p>
      </div>
    </div>
  );
};
