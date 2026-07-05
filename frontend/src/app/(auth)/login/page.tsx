"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import OTPInput from "@/components/auth/OTPInput";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Phone, ArrowRight, ShieldCheck, Store, MapPin } from "lucide-react";
import api from "@/lib/api";

interface Outlet {
  id: string;
  name: string;
}

interface Organization {
  id: string;
  name: string;
  outlets: Outlet[];
}

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "organization">("phone");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [testOtp, setTestOtp] = useState<string | null>(null);
  const { sendOTP, verifyOTP, loading, error } = useAuth();
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    
    // Add country code if missing (simplified for demo)
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    
    const success = await sendOTP(formattedPhone);
    if (success) {
      setPhone(formattedPhone);
      setTestOtp(null);
      setStep("otp");
    }
  };

  const handleGetTestOtp = async () => {
    try {
      // Strip the + prefix from phone, encode cleanly
      const rawPhone = phone.replace(/^\+/, '');
      const res = await fetch(`http://localhost:5000/api/auth/test-otp/%2B${rawPhone}`);
      const data = await res.json();
      if (data.success && data.data?.otp) {
        setTestOtp(data.data.otp);
      } else {
        alert('OTP not found. Make sure you clicked Send OTP first.');
      }
    } catch {
      alert('Could not reach server. Is the backend running on port 5000?');
    }
  };

  const handleVerifyOTP = async (otpCode: string) => {
    const success = await verifyOTP(phone, otpCode);
    if (success) {
      try {
        const res = await api.get("/customer/organizations");
        if (res.data.success && res.data.data) {
          const orgsList: Organization[] = res.data.data;
          setOrganizations(orgsList);
          
          if (orgsList.length === 1) {
            setSelectedOrgId(orgsList[0].id);
            if (orgsList[0].outlets.length > 0) {
              localStorage.setItem("selectedOrganizationId", orgsList[0].id);
              localStorage.setItem("selectedOutletId", orgsList[0].outlets[0].id);
              router.push("/dashboard");
            } else {
              localStorage.setItem("selectedOrganizationId", orgsList[0].id);
              localStorage.removeItem("selectedOutletId");
              router.push("/dashboard");
            }
          } else {
            setStep("organization");
          }
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Failed to fetch organizations:", err);
        router.push("/dashboard");
      }
    }
  };

  const handleSelectOrg = (org: Organization) => {
    setSelectedOrgId(org.id);
    if (org.outlets.length > 0) {
      localStorage.setItem("selectedOrganizationId", org.id);
      localStorage.setItem("selectedOutletId", org.outlets[0].id);
      router.push("/dashboard");
    } else {
      localStorage.setItem("selectedOrganizationId", org.id);
      localStorage.removeItem("selectedOutletId");
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* Background Orbs */}
      <div className="orb orb-gold animate-float" style={{ width: 600, height: 600, top: "-10%", left: "-10%", animationDuration: "10s" }} />
      <div className="orb orb-purple animate-float" style={{ width: 500, height: 500, bottom: "-10%", right: "-10%", animationDuration: "12s", animationDelay: "1s" }} />

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 420, padding: 24 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{ padding: "40px 32px", borderRadius: "var(--radius-xl)", textAlign: "center" }}
        >
          <img src="/logo.png" alt="OwnRewards Logo" style={{ width: 80, height: 80, objectFit: "contain", margin: "0 auto 16px" }} />
          
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            Welcome to Own<span style={{ color: "var(--gold)" }}>Rewards</span>
          </h1>
          <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
            Your exclusive customer portal
          </p>

          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOTP}
              >
                <div style={{ position: "relative", marginBottom: 24 }}>
                  <Phone size={18} color="var(--text-muted)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                    style={{ paddingLeft: 44, height: 52 }}
                    disabled={loading}
                    autoFocus
                  />
                </div>
                
                {error && (
                  <p style={{ color: "var(--rose)", fontSize: 13, marginBottom: 16 }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || phone.length < 10}
                  className="btn btn-gold"
                  style={{ width: "100%", height: 52, fontSize: 16 }}
                >
                  {loading ? <LoadingSpinner size={24} color="#0a0d1a" /> : (
                    <>Continue <ArrowRight size={18} /></>
                  )}
                </button>
              </motion.form>
            ) : step === "otp" ? (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                  <div style={{ background: "rgba(16,185,129,0.15)", color: "var(--emerald)", padding: 12, borderRadius: "50%" }}>
                    <ShieldCheck size={28} />
                  </div>
                </div>
                
                <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
                  Enter the 6-digit code sent to<br />
                  <strong style={{ color: "var(--text-primary)" }}>{phone}</strong>
                </p>

                <OTPInput length={6} onComplete={handleVerifyOTP} disabled={loading} />

                <p style={{ color: "var(--rose)", fontSize: 13, marginBottom: 24, minHeight: 20 }}>
                  {error || " "}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
                  <button
                    onClick={() => setStep("phone")}
                    disabled={loading}
                    className="btn-ghost"
                    style={{ fontSize: 14 }}
                  >
                    Change phone number
                  </button>
                  
                  {/* Dev-only Test OTP Helper */}
                  <div style={{ background: "rgba(139,92,246,0.1)", border: "1px dashed var(--glass-border)", padding: "12px", borderRadius: "8px", marginTop: "16px" }}>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Don&apos;t want to use real SMS?</p>
                    {testOtp ? (
                      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.2em", color: "var(--gold)" }}>
                        {testOtp}
                      </div>
                    ) : (
                      <button
                        onClick={handleGetTestOtp}
                        className="btn-ghost"
                        style={{ fontSize: 13, background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: "6px" }}
                      >
                        Fetch Test OTP
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : step === "organization" ? (
              <motion.div
                key="organization"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>Select Organization</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: 14 }}>
                  Choose the brand you want to access
                </p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {organizations.map(org => (
                    <button
                      key={org.id}
                      onClick={() => handleSelectOrg(org)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "16px",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: "var(--radius-lg)",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      className="hover:border-[var(--gold)]"
                    >
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--gold-dim)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 16 }}>
                        <Store size={20} color="var(--gold)" />
                      </div>
                      <div style={{ flex: 1, textAlign: "left" }}>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>{org.name}</div>
                      </div>
                      <div style={{ fontSize: 12, background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "2px 8px", borderRadius: 12, fontWeight: 600 }}>Active</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
