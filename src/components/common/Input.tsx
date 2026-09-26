import React, { type InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'light' | 'dark';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, variant = 'light', className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const isDark = variant === 'dark';

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className={`text-xs font-extrabold tracking-wide uppercase ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-slate-400 pointer-events-none z-10 flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full px-4 py-3 text-sm rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:bg-slate-900 focus:border-teal-500 focus:ring-teal-500/20'
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-teal-500/20'
            } ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : ''
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 text-slate-400 z-10 flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-rose-500 mt-0.5">{error}</p>}
        {!error && helperText && <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
