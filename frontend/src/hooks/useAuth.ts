"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setToken, setCustomer, removeToken, getCustomer, isAuthenticated as checkAuth } from "@/lib/auth";
import type { Customer } from "@/types";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomerState] = useState<Customer | null>(getCustomer());

  const sendOTP = useCallback(async (phone: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/send-otp", { phone });
      if (res.data.success) {
        return true;
      }
      setError(res.data.message || "Failed to send OTP");
      return false;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to send OTP. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(
    async (phone: string, otp: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.post("/auth/verify-otp", { phone, otp });
        if (res.data.success && res.data.data) {
          const { token, customer: cust } = res.data.data;
          setToken(token);
          setCustomer(cust);
          setCustomerState(cust);
          return true;
        }
        setError(res.data.message || "Invalid OTP");
        return false;
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        setError(e.response?.data?.message || "OTP verification failed. Please try again.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Silently ignore — clear storage regardless
    } finally {
      removeToken();
      localStorage.removeItem("selectedOrganizationId");
      localStorage.removeItem("selectedOutletId");
      setCustomerState(null);
      router.replace("/login");
    }
  }, [router]);

  return {
    customer,
    loading,
    error,
    sendOTP,
    verifyOTP,
    logout,
    isAuthenticated: checkAuth(),
  };
}
