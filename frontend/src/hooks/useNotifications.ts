"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import type { NotificationsData } from "@/types";
import { useTenant } from "@/contexts/TenantContext";

export function useNotifications() {
  const [data, setData] = useState<NotificationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { activeOrgId, activeOutletId } = useTenant();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetch = useCallback(async (isPolling = false) => {
    if (!isPolling) {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await api.get("/customer/notifications");
      if (!mounted.current) return;
      const raw: NotificationsData = res.data.data;
      setData(raw);
    } catch (err: unknown) {
      if (!mounted.current) return;
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to load notifications");
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const markRead = useCallback(async (id: string) => {
    // Optimistic UI update
    let previousData = data;
    setData((prev) => {
      if (!prev) return prev;
      previousData = prev;
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

    try {
      await api.patch(`/customer/notifications/${id}/read`);
      return true;
    } catch {
      // Revert on failure
      setData(previousData);
      return false;
    }
  }, [data]);

  const markAllRead = useCallback(async () => {
    let previousData = data;
    setData((prev) => {
      if (!prev) return prev;
      previousData = prev;
      return {
        ...prev,
        notifications: prev.notifications.map((n) => ({ ...n, read: true })),
        summary: { ...prev.summary, unread: 0 },
      };
    });

    try {
      await api.patch("/customer/notifications/read-all");
    } catch {
      setData(previousData);
    }
  }, [data]);

  useEffect(() => {
    fetch();

    // Poll for new notifications every 60 seconds
    const interval = setInterval(() => {
      fetch(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetch, activeOrgId, activeOutletId]);

  return { data, loading, error, refetch: () => fetch(false), markRead, markAllRead };
}
