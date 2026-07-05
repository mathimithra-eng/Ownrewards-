"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import type { PurchasesData } from "@/types";
import { useTenant } from "@/contexts/TenantContext";

export function usePurchases() {
  const [data, setData] = useState<PurchasesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { activeOrgId, activeOutletId } = useTenant();

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/customer/purchases");
      setData(res.data.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load purchases");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch, activeOrgId, activeOutletId]);

  return { data, loading, error, refetch: fetch };
}
