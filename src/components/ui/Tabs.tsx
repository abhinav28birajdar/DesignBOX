import React, { useState } from 'react';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const current = value !== undefined ? value : activeTab;
  
  const handleChange = (newValue: string) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    onValueChange?.(newValue);
  };
  
  return (
    <div className={className}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child as React.ReactElement, { activeTab: current, setActiveTab: handleChange })
      )}
    </div>
  );
}

interface TabsListProps {
  children?: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return <div className={className || "flex gap-2 mb-3 border-b border-border"}>{children}</div>;
}

interface TabsTriggerProps {
  value: string;
  children?: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  className?: string;
}

export function TabsTrigger({ value, children, activeTab, setActiveTab, className }: TabsTriggerProps) {
  const baseClass = className ? `${className}` : `px-3 py-2 text-sm font-medium border-b-2 transition`;
  return (
    <button
      onClick={() => setActiveTab?.(value)}
      className={activeTab === value
        ? `${baseClass} border-accent text-accent`
        : `${baseClass} border-transparent text-text-secondary hover:text-text-primary`}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children?: React.ReactNode;
  activeTab?: string;
  className?: string;
}

export function TabsContent({ value, children, activeTab, className }: TabsContentProps) {
  if (activeTab !== value) return null;
  return <div className={className}>{children}</div>;
}
