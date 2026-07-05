"use client";

import React from "react";
import { formatPoints, formatDate } from "@/lib/utils";
import Badge from "../ui/Badge";
import type { Reward } from "@/types";

export default function RewardTimeline({ transactions }: { transactions: Reward[] }) {
  if (!transactions || transactions.length === 0) return null;

  return (
    <div style={{ position: "relative", paddingLeft: 20 }}>
      {/* Vertical line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 2,
          background: "var(--glass-border)",
        }}
      />

      {transactions.map((tx, idx) => {
        const isEarned = tx.type === "earned";
        const isLast = idx === transactions.length - 1;

        return (
          <div
            key={tx._id}
            style={{
              position: "relative",
              paddingBottom: isLast ? 0 : 32,
              paddingLeft: 24,
            }}
          >
            {/* Timeline Dot */}
            <div
              style={{
                position: "absolute",
                left: -25,
                top: 4,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: isEarned ? "var(--emerald)" : "var(--gold)",
                border: "2px solid var(--bg-surface)",
                boxShadow: `0 0 0 4px ${isEarned ? "rgba(16,185,129,0.15)" : "rgba(240,180,41,0.15)"}`,
              }}
            />

            <div
              className="glass hover:bg-[rgba(255,255,255,0.06)] transition-colors"
              style={{
                padding: "16px 20px",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                    {tx.description}
                  </h4>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                    {tx.source} • {formatDate(tx.date)}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: isEarned ? "var(--emerald)" : "var(--gold)",
                    }}
                  >
                    {isEarned ? "+" : "-"}{formatPoints(tx.points)}
                  </span>
                  <div style={{ marginTop: 4 }}>
                    <Badge variant={isEarned ? "earned" : "redeemed"}>{tx.type}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
