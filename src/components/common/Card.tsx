import React, { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'flat' | 'gradient' | 'bordered';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'md',
  variant = 'default',
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variants = {
    default: 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs text-slate-900 dark:text-slate-100',
    flat: 'bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 text-slate-900 dark:text-slate-100',
    gradient: 'bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-xs text-slate-900 dark:text-slate-100',
    bordered: 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100',
  };

  const hoverClass = hoverable
    ? 'cursor-pointer hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl transition-all duration-200 ${variants[variant]} ${paddings[padding]} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};
