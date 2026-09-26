import React, { type InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && <span className="absolute left-3.5 text-slate-400 pointer-events-none">{leftIcon}</span>}
          <input
            id={inputId}
            ref={ref}
            className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:ring-teal-100'
            } ${className}`}
            {...props}
          />
          {rightIcon && <span className="absolute right-3.5 text-slate-400 pointer-events-none">{rightIcon}</span>}
        </div>
        {error && <p className="text-xs text-rose-600 mt-0.5">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
