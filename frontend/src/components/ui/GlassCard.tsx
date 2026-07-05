"use client";

import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  gold?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function GlassCard({
  children,
  className = "",
  gold = false,
  onClick,
  style,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`${gold ? "glass-gold" : "glass"} ${className}`}
      style={{
        borderRadius: "var(--radius-lg)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
