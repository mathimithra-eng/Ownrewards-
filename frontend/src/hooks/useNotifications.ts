"use client";

import { useState, useEffect, useCallback } from "react";
import api, { clearApiCache } from "@/lib/api";
import type { NotificationsData } from "@/types";
import { useTenant } from "@/contexts/TenantContext";

export function useNotifications() {
  const [data, setData] = useState<NotificationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { activeOrgId, activeOutletId } = useTenant();

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/customer/notifications");
      const raw: NotificationsData = res.data.data;
      // Deduplicate by _id in case of stale cache overlap
      const seen = new Set<string>();
      const unique = raw.notifications.filter((n) => {
        if (seen.has(n._id)) return false;
        seen.add(n._id);
        return true;
      });
      setData({ ...raw, notifications: unique });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = useCallback(async (id: string) => {
    try {
      await api.patch(`/customer/notifications/${id}/read`);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          notifications: prev.notifications.map((n) =>
            n._id === id ? { ...n, read: true } : n
          ),
          summary: {
            ...prev.summary,
            unread: Math.max(0, prev.summary.unread - 1),
          },
        };
      });
    } catch {
      // silently fail
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await api.patch("/customer/notifications/read-all");
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          notifications: prev.notifications.map((n) => ({ ...n, read: true })),
          summary: { ...prev.summary, unread: 0 },
        };
      });
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    // Clear stale cache so we always get fresh notifications
    clearApiCache();
    fetch();
  }, [fetch, activeOrgId, activeOutletId]);

  return { data, loading, error, refetch: fetch, markRead, markAllRead };
}
