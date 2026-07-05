"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = 40,
  color = "var(--gold)",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: `3px solid ${color}30`,
        borderTop: `3px solid ${color}`,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}
