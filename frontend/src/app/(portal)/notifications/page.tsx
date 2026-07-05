"use client";

import React from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { timeAgo } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import {
  AlertCircle,
  Bell,
  CheckCheck,
  Gift,
  Ticket,
  Sparkles,
  ShoppingBag,
  Info,
  Percent,
  Clock,
  Tag,
  TrendingUp,
  Star,
} from "lucide-react";

/* ── Type-specific offer detail panel ── */
function OfferDetailBanner({ type, title, message }: { type: string; title: string; message: string }) {
  if (type === "offer") {
    // Extract discount number from message if present
    const discountMatch = message.match(/(\d+)%/);
    const discount = discountMatch ? discountMatch[1] : null;
    return (
      <div style={{
        marginTop: 14,
        borderRadius: 12,
        overflow: "hidden",
        background: "linear-gradient(135deg, #1a0533, #2d0f4e)",
        border: "1px solid rgba(192,132,252,0.3)",
        position: "relative",
      }}>
        {/* Shimmer accent bar */}
        <div style={{ height: 3, background: "linear-gradient(90deg,#f97316,#ec4899,#8b5cf6)", backgroundSize: "200% 100%", animation: "shimmerOffer 2s linear infinite" }} />
        <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg,#f97316,#ec4899)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Percent size={24} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: "rgba(192,132,252,0.8)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
              🎯 Exclusive Offer
            </p>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{title}</p>
            {discount && (
              <p style={{ fontSize: 22, fontWeight: 900, color: "#f97316", marginTop: 6 }}>
                {discount}% <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>OFF</span>
              </p>
            )}
          </div>
          <div style={{
            background: "rgba(249,115,22,0.15)",
            border: "1px solid rgba(249,115,22,0.4)",
            borderRadius: 8, padding: "6px 12px",
          }}>
            <TrendingUp size={18} color="#f97316" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "coupon") {
    const codeMatch = message.match(/[A-Z0-9]{4,}/);
    const code = codeMatch ? codeMatch[0] : null;
    return (
      <div style={{
        marginTop: 14,
        borderRadius: 12,
        background: "linear-gradient(135deg, #0a2010, #0d3320)",
        border: "1px dashed rgba(16,185,129,0.4)",
        padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "linear-gradient(135deg,#10b981,#34d399)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Ticket size={24} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: 11, color: "rgba(52,211,153,0.8)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
            🎟️ Coupon Available
          </p>
          {code && (
            <p style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 800, color: "#10b981", letterSpacing: "0.12em", background: "rgba(16,185,129,0.1)", padding: "4px 10px", borderRadius: 6, display: "inline-block" }}>
              {code}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (type === "reward") {
    const pointsMatch = message.match(/(\d+)\s*points?/i);
    const points = pointsMatch ? pointsMatch[1] : null;
    return (
      <div style={{
        marginTop: 14,
        borderRadius: 12,
        background: "linear-gradient(135deg, #1a1200, #2d2000)",
        border: "1px solid rgba(251,191,36,0.3)",
        padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Star size={24} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: 11, color: "rgba(251,191,36,0.8)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
            ⭐ Reward Points
          </p>
          {points && (
            <p style={{ fontSize: 26, fontWeight: 900, color: "#fbbf24" }}>
              +{points} <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>pts</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  if (type === "purchase") {
    const amountMatch = message.match(/₹([\d,]+)/);
    const amount = amountMatch ? amountMatch[1] : null;
    return (
      <div style={{
        marginTop: 14,
        borderRadius: 12,
        background: "linear-gradient(135deg, #0a1020, #0d1835)",
        border: "1px solid rgba(59,130,246,0.3)",
        padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "linear-gradient(135deg,#3b82f6,#60a5fa)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <ShoppingBag size={24} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: 11, color: "rgba(96,165,250,0.8)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
            🛒 Purchase Confirmed
          </p>
          {amount && (
            <p style={{ fontSize: 24, fontWeight: 900, color: "#60a5fa" }}>₹{amount}</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

/* ── Icon with glow ── */
function NotifIcon({ type }: { type: string }) {
  const cfg: Record<string, { icon: React.ReactNode; gradient: string; glow: string }> = {
    offer: { icon: <Sparkles size={20} />, gradient: "linear-gradient(135deg,#f97316,#ec4899)", glow: "rgba(249,115,22,0.4)" },
    coupon: { icon: <Ticket size={20} />, gradient: "linear-gradient(135deg,#10b981,#34d399)", glow: "rgba(16,185,129,0.4)" },
    reward: { icon: <Gift size={20} />, gradient: "linear-gradient(135deg,#f59e0b,#fbbf24)", glow: "rgba(251,191,36,0.4)" },
    purchase: { icon: <ShoppingBag size={20} />, gradient: "linear-gradient(135deg,#3b82f6,#60a5fa)", glow: "rgba(59,130,246,0.4)" },
    system: { icon: <Info size={20} />, gradient: "linear-gradient(135deg,#6b7280,#9ca3af)", glow: "rgba(107,114,128,0.4)" },
  };
  const c = cfg[type] || cfg.system;
  return (
    <div style={{
      width: 46, height: 46, borderRadius: "50%",
      background: c.gradient,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff",
      boxShadow: `0 4px 16px ${c.glow}`,
      flexShrink: 0,
    }}>
      {c.icon}
    </div>
  );
}

export default function NotificationsPage() {
  const { data, loading, error, refetch, markRead, markAllRead } = useNotifications();

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
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Failed to load notifications</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{error}</p>
        <button className="btn btn-ghost" onClick={refetch}>Try Again</button>
      </div>
    );
  }

  const offerNotifs = data.notifications.filter((n) => n.type === "offer");
  const otherNotifs = data.notifications.filter((n) => n.type !== "offer");

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: 860 }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmerOffer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
          .notif-card { transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer; }
          .notif-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.15); }
        `
      }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            Notifications
            {data.summary.unread > 0 && (
              <Badge variant="gold">{data.summary.unread} New</Badge>
            )}
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: 14 }}>
            Stay updated on offers, rewards & purchases.
          </p>
        </div>
        {data.summary.unread > 0 && (
          <button
            onClick={markAllRead}
            style={{ fontSize: 13, padding: "8px 16px", display: "flex", alignItems: "center", gap: 6, borderRadius: "var(--radius-full)", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)", cursor: "pointer" }}
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {data.notifications.length === 0 ? (
        <GlassCard style={{ padding: 60, textAlign: "center" }}>
          <Bell size={48} color="var(--text-muted)" style={{ margin: "0 auto 16px", opacity: 0.5 }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>All caught up!</h3>
          <p style={{ color: "var(--text-muted)" }}>You have no notifications at this time.</p>
        </GlassCard>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

          {/* ── Offer Notifications Section ── */}
          {offerNotifs.length > 0 && (
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Sparkles size={16} color="var(--gold)" />
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  🔥 Today's Exclusive Offers
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 16 }}>
                {offerNotifs.map((notif, idx) => {
                  const isUnread = !notif.read;
                  return (
                    <div
                      key={notif._id}
                      className="notif-card animate-fade-in-up"
                      onClick={() => { if (isUnread) markRead(notif._id); }}
                      style={{
                        background: isUnread
                          ? "linear-gradient(135deg, rgba(30,15,60,0.95), rgba(20,10,40,0.98))"
                          : "var(--glass-bg)",
                        border: isUnread ? "1px solid rgba(192,132,252,0.3)" : "1px solid var(--glass-border)",
                        borderRadius: "var(--radius-lg)",
                        padding: 20,
                        animationDelay: `${idx * 60}ms`,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {isUnread && (
                        <div style={{ position: "absolute", top: 12, right: 12, width: 10, height: 10, background: "var(--gold)", borderRadius: "50%", boxShadow: "0 0 8px var(--gold)" }} />
                      )}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                        <NotifIcon type={notif.type} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <h3 style={{ fontSize: 15, fontWeight: isUnread ? 700 : 500, color: isUnread ? "var(--text-primary)" : "var(--text-secondary)", lineHeight: 1.4 }}>
                              {notif.title}
                            </h3>
                          </div>
                          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5 }}>{notif.message}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                            <Clock size={12} color="var(--text-muted)" />
                            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{timeAgo(notif.date)}</span>
                          </div>
                        </div>
                      </div>
                      <OfferDetailBanner type={notif.type} title={notif.title} message={notif.message} />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Other Notifications ── */}
          {otherNotifs.length > 0 && (
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Tag size={16} color="var(--text-secondary)" />
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Recent Activity
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {otherNotifs.map((notif, idx) => {
                  const isUnread = !notif.read;
                  return (
                    <GlassCard
                      key={notif._id}
                      onClick={() => { if (isUnread) markRead(notif._id); }}
                      className={`notif-card animate-fade-in-up`}
                      style={{
                        padding: "16px 20px",
                        animationDelay: `${idx * 50}ms`,
                        background: isUnread ? "rgba(255,255,255,0.07)" : "var(--glass-bg)",
                        border: isUnread ? "1px solid rgba(255,255,255,0.14)" : "1px solid var(--glass-border)",
                        display: "flex", gap: 14, alignItems: "flex-start",
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <NotifIcon type={notif.type} />
                        {isUnread && (
                          <div style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, background: "var(--gold)", borderRadius: "50%", border: "2px solid var(--bg-surface)", boxShadow: "0 0 6px var(--gold)" }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                          <h3 style={{ fontSize: 14, fontWeight: isUnread ? 700 : 500, color: isUnread ? "var(--text-primary)" : "var(--text-secondary)" }}>
                            {notif.title}
                          </h3>
                          <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", marginLeft: 12, display: "flex", alignItems: "center", gap: 4 }}>
                            <Clock size={10} /> {timeAgo(notif.date)}
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{notif.message}</p>
                        <OfferDetailBanner type={notif.type} title={notif.title} message={notif.message} />
                        <div style={{ marginTop: 10 }}>
                          <Badge variant={notif.type as "reward" | "coupon" | "offer" | "purchase" | "system"}>{notif.type}</Badge>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
