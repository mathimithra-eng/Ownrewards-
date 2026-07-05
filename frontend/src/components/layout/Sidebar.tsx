"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gift,
  ShoppingBag,
  Ticket,
  Sparkles,
  Bell,
  FileUp,
  User,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/purchases", label: "Purchases", icon: ShoppingBag },
  { href: "/coupons", label: "Coupons", icon: Ticket },
  // { href: "/offers", label: "Offers", icon: Sparkles },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/review", label: "Suggestion / Feedback", icon: FileUp },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar hidden lg:flex">
      {/* Logo Area */}
      <div
        style={{
          height: "var(--header-height)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f3f0ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(139,92,246,0.2)" }}>
            <img src="/logo.png" alt="OwnRewards" style={{ width: 36, height: 36, objectFit: "contain" }} />
          </div>
          <div>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", display: "block", lineHeight: 1 }}>Own</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: "var(--gold)", letterSpacing: "-0.02em", display: "block", lineHeight: 1 }}>Rewards</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1, overflowY: "auto" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                color: isActive ? "var(--gold)" : "var(--text-secondary)",
                background: isActive ? "var(--gold-dim)" : "transparent",
                textDecoration: "none",
                fontWeight: isActive ? 600 : 500,
                transition: "all 0.2s var(--ease-smooth)",
              }}
              className={!isActive ? "sidebar-link-hover" : ""}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Decorative Bottom Area */}
      <div style={{ padding: 24, background: "var(--glass-bg)", borderTop: "1px solid var(--glass-border)", marginTop: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Sparkles size={20} color="var(--gold)" />
          <div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Unlock more</p>
            <p style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>Upgrade to Platinum</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
