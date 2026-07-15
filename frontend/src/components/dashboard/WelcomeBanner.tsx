"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { Dashboard } from "@/types";

export default function WelcomeBanner({ customer }: { customer: Dashboard["summary"]["customer"] }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getTierStyles = (tier: string) => {
    const t = (tier || "Member").toLowerCase();
    
    const base = {
      textColor: "#ffffff",
      textMuted: "rgba(255, 255, 255, 0.85)",
      overlay: "rgba(0, 0, 0, 0.65)",
    };

    if (t === 'silver') {
      return {
        ...base,
        tintColor: "#C0C0C0", // Accurate Silver
        badgeClass: "badge-silver",
        borderAccent: "rgba(192, 192, 192, 0.5)",
      };
    }
    if (t === 'bronze') {
      return {
        ...base,
        tintColor: "#CD7F32", // Accurate Bronze
        badgeClass: "badge-bronze",
        borderAccent: "rgba(205, 127, 50, 0.5)",
      };
    }
    if (t === 'platinum') {
      return {
        ...base,
        tintColor: "#E5E4E2", // Accurate Platinum
        badgeClass: "badge-platinum",
        borderAccent: "rgba(229, 228, 226, 0.5)",
      };
    }
    // Default Gold
    return {
      ...base,
      tintColor: "#FFD700", // Accurate Gold
      badgeClass: "badge-gold",
      borderAccent: "rgba(255, 215, 0, 0.5)",
    };
  };

  const tierStyles = getTierStyles(customer.tier);

  return (
    <Card className="shadow-sm animate-fade-in-up"
      style={{
        padding: "28px 36px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        borderColor: tierStyles.borderAccent,
        minHeight: "160px",
      }}
    >
      {/* Background Image Layer */}
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <img
          src="/images/offers/flipkart.png"
          alt="Tier Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            filter: "grayscale(100%) contrast(1.1)", // Base for clean tinting
            transform: "scale(1.05)", 
          }}
        />
        {/* Color Tint Overlay for accurate metallic color */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: tierStyles.tintColor,
          mixBlendMode: "color",
        }} />
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: tierStyles.tintColor,
          mixBlendMode: "multiply",
          opacity: 0.4,
        }} />
        {/* Dark Overlay for Text Readability */}
        <div style={{
          position: "absolute",
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          background: tierStyles.overlay,
        }} />
      </div>

      {/* Greeting text content (Left side) */}
      <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
          <p style={{ fontSize: 15, color: tierStyles.textMuted, fontWeight: 500 }}>
            {getGreeting()},
          </p>
          <span className={tierStyles.badgeClass}>
            {customer.tier} Member
          </span>
        </div>
        <h1
          style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 800,
            color: tierStyles.textColor,
            letterSpacing: "-0.03em",
          }}
        >
          {customer.name}
        </h1>
        <p style={{ color: tierStyles.textMuted, marginTop: 4, fontSize: 13 }}>
          Phone: <span style={{ color: tierStyles.textColor }}>{customer.phoneNo}</span>
        </p>
      </div>
    </Card>
  );
}
