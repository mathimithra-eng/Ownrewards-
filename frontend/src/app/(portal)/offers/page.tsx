"use client";

import React, { useState } from "react";
import { useOffers } from "@/hooks/useOffers";
import { formatDate } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { AlertCircle, Sparkles, Tag, ChevronRight, Zap } from "lucide-react";

/* ── brand → offer card config ── */
const getBrandConfig = (brand: string) => {
  const b = brand.toLowerCase();
  if (b === "flipkart") return {
    img: "/images/offers/flipkart.png",
    gradient: "linear-gradient(135deg,#2874f0,#0056d6)",
    accent: "#2874f0",
    textColor: "#fff",
  };
  if (b === "myntra") return {
    img: "/images/offers/myntra.jpg",
    gradient: "linear-gradient(135deg,#ff3f6c,#d4194b)",
    accent: "#ff3f6c",
    textColor: "#fff",
  };
  if (b === "amazon") return {
    img: "/images/offers/amazon.jpg",
    gradient: "linear-gradient(135deg,#ff9900,#e47911)",
    accent: "#ff9900",
    textColor: "#fff",
  };
  if (b === "zomato") return {
    img: "/images/offers/zomato.jpg",
    gradient: "linear-gradient(135deg,#e23744,#b01c28)",
    accent: "#e23744",
    textColor: "#fff",
  };
  return {
    img: null,
    gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    accent: "#8b5cf6",
    textColor: "#fff",
  };
};

