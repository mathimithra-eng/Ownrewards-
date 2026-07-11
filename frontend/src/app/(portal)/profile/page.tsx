"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/contexts/TenantContext";
import { Card } from "@/components/ui/card";
import { User, Mail, Calendar, Phone, Award, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function ProfilePage() {
  const { customer } = useAuth();
  const { activeOutlet, activeOrg } = useTenant();

  if (!customer) return null;

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">My Profile</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
          View and manage your personal information and reward details.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        {/* Personal Details */}
        <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-sm" style={{ padding: 32 }}>
          <h2 className="section-title" style={{ marginBottom: 24, fontSize: 18 }}>Personal Information</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={20} color="var(--gold)" />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4 }}>Full Name</p>
                <p style={{ fontSize: 16, color: "var(--text-primary)", fontWeight: 600 }}>{customer.name}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Mail size={20} color="var(--gold)" />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4 }}>Email Address</p>
                <p style={{ fontSize: 16, color: "var(--text-primary)", fontWeight: 600 }}>{customer.email || "Not provided"}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Phone size={20} color="var(--gold)" />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4 }}>Phone Number</p>
                <p style={{ fontSize: 16, color: "var(--text-primary)", fontWeight: 600 }}>{customer.phone}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar size={20} color="var(--gold)" />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4 }}>Date of Birth</p>
                <p style={{ fontSize: 16, color: "var(--text-primary)", fontWeight: 600 }}>
                  {customer.dob ? format(new Date(customer.dob), "MMMM d, yyyy") : "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Membership Details */}
        <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-sm" style={{ padding: 32, background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(240,180,41,0.05))" }}>
          <h2 className="section-title" style={{ marginBottom: 24, fontSize: 18 }}>Membership & Rewards</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(240,180,41,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Award size={20} color="var(--gold)" />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4 }}>Membership Tier</p>
                <p style={{ fontSize: 18, color: "var(--gold)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {activeOutlet?.tier || "MEMBER"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={20} color="var(--gold)" />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4 }}>Member Since</p>
                <p style={{ fontSize: 16, color: "var(--text-primary)", fontWeight: 600 }}>
                  {customer.memberSince ? format(new Date(customer.memberSince), "MMMM yyyy") : "Recently Joined"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MapPin size={20} color="var(--gold)" />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4 }}>Current Outlet</p>
                <p style={{ fontSize: 16, color: "var(--text-primary)", fontWeight: 600 }}>
                  {activeOutlet?.name || "None"}
                </p>
                {activeOrg && (
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{activeOrg.name}</p>
                )}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8, paddingTop: 24, borderTop: "1px solid var(--glass-border)" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4 }}>Available Rewards</p>
                <p style={{ fontSize: 24, color: "var(--text-primary)", fontWeight: 800 }}>{(activeOutlet?.points || 0).toLocaleString()} <span style={{ fontSize: 14, color: "var(--gold)", fontWeight: 600 }}>pts</span></p>
              </div>
              <div style={{ flex: 1, paddingLeft: 16, borderLeft: "1px solid var(--glass-border)" }}>
                <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, marginBottom: 4 }}>Last Visit</p>
                <p style={{ fontSize: 18, color: "var(--text-primary)", fontWeight: 700 }}>
                  {activeOutlet?.lastVisit ? format(new Date(activeOutlet.lastVisit), "dd MMM yyyy") : "No visits yet"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
