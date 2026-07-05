"use client";

import React, { useState } from "react";
import GlassCard from "../ui/GlassCard";
import type { RewardChartData } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(15,10,30,0.96)",
      border: "1px solid rgba(139,92,246,0.35)",
      borderRadius: 10,
      padding: "12px 18px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      minWidth: 160,
    }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(192,132,252,0.9)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </p>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 6, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, boxShadow: `0 0 6px ${p.color}` }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              {p.dataKey === "earned" ? "Earned" : "Redeemed"}
            </span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: p.color }}>{p.value} pts</span>
        </div>
      ))}
    </div>
  );
}

/* ── Strike-Rate Radial Gauge ── */
function StrikeRateGauge({ totalEarned, totalRedeemed }: { totalEarned: number; totalRedeemed: number }) {
  const strikeRate = totalEarned > 0 ? Math.round((totalRedeemed / totalEarned) * 100) : 0;
  const color = strikeRate >= 70 ? "#10b981" : strikeRate >= 40 ? "#f59e0b" : "#8b5cf6";
  const label = strikeRate >= 70 ? "🔥 Excellent" : strikeRate >= 40 ? "⚡ Good" : "🌱 Growing";

  const radialData = [{ name: "Strike Rate", value: strikeRate, fill: color }];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ position: "relative", width: 200, height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="60%"
            outerRadius="88%"
            startAngle={220}
            endAngle={-40}
            data={radialData}
            barSize={18}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: "rgba(255,255,255,0.06)" }}
              dataKey="value"
              angleAxisId={0}
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Centre label */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 36, fontWeight: 900, color, lineHeight: 1 }}>{strikeRate}%</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.06em", marginTop: 4 }}>STRIKE RATE</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 280 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "var(--text-muted)" }}>Total Earned</span>
          <span style={{ fontWeight: 800, color: "#10b981" }}>{totalEarned.toLocaleString()} pts</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "var(--text-muted)" }}>Total Redeemed</span>
          <span style={{ fontWeight: 800, color: "#8b5cf6" }}>{totalRedeemed.toLocaleString()} pts</span>
        </div>
        <div style={{ height: 1, background: "var(--glass-border)", margin: "4px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <span style={{ color: "var(--text-muted)" }}>Utilisation</span>
          <span style={{ fontWeight: 700, color }}>{label}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Custom Dot ── */
function CustomDot(props: any) {
  const { cx, cy, stroke } = props;
  return (
    <circle cx={cx} cy={cy} r={5} fill={stroke} stroke="rgba(15,10,30,0.8)" strokeWidth={2} />
  );
}

function CustomActiveDot(props: any) {
  const { cx, cy, stroke } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={stroke} opacity={0.15} />
      <circle cx={cx} cy={cy} r={6} fill={stroke} stroke="rgba(15,10,30,0.9)" strokeWidth={2} />
    </g>
  );
}

export default function RewardChart({ data: rawData }: { data: RewardChartData[] }) {
  const [view, setView] = useState<"trend" | "strike">("trend");

  if (!rawData || rawData.length === 0) return null;

  // Sort ascending by earned to show upward trend
  const sorted = [...rawData].sort((a, b) => a.earned - b.earned);

  // Ensure we always have at least 2 points so a line can render
  const data: RewardChartData[] = sorted.length < 2
    ? [{ month: "Start", earned: 0, redeemed: 0 }, ...sorted]
    : sorted;

  const totalEarned = data.reduce((s, d) => s + d.earned, 0);
  const totalRedeemed = data.reduce((s, d) => s + d.redeemed, 0);
  const avgEarned = Math.round(totalEarned / (data.length || 1));

  return (
    <GlassCard style={{ padding: "24px 28px" }}>
      {/* Header with toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h3 className="section-title">Points Overview</h3>
        <div style={{ display: "flex", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 8, padding: 3, gap: 2 }}>
          {(["trend", "strike"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                background: view === v ? "var(--gold)" : "transparent",
                color: view === v ? "#fff" : "var(--text-muted)",
                transition: "all 0.2s",
              }}
            >
              {v === "trend" ? "📈 Trend" : "🎯 Strike Rate"}
            </button>
          ))}
        </div>
      </div>

      {view === "trend" ? (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <filter id="glow-green-line">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-purple-line">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="rgba(255,255,255,0.07)"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--text-muted)", fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                dx={-8}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 16, fontSize: 12 }}
                formatter={(value) => (
                  <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>
                    {value === "earned" ? "Earned" : "Redeemed"}
                  </span>
                )}
              />
              <ReferenceLine y={avgEarned} stroke="rgba(251,191,36,0.3)" strokeDasharray="3 3" label={{ value: "avg", fill: "rgba(251,191,36,0.6)", fontSize: 10 }} />

              {/* Earned line — solid, green glow */}
              <Line
                type="monotone"
                dataKey="earned"
                stroke="#10b981"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={<CustomActiveDot />}
                filter="url(#glow-green-line)"
              />

              {/* Redeemed line — dashed, purple glow */}
              <Line
                type="monotone"
                dataKey="redeemed"
                stroke="#8b5cf6"
                strokeWidth={3}
                strokeDasharray="6 3"
                dot={<CustomDot />}
                activeDot={<CustomActiveDot />}
                filter="url(#glow-purple-line)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <StrikeRateGauge totalEarned={totalEarned} totalRedeemed={totalRedeemed} />
      )}
    </GlassCard>
  );
}
