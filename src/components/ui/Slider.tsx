import React from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number | number[];
  onChange?: (value: number | number[]) => void;
  className?: string;
  [key: string]: any;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ value, onChange, className = '', ...props }, ref) => {
    const numValue = Array.isArray(value) ? value[0] : value;
    return (
      <input
        ref={ref}
        type="range"
        value={numValue}
        onChange={(e) => onChange?.(parseFloat(e.target.value))}
        className={`w-full h-1 bg-bg-surface rounded-lg appearance-none cursor-pointer accent-accent ${className}`}
        {...props}
      />
    );
  }
);

Slider.displayName = 'Slider';
export default Slider;
