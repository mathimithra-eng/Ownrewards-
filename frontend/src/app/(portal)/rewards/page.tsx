"use client";

import React from "react";
import { useRewards } from "@/hooks/useRewards";
import { formatPoints } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatCard from "@/components/ui/StatCard";
import RewardChart from "@/components/rewards/RewardChart";
import RewardTimeline from "@/components/rewards/RewardTimeline";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { AlertCircle, Coins, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function RewardsPage() {
  const { data, loading, error, refetch } = useRewards();

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
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Failed to load rewards</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{error}</p>
        <button className="btn btn-ghost" onClick={refetch}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Rewards History</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 4 }}>Track your points, earnings, and redemptions.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 32 }}>
        <StatCard
          label="Current Balance"
          value={formatPoints(data.summary.currentBalance)}
          icon={<Coins size={28} />}
          accentColor="var(--gold)"
          delay={0}
        />
        <StatCard
          label="Total Earned"
          value={formatPoints(data.summary.totalEarned)}
          icon={<ArrowUpRight size={28} />}
          accentColor="var(--emerald)"
          delay={100}
        />
        <StatCard
          label="Total Redeemed"
          value={formatPoints(data.summary.totalRedeemed)}
          icon={<ArrowDownRight size={28} />}
          accentColor="var(--purple)"
          delay={200}
        />
      </div>

      {/* Chart + Timeline row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(0,380px)", gap: 24 }} className="rewards-chart-grid">
          <RewardChart data={data.chartData} />
          <div>
            <h3 className="section-title" style={{ marginBottom: 16 }}>Recent Transactions</h3>
            <RewardTimeline transactions={data.transactions} />
          </div>
        </div>

        {/* Full Transaction History from API */}
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>Transaction History</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>All your reward and bill transactions in one place.</p>
          </div>
          <RecentActivity activities={data.transactionHistory} />
        </div>
      </div>
    </div>
  );
}
