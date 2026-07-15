"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { PurchasesData } from "@/types";
import { useTenant } from "@/contexts/TenantContext";

export function usePurchases() {
  const { activeOrgId, activeOutletId } = useTenant();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['purchases', activeOrgId, activeOutletId],
    queryFn: async () => {
      const res = await api.get("/customer/purchases");
      return res.data.data as PurchasesData;
    },
  });

  return {
    data: data || null,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch
  };
}
