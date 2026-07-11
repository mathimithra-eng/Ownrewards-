"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api, { clearApiCache } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface Outlet {
  id: string;
  name: string;
  location?: string;
  points?: number;
  tier?: string;
  lastVisit?: string;
}

interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  industry?: string;
  totalOrgPoints?: number;
  outlets: Outlet[];
}

interface TenantContextType {
  organizations: Organization[];
  activeOrgId: string | null;
  activeOutletId: string | null;
  activeOrg: Organization | null;
  activeOutlet: Outlet | null;
  loading: boolean;
  switchOrganization: (orgId: string) => void;
  switchOutlet: (outletId: string) => void;
  refetchOrganizations: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [activeOutletId, setActiveOutletId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrganizations = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/customer/organizations");
      if (res.data.success && res.data.data) {
        const rawOrgs = res.data.data.organizations || res.data.data;
        const orgsList: Organization[] = rawOrgs.map((o: any) => ({
          id: o.organizationId || o.id,
          name: o.organizationName || o.name,
          logoUrl: o.logoUrl,
          industry: o.industry,
          totalOrgPoints: o.totalOrgPoints,
          outlets: (o.outlets || []).map((out: any) => ({
            id: out.outletId || out.id,
            name: out.outletName || out.name,
            location: out.location,
            points: out.points,
            tier: out.tier,
            lastVisit: out.lastVisit,
          }))
        }));
        
        setOrganizations(orgsList);

        if (orgsList.length > 0) {
          // Read from localStorage or fallback
          const savedOrgId = localStorage.getItem("selectedOrganizationId");
          const savedOutletId = localStorage.getItem("selectedOutletId");

          const matchedOrg = orgsList.find((o) => o.id === savedOrgId) || orgsList[0];
          const matchedOutlet = matchedOrg.outlets.find((o) => o.id === savedOutletId) || matchedOrg.outlets[0];

          setActiveOrgId(matchedOrg.id);
          setActiveOutletId(matchedOutlet ? matchedOutlet.id : null);

          localStorage.setItem("selectedOrganizationId", matchedOrg.id);
          if (matchedOutlet) {
            localStorage.setItem("selectedOutletId", matchedOutlet.id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch organizations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const switchOrganization = useCallback((orgId: string) => {
    const matchedOrg = organizations.find((o) => o.id === orgId);
    if (!matchedOrg) return;

    const defaultOutlet = matchedOrg.outlets[0] || null;

    localStorage.setItem("selectedOrganizationId", orgId);
    if (defaultOutlet) {
      localStorage.setItem("selectedOutletId", defaultOutlet.id);
    } else {
      localStorage.removeItem("selectedOutletId");
    }

    setActiveOrgId(orgId);
    setActiveOutletId(defaultOutlet ? defaultOutlet.id : null);
    clearApiCache();
  }, [organizations]);

  const switchOutlet = useCallback((outletId: string) => {
    localStorage.setItem("selectedOutletId", outletId);
    setActiveOutletId(outletId);
    clearApiCache();
    
    // Dispatch a custom event to notify other components (like page reloads if needed, but not strictly required here)
    window.dispatchEvent(new Event("outletChanged"));
  }, []);

  const activeOrg = organizations.find((o) => o.id === activeOrgId) || null;
  const activeOutlet = activeOrg?.outlets.find((o) => o.id === activeOutletId) || null;

  return (
    <TenantContext.Provider
      value={{
        organizations,
        activeOrgId,
        activeOutletId,
        activeOrg,
        activeOutlet,
        loading,
        switchOrganization,
        switchOutlet,
        refetchOrganizations: fetchOrganizations,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
