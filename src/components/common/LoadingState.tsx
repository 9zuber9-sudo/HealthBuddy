import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  type?: 'full' | 'inline' | 'skeleton';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading health data...',
  type = 'inline',
}) => {
  if (type === 'full') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] w-full p-8 text-center">
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 mb-4 animate-pulse">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800">{message}</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">Connecting to secure medical data services...</p>
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className="space-y-4 w-full animate-pulse">
        <div className="h-6 bg-slate-200 rounded-lg w-1/3"></div>
        <div className="h-24 bg-slate-100 rounded-2xl border border-slate-200 w-full"></div>
        <div className="h-24 bg-slate-100 rounded-2xl border border-slate-200 w-full"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 py-6 px-4 text-slate-500 text-sm">
      <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
      <span>{message}</span>
    </div>
  );
};
