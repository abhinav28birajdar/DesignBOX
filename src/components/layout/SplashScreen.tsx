import { useState, useEffect } from "react";

interface SplashScreenProps {
  visible: boolean;
}

export default function SplashScreen({ visible }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(visible);
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      setIsVisible(true);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-out",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <img src="/designbox-logo.svg" alt="DesignBox" className="h-12 w-12 rounded-md" />
        <div className="text-xl font-semibold text-indigo-300">DesignBox</div>
        <div className="text-xs tracking-wide text-slate-400">Design Without Limits</div>
      </div>
    </div>
  );
}
