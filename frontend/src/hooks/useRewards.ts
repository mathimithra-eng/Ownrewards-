"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { RewardsData } from "@/types";
import { useTenant } from "@/contexts/TenantContext";

export function useRewards() {
  const { activeOrgId, activeOutletId } = useTenant();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['rewards', activeOrgId, activeOutletId],
    queryFn: async () => {
      const res = await api.get("/customer/rewards");
      return res.data.data as RewardsData;
    },
  });

  return {
    data: data || null,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch
  };
}
