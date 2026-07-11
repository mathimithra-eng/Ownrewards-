"use client";

import React, { useState } from "react";
import { Bell, LogOut, Search, Store, ChevronDown, Check, Crown, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTenant } from "@/contexts/TenantContext";
import { useNotifications } from "@/hooks/useNotifications";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function Header() {
  const { customer, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    activeOutletId,
    activeOrg,
    activeOutlet,
    switchOutlet,
  } = useTenant();

  const { data: notificationsData } = useNotifications();

  // Dropdown visibility states
  const showOrgSwitcher = false;
  const showOutletSwitcher = !!activeOutlet;
  const hasMultipleOutlets = activeOrg && activeOrg.outlets.length > 1;

  const [outletSearch, setOutletSearch] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    setIsMobileSearchOpen(false);

    // Global App Navigation Search
    if (query.includes("dashboard") || query === "home") return router.push("/dashboard");
    if (query.includes("reward")) return router.push("/rewards");
    if (query.includes("purchase") || query.includes("order") || query.includes("bill")) return router.push("/purchases");
    if (query.includes("profile") || query.includes("account")) return router.push("/profile");
    if (query.includes("feedback") || query.includes("review") || query.includes("suggestion")) return router.push("/review");
    if (query.includes("notification")) return router.push("/notifications");

    // Fall back to coupon search
    router.push(`/coupons?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const filteredOutlets = activeOrg
    ? activeOrg.outlets.filter((out) =>
      out.name.toLowerCase().includes(outletSearch.toLowerCase())
    )
    : [];

  if (isMobileSearchOpen) {
    return (
      <header
        style={{
          height: "var(--header-height)",
          borderBottom: "1px solid var(--glass-border)",
          background: "var(--bg-surface)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          padding: "0 clamp(8px, 2vw, 20px)",
          width: "100%",
          boxSizing: "border-box",
          gap: 12
        }}
      >
        <form onSubmit={handleSearch} style={{ flex: 1, position: "relative" }}>
          <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <Input
            autoFocus
            type="text"
            placeholder="Search offers, coupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-full text-sm bg-muted/50 border-border/50 w-full"
            style={{ paddingLeft: "36px" }}
          />
        </form>
        <button onClick={() => setIsMobileSearchOpen(false)} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "14px", fontWeight: 600, cursor: "pointer", padding: "8px" }}>Cancel</button>
      </header>
    );
  }

  return (
    <header
      style={{
        height: "var(--header-height)",
        borderBottom: "1px solid var(--glass-border)",
        background: "var(--bg-surface)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(8px, 2vw, 20px)",
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "0 1px 0 var(--glass-border)",
      }}
    >
      {/* Desktop Search / Mobile Logo */}
      <div className="lg:flex-1 lg:max-w-[400px]" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Mobile: Logo */}
        <div className="lg:hidden" style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", flexShrink: 0 }}>
          <img src="/logo.png" alt="Logo" style={{ width: 32, height: 32, objectFit: "contain" }} />
        </div>

        {/* Desktop: Search bar */}
        <div className="hidden lg:flex" style={{ flex: 1 }}>
          <form onSubmit={handleSearch} style={{ position: "relative", width: "100%" }}>
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
            />
            <Input
              type="text"
              placeholder="Search offers, coupons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 rounded-full text-xs bg-muted/50 border-border/50 w-full"
              style={{ paddingLeft: "36px" }}
            />
          </form>
        </div>
      </div>

      {/* Center Stacked Switchers */}
      {(showOrgSwitcher || showOutletSwitcher) && (
        <div
          className="flex-1 lg:flex-none"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            justifyContent: "center",
            margin: "0 clamp(4px, 2vw, 24px)",
            position: "relative",
            minWidth: "clamp(100px, 20vw, 160px)",
            flexShrink: 1,
          }}
        >
          {/* Organization Switcher */}
          {showOrgSwitcher && activeOrg && (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "4px 12px",
                  height: 26,
                  borderRadius: 6,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-primary)",
                  fontSize: 12,
                  fontWeight: 600,
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
                  <Store size={12} color="var(--gold)" style={{ flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {activeOrg.name}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Outlet Switcher */}
          {showOutletSwitcher && activeOutlet && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--glass-border)",
                    cursor: hasMultipleOutlets ? "pointer" : "default",
                    width: "100%",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                  className={hasMultipleOutlets ? "hover:border-[var(--gold)]" : ""}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", overflow: "hidden", minWidth: 0, width: "100%" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%", display: "block" }}>{activeOutlet.name}</span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%", display: "block" }}>{activeOutlet.location || "Unknown Location"}</span>
                  </div>
                  {hasMultipleOutlets && <ChevronDown size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
                </div>
              </DropdownMenuTrigger>
              {hasMultipleOutlets && (
                <DropdownMenuContent 
                  align="end" 
                  sideOffset={12}
                  className="w-[calc(100vw-32px)] sm:w-[380px] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-border/40 shadow-2xl rounded-[24px] sm:rounded-[28px] z-50"
                  style={{ padding: 0, overflow: 'hidden', maxWidth: 'calc(100vw - 32px)' }}
                >
                  <div style={{ padding: "clamp(16px, 4vw, 24px)", width: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
                    {/* Header Section */}
                    <div className="flex items-center justify-between" style={{ marginBottom: "20px", width: "100%", gap: "8px" }}>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2" style={{ minWidth: 0, flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Store size={16} className="text-primary shrink-0" />
                        <span className="truncate">Switch Location</span>
                      </div>
                      <span className="text-[10px] font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap shrink-0">
                        {activeOrg?.outlets.length} total
                      </span>
                    </div>
                    
                    {/* Search Section */}
                    <div className="relative group" style={{ marginBottom: "20px", width: "100%" }}>
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        type="text"
                        placeholder="Search outlets..."
                        value={outletSearch}
                        onChange={(e) => setOutletSearch(e.target.value)}
                        className="h-11 text-sm bg-muted/40 border-border/50 hover:border-primary/40 focus:border-primary rounded-xl transition-all shadow-sm w-full"
                        style={{ paddingLeft: "40px", minWidth: 0 }}
                      />
                    </div>
                    
                    {/* Current Location Section */}
                    <div className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest" style={{ marginBottom: "8px" }}>Current Location</div>
                    <DropdownMenuItem className="flex flex-col items-start bg-primary/5 focus:bg-primary/10 hover:bg-primary/10 border border-primary/20 cursor-default overflow-hidden rounded-2xl transition-all shadow-sm group w-full" style={{ padding: "clamp(12px, 3vw, 16px)", marginBottom: "20px" }}>
                      <div className="flex justify-between items-center w-full gap-2" style={{ marginBottom: "8px" }}>
                        <span className="text-sm font-bold text-foreground truncate" style={{ minWidth: 0, flex: 1 }}>{activeOutlet.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0 bg-green-500/15 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full border border-green-500/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Active</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground w-full" style={{ minWidth: 0 }}>
                        <MapPin size={14} className="shrink-0 text-primary/70" />
                        <span className="text-xs truncate text-left" style={{ minWidth: 0, flex: 1 }}>{activeOutlet.location}</span>
                      </div>
                    </DropdownMenuItem>

                    {/* Other Locations Section */}
                    {filteredOutlets.filter((o) => o.id !== activeOutletId).length > 0 && (
                      <>
                        <DropdownMenuSeparator className="opacity-60" style={{ marginBottom: "20px" }} />
                        <div className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest" style={{ marginBottom: "8px" }}>Other Locations</div>
                        <div className="w-full space-y-2 custom-scrollbar" style={{ maxHeight: "220px", overflowY: "auto", overflowX: "hidden" }}>
                          {filteredOutlets
                            .filter((o) => o.id !== activeOutletId)
                            .map((outlet) => (
                              <DropdownMenuItem
                                key={outlet.id}
                                onSelect={(e) => {
                                  switchOutlet(outlet.id);
                                }}
                                onClick={() => {
                                  switchOutlet(outlet.id);
                                }}
                                className="flex flex-col items-start cursor-pointer overflow-hidden w-full rounded-2xl hover:bg-muted/80 focus:bg-muted/80 transition-all border border-transparent hover:border-border/60"
                                style={{ padding: "clamp(12px, 3vw, 16px)" }}
                              >
                                <span className="text-sm font-semibold text-foreground truncate w-full text-left" style={{ marginBottom: "6px", minWidth: 0 }}>{outlet.name}</span>
                                <div className="flex items-center gap-2 text-muted-foreground w-full" style={{ minWidth: 0 }}>
                                  <MapPin size={14} className="shrink-0 opacity-60" />
                                  <span className="text-xs truncate text-left" style={{ minWidth: 0, flex: 1 }}>{outlet.location}</span>
                                </div>
                              </DropdownMenuItem>
                            ))}
                        </div>
                      </>
                    )}
                  </div>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          )}
        </div>
      )}

      {/* Right side actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "clamp(4px, 1.5vw, 10px)", marginLeft: "auto", flexShrink: 0 }}>
        {/* Mobile Search Icon */}
        <button
          className="flex lg:hidden"
          onClick={() => setIsMobileSearchOpen(true)}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid var(--glass-border)",
            background: "var(--bg-elevated)",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-secondary)",
            flexShrink: 0,
            transition: "all 0.2s ease"
          }}
        >
          <Search size={16} />
        </button>

        {/* Mobile Premium Upgrade Button */}
        <button 
          onClick={() => alert("Premium Upgrade feature coming soon!")} 
          className="flex lg:hidden items-center gap-1 px-2.5 py-1.5 rounded-full shadow-sm cursor-pointer border-none" 
          style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", color: "#fff", textDecoration: "none", fontSize: "10px", fontWeight: 800, flexShrink: 0 }}
        >
          <Crown size={12} />
          <span>UNLOCK</span>
        </button>

        {/* Notification Bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => router.push("/notifications")}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid var(--glass-border)",
              background: "var(--bg-elevated)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-secondary)",
              flexShrink: 0,
              transition: "all 0.2s ease"
            }}
            className="hover:bg-[rgba(139,92,246,0.1)] hover:text-[var(--gold)]"
          >
            <Bell size={16} />
          </button>
          {notificationsData && notificationsData.summary.unread > 0 && (
            <div style={{
              position: "absolute",
              top: -2,
              right: -2,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              borderRadius: 8,
              background: "var(--rose)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--bg-surface)",
              pointerEvents: "none"
            }}>
              {notificationsData.summary.unread > 9 ? "9+" : notificationsData.summary.unread}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block" style={{ width: 1, height: 28, background: "var(--glass-border)", flexShrink: 0 }} />

        {/* User info */}
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(4px, 1vw, 8px)" }}>
          {/* Name + Phone - hide on very small screens */}
          <div className="hidden lg:block" style={{ textAlign: "right", lineHeight: 1.2 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }}>
              {customer?.name || "Customer"}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{customer?.phone}</p>
          </div>

          {/* Avatar */}
          <Link href="/profile" title="My Profile" style={{ flexShrink: 0 }}>
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-primary cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {customer?.name ? getInitials(customer.name) : "CP"}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* Logout */}
          <button
            className="hidden sm:flex"
            onClick={logout}
            title="Logout"
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--glass-border)",
              background: "transparent",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--rose)",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
