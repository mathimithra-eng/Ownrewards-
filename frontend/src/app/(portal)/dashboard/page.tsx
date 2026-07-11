"use client";

import React from "react";
import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency, formatPoints, formatDate } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScratchCard from "@/components/ui/ScratchCard";
import {
  Coins, Wallet, ShoppingBag, CalendarClock, AlertCircle,
  ChevronRight, Ticket, Gift, TrendingUp,
} from "lucide-react";

/* ────────────────────────────────────────────────────────
   Clickable KPI card — wraps a stat in a Link
──────────────────────────────────────────────────────── */
function LinkStatCard({
  href,
  label,
  value,
  sub,
  icon,
  accentColor,
  delay = 0,
}: {
  href: string;
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accentColor: string;
  delay?: number;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        className="animate-fade-in-up"
        style={{
          animationDelay: `${delay}ms`,
          background: "var(--bg-surface)",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--radius-lg)",
          padding: "22px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          cursor: "pointer",
          transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "translateY(-3px)";
          el.style.boxShadow = `0 12px 36px ${accentColor}22`;
          el.style.borderColor = `${accentColor}55`;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "";
          el.style.boxShadow = "";
          el.style.borderColor = "var(--glass-border)";
        }}
      >
        {/* Accent glow strip */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accentColor}, transparent)`, borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: `${accentColor}18`, display: "flex", alignItems: "center", justifyContent: "center", color: accentColor }}>
            {icon}
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>

        <div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4 }}>{label}</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{sub}</p>}
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────
   Clickable section header
──────────────────────────────────────────────────────── */
function SectionHeader({ title, href, badge }: { title: string; href?: string; badge?: React.ReactNode }) {
  return (
    <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h3 className="section-title">{title}</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {badge}
        {href && (
          <Link href={href} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)", textDecoration: "none", fontWeight: 600, transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            View All <ChevronRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard();

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
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Failed to load dashboard</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{error}</p>
        <button className="btn btn-ghost" onClick={refetch}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <WelcomeBanner customer={data.summary.customer} />

      {/* ── KPI Metric Cards (each links to relevant page) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginTop: 32 }}>
        <LinkStatCard
          href="/rewards"
          label="Reward Points"
          value={formatPoints(data.summary.customer.points).split(" ")[0]}
          sub="Current balance — click to view history"
          icon={<Coins size={22} />}
          accentColor="var(--gold)"
          delay={100}
        />
        <LinkStatCard
          href="/rewards"
          label="Wallet Balance"
          value={formatCurrency(data.summary.customer.walletBalance)}
          sub="Available for purchase"
          icon={<Wallet size={22} />}
          accentColor="var(--purple)"
          delay={200}
        />
        <LinkStatCard
          href="/purchases"
          label="Total Spend"
          value={formatCurrency(data.summary.metrics.totalSpend)}
          sub={`${data.summary.metrics.totalOrders} total orders`}
          icon={<ShoppingBag size={22} />}
          accentColor="var(--sky)"
          delay={300}
        />
        <LinkStatCard
          href="/purchases"
          label="Avg. Order Value"
          value={formatCurrency(data.summary.metrics.averageOrderValue)}
          sub={`Last visit: ${formatDate(data.summary.metrics.lastVisit)}`}
          icon={<CalendarClock size={22} />}
          accentColor="var(--emerald)"
          delay={400}
        />
      </div>

      {/* ── Main Bottom Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginTop: 40 }} className="dashboard-bottom-grid">

        {/* Recent Activity → links to purchases */}
        <div style={{ animation: "fadeInUp 0.5s var(--ease-smooth) 500ms both" }}>
          <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Recent Activity</h2>
            <Link href="/purchases" style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--sky)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              View Purchases <ChevronRight size={14} />
            </Link>
          </div>
          <RecentActivity activities={data.transactionHistory} />
        </div>

        {/* Right column — cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeInUp 0.5s var(--ease-smooth) 600ms both" }}>

          {/* Active Coupons */}
          <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-sm" style={{ padding: 0, overflow: "hidden" }}>
            <SectionHeader
              title="Active Coupons"
              href="/coupons"
              badge={<Badge variant="active">{data.activeCoupons.length} Active</Badge>}
            />
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {data.activeCoupons.length === 0 ? (
                <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>No active coupons</p>
              ) : (
                data.activeCoupons.map((coupon) => (
                  <Link key={coupon.couponCode} href="/coupons" style={{ textDecoration: "none" }}>
                    <div
                      className="coupon-card"
                      style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "var(--radius-md)", padding: "12px 16px", cursor: "pointer", transition: "background 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(139,92,246,0.14)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(139,92,246,0.08)")}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Ticket size={14} color="var(--gold)" />
                          <ScratchCard width={120} height={24}>
                            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--gold)", letterSpacing: "0.1em" }}>
                              {coupon.couponCode}
                            </span>
                          </ScratchCard>
                        </div>
                        <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 13 }}>{coupon.couponName}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                        Valid until {formatDate(coupon.expiresAt)}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </Card>

          {/* Active Rewards */}
          <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-sm" style={{ padding: 0, overflow: "hidden" }}>
            <SectionHeader title="Active Rewards" href="/rewards" />
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {data.activeRewards.length === 0 ? (
                <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>No active rewards</p>
              ) : (
                data.activeRewards.map((reward, idx) => (
                  <Link key={idx} href="/rewards" style={{ textDecoration: "none" }}>
                    <div
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-md)", padding: "12px 16px", cursor: "pointer", transition: "border-color 0.2s, background 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.06)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.25)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "var(--glass-border)"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Gift size={14} color="var(--purple)" />
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{reward.rewardName}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                        Expires {formatDate(reward.expiresAt)}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </Card>

          {/* Top Products */}
          <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-sm" style={{ padding: 0, overflow: "hidden" }}>
            <SectionHeader title="Your Top Products" href="/purchases" />
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {data.topProducts.length === 0 ? (
                <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>No products found</p>
              ) : (
                data.topProducts.map((product, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: idx < data.topProducts.length - 1 ? "1px solid var(--glass-border)" : "none" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--glass-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <TrendingUp size={14} color="var(--emerald)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>{product.productName}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{product.category}</div>
                      </div>
                    </div>
                    <Badge variant="neutral">{product.orderCount} orders</Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
