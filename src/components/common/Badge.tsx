import React from 'react';

export type BadgeVariant = 
  | 'monitor' 
  | 'consult' 
  | 'emergency' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info' 
  | 'neutral' 
  | 'teal';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variants = {
    monitor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    consult: 'bg-amber-50 text-amber-700 border-amber-200/80',
    emergency: 'bg-rose-50 text-rose-700 border-rose-200/80 font-semibold animate-pulse-subtle',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    info: 'bg-sky-50 text-sky-700 border-sky-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
  };

  const dotColors = {
    monitor: 'bg-emerald-500',
    consult: 'bg-amber-500',
    emergency: 'bg-rose-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    neutral: 'bg-slate-400',
    teal: 'bg-teal-500',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 rounded-xl gap-2 font-medium',
  };

  return (
    <span className={`inline-flex items-center border ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
