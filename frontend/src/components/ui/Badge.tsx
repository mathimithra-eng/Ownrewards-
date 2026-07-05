"use client";

interface BadgeProps {
  variant:
    | "gold"
    | "silver"
    | "platinum"
    | "active"
    | "expired"
    | "used"
    | "earned"
    | "redeemed"
    | "upi"
    | "card"
    | "cash"
    | "wallet"
    | "reward"
    | "coupon"
    | "offer"
    | "purchase"
    | "system"
    | "neutral";
  children: React.ReactNode;
  className?: string;
}

const variantMap: Record<string, string> = {
  gold: "badge-gold",
  silver: "badge-silver",
  platinum: "badge-platinum",
  active: "status-active",
  earned: "status-earned",
  redeemed: "status-redeemed",
  expired: "status-expired",
  used: "status-used",
};

const inlineVariants: Record<string, React.CSSProperties> = {
  upi: {
    background: "rgba(56,189,248,0.15)",
    color: "#38bdf8",
    border: "1px solid rgba(56,189,248,0.2)",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 10px",
    borderRadius: 99,
  },
  card: {
    background: "rgba(124,58,237,0.15)",
    color: "#a78bfa",
    border: "1px solid rgba(124,58,237,0.2)",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 10px",
    borderRadius: 99,
  },
  cash: {
    background: "rgba(16,185,129,0.15)",
    color: "#10b981",
    border: "1px solid rgba(16,185,129,0.2)",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 10px",
    borderRadius: 99,
  },
  wallet: {
    background: "rgba(139,92,246,0.15)",
    color: "#8b5cf6",
    border: "1px solid rgba(139,92,246,0.2)",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 10px",
    borderRadius: 99,
  },
  reward: {
    background: "rgba(16,185,129,0.15)",
    color: "#10b981",
    border: "1px solid rgba(16,185,129,0.2)",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 10px",
    borderRadius: 99,
  },
  coupon: {
    background: "rgba(139,92,246,0.15)",
    color: "#8b5cf6",
    border: "1px solid rgba(139,92,246,0.2)",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 10px",
    borderRadius: 99,
  },
  offer: {
    background: "rgba(124,58,237,0.15)",
    color: "#a78bfa",
    border: "1px solid rgba(124,58,237,0.2)",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 10px",
    borderRadius: 99,
  },
  purchase: {
    background: "rgba(56,189,248,0.15)",
    color: "#38bdf8",
    border: "1px solid rgba(56,189,248,0.2)",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 10px",
    borderRadius: 99,
  },
  system: {
    background: "rgba(100,116,139,0.15)",
    color: "#94a3b8",
    border: "1px solid rgba(100,116,139,0.2)",
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 10px",
    borderRadius: 99,
  },
  neutral: {
    background: "rgba(148,163,184,0.1)",
    color: "#94a3b8",
    border: "1px solid rgba(148,163,184,0.18)",
    fontSize: 11,
    fontWeight: 700,
    padding: "2px 10px",
    borderRadius: 99,
  },
};

export default function Badge({ variant, children, className = "" }: BadgeProps) {
  const cssClass = variantMap[variant];

  if (cssClass) {
    return <span className={`${cssClass} ${className}`}>{children}</span>;
  }

  const inlineStyle = inlineVariants[variant] || {};
  return (
    <span style={{ display: "inline-block", ...inlineStyle }} className={className}>
      {children}
    </span>
  );
}
