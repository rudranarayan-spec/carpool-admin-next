import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div className={`glass-panel rounded-2xl p-5 shadow-glass transition-all duration-200 hover:border-velocity-purple/30 ${className}`}>
      {children}
    </div>
  );
}