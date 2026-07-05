"use client";

import React, { useState } from "react";
import { useCoupons } from "@/hooks/useCoupons";
import { daysUntil, formatDate } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { AlertCircle, Ticket, Copy, Check, Clock, CalendarCheck, Sparkles, Tag } from "lucide-react";

/* ──────────────────────────────────────────────
   Professional Coupon Card
──────────────────────────────────────────────── */
function CouponCard({
  coupon,
  onCopy,
  copied,
}: {
  coupon: {
    _id: string;
    code: string;
    title: string;
    description: string;
    expiryDate: string;
    status: string;
    usedDate?: string;
  };
  onCopy: (code: string, id: string) => void;
  copied: boolean;
}) {
  const isExpired = coupon.status === "expired" || daysUntil(coupon.expiryDate) < 0;
  const isUsed = coupon.status === "used";
  const isActive = !isExpired && !isUsed;
  const daysLeft = daysUntil(coupon.expiryDate);
  const isExpiringSoon = isActive && daysLeft <= 3 && daysLeft >= 0;

  const accentGradient = isUsed
    ? "linear-gradient(135deg, #1e3a5f 0%, #0f2040 100%)"
    : isExpired
    ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
    : "linear-gradient(135deg, #1e0a3c 0%, #2d1060 100%)";

  const accentColor = isUsed ? "#60a5fa" : isExpired ? "#6b7280" : "#c084fc";
  const codeColor = isUsed ? "#93c5fd" : isExpired ? "#9ca3af" : "#f0b429";

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        background: accentGradient,
        boxShadow: isActive
          ? "0 8px 32px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.07)"
          : "0 4px 16px rgba(0,0,0,0.3)",
        border: `1px solid ${accentColor}33`,
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      className="coupon-pro-card"
    >
      {/* Active shimmer top border */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 3,
            background: "linear-gradient(90deg, #8b5cf6, #f0b429, #8b5cf6)",
            backgroundSize: "200% 100%",
            animation: "shimmerCoupon 3s linear infinite",
          }}
        />
      )}

      {/* Used/Expired stamp */}
      {(isUsed || isExpired) && (
        <div
          style={{
            position: "absolute",
            top: 14, right: 14,
            border: `2px solid ${accentColor}`,
            borderRadius: 6,
            padding: "3px 10px",
            transform: "rotate(-8deg)",
            background: `${accentColor}15`,
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: accentColor,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {isUsed ? "REDEEMED" : "EXPIRED"}
          </span>
        </div>
      )}

      {/* Main content */}
      <div style={{ padding: "22px 24px" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
          {/* Icon badge */}
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Tag size={20} color={accentColor} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              {isActive && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#10b981",
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.25)",
                    borderRadius: 99,
                    padding: "2px 8px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  ● ACTIVE
                </span>
              )}
              {isExpiringSoon && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#f59e0b",
                    background: "rgba(245,158,11,0.12)",
                    border: "1px solid rgba(245,158,11,0.25)",
                    borderRadius: 99,
                    padding: "2px 8px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  ⚡ EXPIRING SOON
                </span>
              )}
            </div>
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "rgba(255,255,255,0.92)",
                marginTop: 5,
                lineHeight: 1.3,
              }}
            >
              {coupon.title}
            </h3>
          </div>
        </div>

        {/* Coupon Code — the hero element */}
        <div
          style={{
            background: "rgba(0,0,0,0.35)",
            border: `1px dashed ${accentColor}55`,
            borderRadius: 10,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            backdropFilter: "blur(4px)",
          }}
        >
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
              Coupon Code
            </p>
            <span
              style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: 22,
                fontWeight: 900,
                color: codeColor,
                letterSpacing: "0.15em",
                textShadow: isActive ? `0 0 20px ${codeColor}55` : "none",
              }}
            >
              {coupon.code}
            </span>
          </div>

          {isActive && (
            <button
              onClick={() => onCopy(coupon.code, coupon._id)}
              title="Copy code"
              style={{
                background: copied ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.08)",
                border: `1px solid ${copied ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.15)"}`,
                borderRadius: 8,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                color: copied ? "#10b981" : "rgba(255,255,255,0.7)",
                fontSize: 12,
                fontWeight: 600,
                transition: "all 0.2s",
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>

        {/* Divider with notches (ticket look) */}
        <div
          style={{
            position: "relative",
            margin: "0 -24px 16px",
            height: 1,
            background: `repeating-linear-gradient(90deg, ${accentColor}30 0, ${accentColor}30 8px, transparent 8px, transparent 14px)`,
          }}
        >
          {/* Left notch */}
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "var(--bg-base, #0a0a14)",
              border: `1px solid ${accentColor}30`,
            }}
          />
          {/* Right notch */}
          <div
            style={{
              position: "absolute",
              right: -10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "var(--bg-base, #0a0a14)",
              border: `1px solid ${accentColor}30`,
            }}
          />
        </div>

        {/* Footer row — validity dates */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={13} color="rgba(255,255,255,0.35)" />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
              {isUsed
                ? `Used on ${formatDate(coupon.usedDate || coupon.expiryDate)}`
                : isExpired
                ? `Expired ${formatDate(coupon.expiryDate)}`
                : isExpiringSoon
                ? (
                  <span style={{ color: "#f59e0b", fontWeight: 700 }}>
                    Expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}!
                  </span>
                )
                : `Valid until ${formatDate(coupon.expiryDate)}`
              }
            </span>
          </div>

          {isActive && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CalendarCheck size={13} color="rgba(16,185,129,0.7)" />
              <span style={{ fontSize: 11, color: "rgba(16,185,129,0.7)", fontWeight: 600 }}>
                Ready to use
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Coupons Page
──────────────────────────────────────────────── */
export default function CouponsPage() {
  const { data, loading, error, refetch } = useCoupons();
  const [filter, setFilter] = useState<"all" | "active" | "used" | "expired">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (loading) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
        <AlertCircle size={48} color="var(--rose)" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Failed to load coupons</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{error}</p>
        <button className="btn btn-ghost" onClick={refetch}>Try Again</button>
      </div>
    );
  }

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCoupons = data.coupons.filter((c) => {
    if (filter === "all") return true;
    if (filter === "active") return c.status === "active" && daysUntil(c.expiryDate) >= 0;
    if (filter === "used") return c.status === "used";
    if (filter === "expired") return c.status === "expired" || daysUntil(c.expiryDate) < 0;
    return true;
  });

  const activeCount = data.coupons.filter(c => c.status === "active" && daysUntil(c.expiryDate) >= 0).length;
  const usedCount = data.coupons.filter(c => c.status === "used").length;
  const expiredCount = data.coupons.filter(c => c.status === "expired" || daysUntil(c.expiryDate) < 0).length;

  return (
    <div className="page-container animate-fade-in">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmerCoupon {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .coupon-pro-card {
            transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s ease;
          }
          .coupon-pro-card:hover {
            transform: translateY(-4px);
          }
        `
      }} />

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ticket size={20} color="#c084fc" />
          </div>
          <h1 className="page-title" style={{ margin: 0 }}>My Coupons</h1>
        </div>
        <p style={{ color: "var(--text-muted)", marginLeft: 52 }}>
          Your exclusive discount codes and cashback offers.
        </p>
      </div>

      {/* ── Summary Pills ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
        {[
          { label: "Active", count: activeCount, color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
          { label: "Used", count: usedCount, color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)" },
          { label: "Expired", count: expiredCount, color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.2)" },
        ].map(({ label, count, color, bg, border }) => (
          <div
            key={label}
            style={{
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: 99,
              padding: "7px 18px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
            <span style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{count}</span>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs ── */}
      <div
        style={{
          display: "flex",
          gap: 4,
          background: "rgba(255,255,255,0.04)",
          padding: 4,
          borderRadius: 12,
          border: "1px solid var(--glass-border)",
          marginBottom: 32,
          width: "fit-content",
        }}
      >
        {([
          { key: "all", label: "All", emoji: "" },
          { key: "active", label: "Active", emoji: "🎟️" },
          { key: "used", label: "Used", emoji: "✅" },
          { key: "expired", label: "Expired", emoji: "⏰" },
        ] as const).map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              background: filter === key ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "transparent",
              color: filter === key ? "#fff" : "var(--text-muted)",
              fontWeight: filter === key ? 700 : 500,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: 13,
              boxShadow: filter === key ? "0 4px 12px rgba(139,92,246,0.35)" : "none",
            }}
          >
            {emoji && <span style={{ marginRight: 5 }}>{emoji}</span>}
            {label}
          </button>
        ))}
      </div>

      {/* ── Coupon Grid ── */}
      {filteredCoupons.length === 0 ? (
        <div
          style={{
            padding: "60px 24px",
            textAlign: "center",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 16,
            border: "1px dashed var(--glass-border)",
          }}
        >
          <Sparkles size={40} color="var(--text-muted)" style={{ margin: "0 auto 16px", opacity: 0.4 }} />
          <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>
            No {filter !== "all" ? filter : ""} coupons found
          </h3>
          <p style={{ color: "var(--text-muted)" }}>Check back later for more exciting offers.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {filteredCoupons.map((coupon, idx) => (
            <div
              key={coupon._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <CouponCard
                coupon={coupon}
                onCopy={handleCopy}
                copied={copiedId === coupon._id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