export default function OffersPage() {
  const { data, loading, error, refetch } = useOffers();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Failed to load offers</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{error}</p>
        <button className="btn btn-ghost" onClick={refetch}>Try Again</button>
      </div>
    );
  }

  const categories = ["all", ...Object.keys(data.byCategory)];
  const displayOffers = selectedCategory === "all"
    ? [...data.featured, ...data.regular]
    : data.byCategory[selectedCategory] || [];

  return (
    <div className="page-container animate-fade-in">
      <style dangerouslySetInnerHTML={{
        __html: `
          .offer-page-card {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
            cursor: pointer;
          }
          .offer-page-card:hover {
            transform: translateY(-6px) scale(1.02);
            box-shadow: 0 20px 48px rgba(0,0,0,0.18);
          }
          .offer-bg-layer {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            transition: transform 0.5s ease;
            z-index: 0;
          }
          .offer-page-card:hover .offer-bg-layer {
            transform: scale(1.08);
          }
          .offer-content-layer {
            position: relative;
            z-index: 2;
          }
          .cat-btn {
            transition: all 0.2s ease;
          }
          .cat-btn:hover {
            transform: translateY(-1px);
          }
          @media (max-width: 640px) {
            .offers-featured-grid { grid-template-columns: 1fr !important; }
            .offers-regular-grid { grid-template-columns: 1fr !important; }
          }
        `
      }} />

      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          Exclusive Offers <Sparkles color="var(--gold)" />
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 4 }}>Curated deals just for you from top brands.</p>
      </div>

      {/* Category Filter */}
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 16, marginBottom: 32 }} className="hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            className="cat-btn"
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 20px",
              borderRadius: "var(--radius-full)",
              background: selectedCategory === cat ? "var(--gold)" : "var(--glass-bg)",
              color: selectedCategory === cat ? "#fff" : "var(--text-primary)",
              border: selectedCategory === cat ? "none" : "1px solid var(--glass-border)",
              fontWeight: 600,
              fontSize: 13,
              textTransform: "capitalize",
              whiteSpace: "nowrap",
              cursor: "pointer",
              boxShadow: selectedCategory === cat ? "0 4px 12px rgba(139,92,246,0.3)" : "none",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Offers */}
      {selectedCategory === "all" && data.featured.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Zap size={18} color="var(--gold)" />
            <h2 className="section-title">Today&apos;s Exclusive Offers</h2>
          </div>
          <div
            className="offers-featured-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}
          >
            {data.featured.map((offer, idx) => {
              const { img, gradient, accent } = getBrandConfig(offer.brand);
              return (
                <div
                  key={offer._id}
                  className="offer-page-card animate-fade-in-up"
                  style={{
                    borderRadius: "var(--radius-lg)",
                    minHeight: 200,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    animationDelay: `${idx * 100}ms`,
                    border: `1px solid ${accent}30`,
                    background: img ? "transparent" : gradient,
                  }}
                >
                  {/* Background */}
                  {img && (
                    <>
                      <div className="offer-bg-layer" style={{ backgroundImage: `url('${img}')` }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,10,30,0.95) 0%, rgba(5,10,30,0.5) 55%, rgba(5,10,30,0.8) 100%)", zIndex: 1 }} />
                    </>
                  )}

                  <div className="offer-content-layer" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        background: "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 800,
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}>
                        ✨ Featured
                      </span>
                      <span style={{
                        fontWeight: 900,
                        fontSize: 26,
                        color: "#fff",
                        textShadow: `0 2px 8px ${accent}80`,
                      }}>
                        {offer.discount}{offer.discountType === "percentage" ? "%" : "₹"} OFF
                      </span>
                    </div>

                    <div style={{ marginTop: "auto" }}>
                      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>
                        {offer.title}
                      </h3>
                      <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.5 }}>
                        {offer.description}
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.6)", fontSize: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.15)", marginTop: "auto" }}>
                      <Tag size={13} />
                      <span style={{ fontWeight: 600 }}>{offer.brand}</span>
                      <span style={{ margin: "0 6px" }}>•</span>
                      <span>Ends {formatDate(offer.expiryDate)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Regular Offers */}
      <div>
        <h2 className="section-title" style={{ marginBottom: 20 }}>
          {selectedCategory === "all"
            ? "More Offers"
            : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Offers`}
        </h2>

        {displayOffers.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", background: "var(--glass-bg)", borderRadius: "var(--radius-lg)" }}>
            <p style={{ color: "var(--text-muted)" }}>No offers available in this category.</p>
          </div>
        ) : (
          <div
            className="offers-regular-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}
          >
            {displayOffers.filter((o) => !o.featured || selectedCategory !== "all").map((offer, idx) => {
              const { img, gradient, accent } = getBrandConfig(offer.brand);
              return (
                <div
                  key={offer._id}
                  className="offer-page-card animate-fade-in-up"
                  style={{
                    borderRadius: "var(--radius-lg)",
                    minHeight: 160,
                    display: "flex",
                    flexDirection: "column",
                    animationDelay: `${idx * 60}ms`,
                    border: `1px solid ${accent}25`,
                    background: img ? "transparent" : gradient,
                  }}
                >
                  {img && (
                    <>
                      <div className="offer-bg-layer" style={{ backgroundImage: `url('${img}')` }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,10,30,0.92) 0%, rgba(5,10,30,0.45) 60%, rgba(5,10,30,0.75) 100%)", zIndex: 1 }} />
                    </>
                  )}

                  <div className="offer-content-layer" style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        color: "#fff",
                        background: "rgba(255,255,255,0.15)",
                        padding: "2px 8px",
                        borderRadius: 4,
                        letterSpacing: "0.05em",
                      }}>
                        {offer.brand}
                      </span>
                      <span style={{
                        background: "rgba(255,255,255,0.25)",
                        backdropFilter: "blur(8px)",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 800,
                        color: "#fff",
                      }}>
                        {offer.discount}{offer.discountType === "percentage" ? "%" : "₹"} OFF
                      </span>
                    </div>

                    <div style={{ marginTop: "auto" }}>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4, lineHeight: 1.4 }}>
                        {offer.title}
                      </h4>
                      <p style={{
                        color: "rgba(255,255,255,0.65)",
                        fontSize: 12,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {offer.description}
                      </p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: "auto" }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Ends {formatDate(offer.expiryDate)}</span>
                      <ChevronRight size={16} color="rgba(255,255,255,0.5)" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
