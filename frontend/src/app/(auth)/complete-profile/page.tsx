"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { setCustomer } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { User, Mail, Calendar, ArrowRight, AlertCircle } from "lucide-react";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { customer } = useAuth();
  const [name, setName] = useState(customer?.name === "New Customer" ? "" : customer?.name || "");
  const [email, setEmail] = useState(customer?.email || "");
  const [dob, setDob] = useState(customer?.dob || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!dob) {
      setError("Please enter your date of birth.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put("/customer/profile", { name: name.trim(), email: email.trim(), dob });
      if (res.data.success && res.data.data) {
        // Update local storage with new customer data
        setCustomer(res.data.data);
        router.replace("/dashboard");
      } else {
        setError(res.data.message || "Failed to update profile.");
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* Background Orbs */}
      <div className="orb orb-gold animate-float" style={{ width: 600, height: 600, top: "-10%", left: "-10%", animationDuration: "10s" }} />
      <div className="orb orb-purple animate-float" style={{ width: 500, height: 500, bottom: "-10%", right: "-10%", animationDuration: "12s", animationDelay: "1s" }} />

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 480, padding: 24 }}>
        <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-sm" style={{ padding: "40px 32px", borderRadius: "var(--radius-xl)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #f0b429, #d97706)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                color: "#0a0d1a",
                fontWeight: 800,
                fontSize: 28,
              }}
            >
              O
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              Complete Your Profile
            </h1>
            <p style={{ color: "var(--text-muted)" }}>
              Welcome! Please fill in your details to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Full Name */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  style={{ paddingLeft: 42, height: 48 }}
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  style={{ paddingLeft: 42, height: 48 }}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>
                Date of Birth
              </label>
              <div style={{ position: "relative" }}>
                <Calendar size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="input"
                  style={{ paddingLeft: 42, height: 48, colorScheme: "dark" }}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Phone (read-only) */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={customer?.phone || ""}
                className="input"
                style={{ height: 48, opacity: 0.6 }}
                disabled
              />
            </div>

            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--rose)", padding: "12px 16px", background: "var(--rose-dim)", borderRadius: "var(--radius-md)", fontSize: 14 }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold"
              style={{ width: "100%", height: 52, fontSize: 16, marginTop: 8 }}
            >
              {loading ? <LoadingSpinner size={24} color="#0a0d1a" /> : (
                <>Save & Continue <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
