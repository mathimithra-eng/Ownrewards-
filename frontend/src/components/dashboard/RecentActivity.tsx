"use client";

import React from "react";
import { Gift, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { timeAgo, formatCurrency } from "@/lib/utils";
import type { Dashboard } from "@/types";

export default function RecentActivity({ activities }: { activities: Dashboard["transactionHistory"] }) {
  if (!activities || activities.length === 0) {
    return (
      <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-sm" style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
        No recent activity
      </Card>
    );
  }

  return (
    <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-sm" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--glass-border)" }}>
        <h3 className="section-title">Recent Activity</h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {activities.map((item, idx) => {
          const isPurchase = item.type === "bill_created";
          const Icon = isPurchase ? ShoppingBag : Gift;
          const isEarned = !isPurchase && item.pointsImpact.includes("+");
          
          let iconBg = "rgba(255,255,255,0.05)";
          let iconColor = "var(--text-secondary)";
          
          if (isPurchase) {
            iconBg = "var(--sky-dim)";
            iconColor = "var(--sky)";
          } else if (isEarned) {
            iconBg = "var(--emerald-dim)";
            iconColor = "var(--emerald)";
          } else {
            iconBg = "var(--gold-dim)";
            iconColor = "var(--gold)";
          }

          return (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 24px",
                borderBottom: idx < activities.length - 1 ? "1px solid var(--glass-border)" : "none",
                transition: "background 0.2s",
              }}
              className="hover:bg-[rgba(255,255,255,0.02)]"
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-md)",
                  background: iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: iconColor,
                }}
              >
                <Icon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>{item.title}</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                  {item.description} • {timeAgo(item.createdAt)}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                {item.billAmount && (
                  <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 15 }}>
                    {formatCurrency(item.billAmount)}
                  </div>
                )}
                {item.pointsImpact !== "0" && (
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      marginTop: 2,
                      color: isEarned ? "var(--emerald)" : "var(--gold)",
                    }}
                  >
                    {item.pointsImpact} pts
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
