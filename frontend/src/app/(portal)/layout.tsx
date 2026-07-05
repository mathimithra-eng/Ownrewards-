"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { TenantProvider } from "@/contexts/TenantContext";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setMounted(true);
    }
  }, [router, pathname]);

  if (!mounted) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <TenantProvider>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* ─── Uploaded gift+coupon image — fixed full-viewport background ─── */
          .gift-bg-fixed {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            background-image: url('/images/uploaded-bg.png');
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            opacity: 0.22;
          }
          /* dim it a bit more on very small screens so text stays legible */
          @media (max-width: 640px) {
            .gift-bg-fixed {
              background-position: 65% center;
              opacity: 0.12;
            }
          }
        `
      }} />

      {/* The actual background layer */}
      <div className="gift-bg-fixed" aria-hidden="true" />

      <div className="portal-layout" style={{ position: "relative", zIndex: 1 }}>
        <Sidebar />
        <main className="main-content">
          <Header />
          <div style={{ flex: 1, position: "relative" }}>
            {children}
          </div>
        </main>
        <MobileNav />
      </div>
    </TenantProvider>
  );
}
