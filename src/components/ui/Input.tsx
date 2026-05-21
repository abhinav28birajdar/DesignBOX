import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="text-xs font-medium text-text-secondary block mb-1">{label}</label>}
        <input
          ref={ref}
          className={`w-full px-3 py-2 bg-bg-surface border border-border rounded text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent ${error ? 'border-danger' : ''} ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-danger mt-1 block">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
