"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Dashboard } from "@/types";

export default function WelcomeBanner({ customer }: { customer: Dashboard["summary"]["customer"] }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getTierStyles = (tier: string) => {
    const t = tier.toLowerCase();
    if (t === 'silver') {
      return {
        filter: "grayscale(100%) brightness(1.2) contrast(1.1)",
        shadow: "drop-shadow(0 8px 20px rgba(148,163,184,0.4))"
      };
    }
    if (t === 'bronze') {
      return {
        filter: "sepia(100%) hue-rotate(345deg) saturate(150%) brightness(0.65)",
        shadow: "drop-shadow(0 8px 20px rgba(180,83,9,0.4))"
      };
    }
    if (t === 'platinum') {
      return {
        filter: "grayscale(100%) brightness(1.5) contrast(1.2) hue-rotate(180deg)",
        shadow: "drop-shadow(0 8px 20px rgba(226,232,240,0.5))"
      };
    }
    // Default Gold
    return {
      filter: "none",
      shadow: "drop-shadow(0 8px 20px rgba(234,179,8,0.4))"
    };
  };

  const tierStyles = getTierStyles(customer.tier);

  return (
    <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-sm animate-fade-in-up"
      style={{
        padding: "28px 36px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        gap: 20,
      }}
    >
      {/* Background orbs */}
      <div className="orb orb-gold" style={{ width: 300, height: 300, top: -150, right: -50 }} />
      <div className="orb orb-purple" style={{ width: 200, height: 200, bottom: -100, right: 150 }} />

      {/* Left: Greeting text */}
      <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", fontWeight: 500 }}>
            {getGreeting()},
          </p>
          <Badge variant={customer.tier.toLowerCase() as "gold" | "silver" | "platinum"}>
            {customer.tier} Member
          </Badge>
        </div>
        <h1
          style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
          }}
        >
          {customer.name}
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: 13 }}>
          Phone: <span style={{ color: "var(--text-secondary)" }}>{customer.phoneNo}</span>
        </p>
      </div>

      {/* Right: Tier Coupon badge */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
          width: "clamp(90px, 14vw, 140px)",
          animation: "float 4s ease-in-out infinite",
          filter: tierStyles.shadow,
        }}
      >
        <img
          src="/images/offers/flipkart.png"
          alt={`${customer.tier} Tier Coupon`}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            borderRadius: 12,
            filter: tierStyles.filter,
            transition: "filter 0.5s ease"
          }}
        />
      </div>
    </Card>
  );
}
