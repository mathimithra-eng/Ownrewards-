"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Gift, ShoppingBag, FileUp, User } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard },
  { href: "/rewards", icon: Gift },
  { href: "/review", icon: FileUp },
  { href: "/purchases", icon: ShoppingBag },
  { href: "/profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex lg:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "var(--mobile-nav-height)",
        background: "var(--glass-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid var(--glass-border)",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 8px",
        zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        
        // Make Review icon prominent
        const isProminent = item.href === "/review";

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: isProminent ? 56 : 48,
              height: isProminent ? 56 : 48,
              borderRadius: isProminent ? "50%" : "var(--radius-md)",
              background: isProminent
                ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                : isActive
                ? "var(--gold-dim)"
                : "transparent",
              color: isProminent
                ? "#ffffff"
                : isActive
                ? "var(--gold)"
                : "var(--text-secondary)",
              transform: isProminent ? "translateY(-8px)" : "none",
              boxShadow: isProminent ? "var(--shadow-gold)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            <Icon size={isProminent ? 24 : 22} strokeWidth={isActive || isProminent ? 2.5 : 2} />
          </Link>
        );
      })}
    </nav>
  );
}
