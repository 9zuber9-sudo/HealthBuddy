import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this health data. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 border border-rose-200 bg-rose-50/50 rounded-2xl text-center my-4">
      <div className="p-3 bg-rose-100 rounded-full mb-3 text-rose-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-rose-950">{title}</h4>
      <p className="text-xs text-rose-700 mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
};
