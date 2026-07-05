"use client";

import React, { useState } from "react";
import { Bell, LogOut, Search, Store, MapPin, ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTenant } from "@/contexts/TenantContext";

export default function Header() {
  const { customer, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    organizations,
    activeOrgId,
    activeOutletId,
    activeOrg,
    activeOutlet,
    switchOrganization,
    switchOutlet,
  } = useTenant();

  // Dropdown visibility states
  const [orgOpen, setOrgOpen] = useState(false);
  const [outletOpen, setOutletOpen] = useState(false);

  // Dropdown search query states
  const [orgSearch, setOrgSearch] = useState("");
  const [outletSearch, setOutletSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/coupons?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Determine visibility rules
  const showOrgSwitcher = organizations.length > 1;
  const showOutletSwitcher = activeOrg && activeOrg.outlets.length > 1;

  // Filter items based on search
  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase())
  );

  const filteredOutlets = activeOrg
    ? activeOrg.outlets.filter((out) =>
        out.name.toLowerCase().includes(outletSearch.toLowerCase())
      )
    : [];

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
        padding: "0 20px",
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "0 1px 0 var(--glass-border)",
      }}
    >
      {/* Desktop Search / Mobile Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, maxWidth: 400 }}>
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
            <input
              type="text"
              placeholder="Search offers, coupons..."
              className="input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36, height: 38, borderRadius: 99, fontSize: 13, background: "var(--bg-elevated)", border: "1px solid var(--glass-border)", width: "100%" }}
            />
          </form>
        </div>
      </div>

      {/* Center Stacked Switchers */}
      {(showOrgSwitcher || showOutletSwitcher) && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            justifyContent: "center",
            margin: "0 24px",
            position: "relative",
            minWidth: 160,
          }}
        >
          {/* Active Organization Display */}
          {activeOrg && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
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
              }}
            >
              <Store size={12} color="var(--gold)" style={{ flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {activeOrg.name}
              </span>
            </div>
          )}

          {/* Outlet Switcher */}
          {showOutletSwitcher && activeOutlet && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => {
                  setOutletOpen(!outletOpen);
                  setOrgOpen(false);
                }}
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
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  fontSize: 11,
                  fontWeight: 500,
                  width: "100%",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
                className="hover:border-[var(--gold)]"
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
                  <MapPin size={11} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {activeOutlet.name}
                  </span>
                </div>
                <ChevronDown size={11} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              </button>

              {/* Outlet Dropdown Menu */}
              {outletOpen && (
                <>
                  <div
                    onClick={() => setOutletOpen(false)}
                    style={{ position: "fixed", inset: 0, zIndex: 998 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: 6,
                      width: 250,
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: 12,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      padding: 12,
                      zIndex: 999,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                    className="animate-fade-in-up"
                  >
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
                        SWITCH LOCATION
                      </span>
                      <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                        {activeOrg?.outlets.length} total
                      </span>
                    </div>

                    {/* Search Input */}
                    <div style={{ position: "relative" }}>
                      <Search size={12} color="var(--text-muted)" style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        type="text"
                        placeholder="Search outlets..."
                        value={outletSearch}
                        onChange={(e) => setOutletSearch(e.target.value)}
                        style={{
                          width: "100%",
                          height: 28,
                          borderRadius: 6,
                          border: "1px solid var(--glass-border)",
                          background: "var(--bg-elevated)",
                          paddingLeft: 26,
                          fontSize: 11,
                          color: "var(--text-primary)",
                          outline: "none",
                        }}
                      />
                    </div>

                    {/* Current Outlet */}
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>
                        CURRENT LOCATION
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px 8px",
                          borderRadius: 6,
                          background: "rgba(139, 92, 246, 0.08)",
                          border: "1px solid rgba(139, 92, 246, 0.2)",
                          color: "var(--text-primary)",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <MapPin size={12} color="var(--primary)" />
                          <span>{activeOutlet.name}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 9, background: "#22c55e", color: "#fff", padding: "1px 4px", borderRadius: 4 }}>Active</span>
                          <Check size={12} color="var(--primary)" />
                        </div>
                      </div>
                    </div>

                    {/* Other Outlets */}
                    {filteredOutlets.filter((o) => o.id !== activeOutletId).length > 0 && (
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>
                          OTHER LOCATIONS
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 150, overflowY: "auto" }}>
                          {filteredOutlets
                            .filter((o) => o.id !== activeOutletId)
                            .map((outlet) => (
                              <button
                                key={outlet.id}
                                onClick={() => {
                                  switchOutlet(outlet.id);
                                  setOutletOpen(false);
                                  setOutletSearch("");
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "6px 8px",
                                  borderRadius: 6,
                                  border: "1px solid transparent",
                                  background: "transparent",
                                  width: "100%",
                                  textAlign: "left",
                                  cursor: "pointer",
                                  fontSize: 12,
                                  color: "var(--text-secondary)",
                                }}
                                className="hover:bg-[rgba(139,92,246,0.05)] hover:text-var(--text-primary)"
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <MapPin size={12} />
                                  <span>{outlet.name}</span>
                                </div>
                                <span style={{ fontSize: 9, background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "1px 4px", borderRadius: 4 }}>Active</span>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Right side actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto", flexShrink: 0 }}>
        {/* Notification Bell */}
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

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: "var(--glass-border)", flexShrink: 0 }} />

        {/* User info */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Name + Phone - hide on very small screens */}
          <div className="hidden md:block" style={{ textAlign: "right", lineHeight: 1.2 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }}>
              {customer?.name || "Customer"}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{customer?.phone}</p>
          </div>

          {/* Avatar */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--gold-dim)",
              border: "2px solid var(--gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--gold)",
              fontWeight: 700,
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            {customer?.name ? getInitials(customer.name) : "CP"}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            title="Logout"
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--glass-border)",
              background: "transparent",
              display: "flex",
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
