import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'default';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    const baseClass = 'font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClass = {
      primary: 'bg-accent hover:bg-accent-hover text-white',
      secondary: 'bg-bg-surface hover:bg-bg-hover text-text-primary border border-border',
      danger: 'bg-danger hover:bg-red-600 text-white',
      success: 'bg-success hover:bg-green-600 text-white',
      outline: 'bg-transparent hover:bg-bg-surface text-text-primary border border-border',
      default: 'bg-bg-surface hover:bg-bg-hover text-text-primary',
    }[variant];

    const sizeClass = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2 text-base',
    }[size];

    return (
      <button
        ref={ref}
        className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export default Button;
