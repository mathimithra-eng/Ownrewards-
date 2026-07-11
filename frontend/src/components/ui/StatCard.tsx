"use client";

import React from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accentColor?: string;
  delay?: number;
}

export default function StatCard({
  label,
  value,
  sub,
  icon,
  accentColor = "var(--gold)",
  delay = 0,
}: StatCardProps) {
  return (
    <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-sm animate-fade-in-up"
      style={{
        padding: "20px 24px",
        animationDelay: `${delay}ms`,
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "12px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {value}
          </p>
          {sub && (
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "12px",
                marginTop: 4,
              }}
            >
              {sub}
            </p>
          )}
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-md)",
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accentColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
