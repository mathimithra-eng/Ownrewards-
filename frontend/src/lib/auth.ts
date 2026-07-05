import type { Customer } from "@/types";

const TOKEN_KEY = "ownrewards_token";
const CUSTOMER_KEY = "ownrewards_customer";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CUSTOMER_KEY);
};

export const getCustomer = (): Customer | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CUSTOMER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Customer;
  } catch {
    return null;
  }
};

export const setCustomer = (customer: Customer): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
