"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { CouponsData } from "@/types";
import { useTenant } from "@/contexts/TenantContext";

export function useCoupons() {
  const { activeOrgId, activeOutletId } = useTenant();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['coupons', activeOrgId, activeOutletId],
    queryFn: async () => {
      const res = await api.get("/customer/coupons");
      return res.data.data as CouponsData;
    },
  });

  return {
    data: data || null,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch
  };
}
