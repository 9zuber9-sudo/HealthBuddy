import React from 'react';
import { Pill, FileText, CalendarCheck, ShieldAlert, Activity } from 'lucide-react';
import type { ActivityLog } from '../../types';

interface TimelineProps {
  activities: ActivityLog[];
}

export const Timeline: React.FC<TimelineProps> = ({ activities }) => {
  const getIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'medicine':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'prescription':
        return <FileText className="w-4 h-4 text-sky-600" />;
      case 'appointment':
        return <CalendarCheck className="w-4 h-4 text-purple-600" />;
      case 'record':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'emergency':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {activities.map((act) => (
        <div key={act.id} className="relative flex items-start gap-4 group">
          <div
            className={`absolute -left-6 top-1 w-5 h-5 rounded-full border flex items-center justify-center bg-white shadow-xs z-10`}
          >
            <div className="scale-75">{getIcon(act.type)}</div>
          </div>
          <div className="flex-1 bg-slate-50/70 group-hover:bg-slate-50 p-4 rounded-xl border border-slate-200/80 transition-colors">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h5 className="text-sm font-semibold text-slate-900">{act.title}</h5>
              <span className="text-[11px] font-medium text-slate-400">{act.timestamp}</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{act.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
