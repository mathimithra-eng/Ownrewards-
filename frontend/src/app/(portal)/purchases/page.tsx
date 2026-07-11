"use client";

import React from "react";
import { usePurchases } from "@/hooks/usePurchases";
import { formatCurrency, formatDate } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatCard from "@/components/ui/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ShoppingBag, Receipt, TrendingUp } from "lucide-react";

/* ── Product image map based on item name keywords ── */
const getProductImage = (name: string): string | null => {
  const n = name.toLowerCase();
  if (n.includes("headphone") || n.includes("earphone") || n.includes("audio") || n.includes("earbud"))
    return "/images/headphones.png";
  if (n.includes("speaker") || n.includes("bluetooth"))
    return "/images/speaker.png";
  return null;
};

/* ── Color map for store-specific gradients ── */
const getStoreGradient = (store: string) => {
  const s = store.toLowerCase();
  if (s.includes("flipkart")) return "linear-gradient(135deg,#2874f0,#0056d6)";
  if (s.includes("amazon")) return "linear-gradient(135deg,#ff9900,#e47911)";
  if (s.includes("myntra")) return "linear-gradient(135deg,#ff3f6c,#d4194b)";
  if (s.includes("swiggy") || s.includes("zomato")) return "linear-gradient(135deg,#fc8019,#e26a00)";
  return "linear-gradient(135deg,#8b5cf6,#6d28d9)";
};

const getStoreInitial = (store: string) => store.charAt(0).toUpperCase();

export default function PurchasesPage() {
  const { data, loading, error, refetch } = usePurchases();

  if (loading) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
        <AlertCircle size={48} color="var(--rose)" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Failed to load purchases</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{error}</p>
        <button className="btn btn-ghost" onClick={refetch}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <style dangerouslySetInnerHTML={{
        __html: `
          .purchase-card {
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
          }
          .purchase-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 48px rgba(0,0,0,0.1);
          }
          .product-img {
            transition: transform 0.4s ease;
          }
          .purchase-card:hover .product-img {
            transform: scale(1.08) rotate(-3deg);
          }
          @media (max-width: 640px) {
            .purchase-items-grid { grid-template-columns: 1fr !important; }
            .purchase-header-row { flex-direction: column !important; gap: 12px !important; }
          }
        `
      }} />

      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Purchase History</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 4 }}>Review your past orders and rewards earned.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
        <StatCard label="Total Spend" value={formatCurrency(data.summary.metrics.totalSpend)} icon={<ShoppingBag size={28} />} accentColor="var(--sky)" delay={0} />
        <StatCard label="Total Orders" value={data.summary.metrics.totalOrders} icon={<Receipt size={28} />} accentColor="var(--purple)" delay={100} />
        <StatCard label="Avg. Order Value" value={formatCurrency(data.summary.metrics.averageOrderValue)} icon={<TrendingUp size={28} />} accentColor="var(--emerald)" delay={200} />
        <StatCard label="Last Visit" value={`${data.summary.metrics.recencyDays} days ago`} icon={<AlertCircle size={28} />} accentColor="var(--gold)" delay={300} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {data.purchases.length === 0 ? (
          <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-sm" style={{ padding: 40, textAlign: "center" }}>
            <ShoppingBag size={48} color="var(--text-muted)" style={{ margin: "0 auto 16px", opacity: 0.5 }} />
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No purchases yet</h3>
            <p style={{ color: "var(--text-muted)" }}>Start shopping to see your history here.</p>
          </Card>
        ) : (
          data.purchases.map((purchase, idx) => {
            const storeGrad = getStoreGradient(purchase.storeName);

            return (
              <div
                key={purchase._id}
                className="purchase-card animate-fade-in-up"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  animationDelay: `${idx * 60}ms`,
                  boxShadow: "var(--shadow-card)",
                }}
              >
                {/* Store header band */}
                <div style={{ background: storeGrad, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }} className="purchase-header-row">
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {/* Store avatar */}
                    <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#fff", backdropFilter: "blur(8px)", flexShrink: 0 }}>
                      {getStoreInitial(purchase.storeName)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{purchase.storeName}</h3>
                      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>
                        #{purchase.invoiceNumber} • {formatDate(purchase.date)}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{formatCurrency(purchase.amount)}</div>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 6 }}>
                      <Badge variant={purchase.paymentMethod}>{purchase.paymentMethod}</Badge>
                      <Badge variant="reward">+{purchase.rewardEarned} pts</Badge>
                    </div>
                  </div>
                </div>

                {/* Items list */}
                <div style={{ padding: 24 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
                    Items Purchased
                  </h4>
                  <div
                    className="purchase-items-grid"
                    style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}
                  >
                    {purchase.items.map((item, i) => {
                      const itemName = item.itemName || item.name || "";
                      const imgSrc = getProductImage(itemName);
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            background: "var(--bg-elevated)",
                            borderRadius: "var(--radius-md)",
                            padding: "12px 14px",
                            border: "1px solid var(--glass-border)",
                            overflow: "hidden",
                          }}
                        >
                          {/* Product image or icon */}
                          <div style={{ width: 52, height: 52, borderRadius: "var(--radius-sm)", background: imgSrc ? "transparent" : "var(--glass-bg)", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={item.name}
                                className="product-img"
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                              />
                            ) : (
                              <ShoppingBag size={22} color="var(--text-muted)" />
                            )}
                          </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                                {itemName}
                              </p>
                              <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                              {item.price ? formatCurrency(item.price * item.quantity) : ""}
                            </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
