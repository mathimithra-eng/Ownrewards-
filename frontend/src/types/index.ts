// ─────────────────────────────────────────────────────────
// Customer
// ─────────────────────────────────────────────────────────
export interface Customer {
  _id: string;
  customerId: string;
  name: string;
  phone: string;
  email?: string;
  dob?: string;
  membership: "Silver" | "Gold" | "Platinum";
  rewardPoints: number;
  walletBalance: number;
  memberSince: string;
  profileImage?: string;
  lastLogin?: string;
  isActive: boolean;
}

// ─────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────
export interface Dashboard {
  summary: {
    customer: {
      name: string;
      phoneNo: string;
      tier: string;
      points: number;
      walletBalance: number;
    };
    metrics: {
      totalOrders: number;
      totalSpend: number;
      averageOrderValue: number;
      recencyDays: number;
      lastVisit: string;
    };
  };
  transactionHistory: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    createdAt: string;
    billAmount: number | null;
    pointsImpact: string;
    metadata: Record<string, any>;
  }>;
  activeCoupons: Array<{
    couponName: string;
    couponCode: string;
    issuedAt: string;
    expiresAt: string;
    status: string;
  }>;
  activeRewards: Array<{
    rewardName: string;
    issuedAt: string;
    expiresAt: string;
    status: string;
  }>;
  topProducts: Array<{
    productName: string;
    category: string;
    orderCount: number;
  }>;
}

// ─────────────────────────────────────────────────────────
// Rewards
// ─────────────────────────────────────────────────────────
export interface Reward {
  _id: string;
  customerId: string;
  type: "earned" | "redeemed";
  points: number;
  description: string;
  source: string;
  category: string;
  date: string;
}

export interface RewardChartData {
  month: string;
  earned: number;
  redeemed: number;
}

export interface RewardsData {
  summary: {
    currentBalance: number;
    totalEarned: number;
    totalRedeemed: number;
  };
  transactions: Reward[];
  transactionHistory: Dashboard["transactionHistory"];
  chartData: RewardChartData[];
}

// ─────────────────────────────────────────────────────────
// Purchases
// ─────────────────────────────────────────────────────────
export interface PurchaseItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Purchase {
  _id: string;
  customerId: string;
  invoiceNumber: string;
  storeName: string;
  storeLocation: string;
  items: PurchaseItem[];
  amount: number;
  rewardEarned: number;
  date: string;
  paymentStatus: "completed" | "pending" | "failed";
  paymentMethod: "upi" | "card" | "cash" | "wallet";
}

export interface PurchasesData {
  summary: {
    totalPurchases: number;
    totalAmount: number;
    totalRewardsEarned: number;
    metrics: {
      totalOrders: number;
      totalSpend: number;
      averageOrderValue: number;
      recencyDays: number;
      lastVisit: string;
    };
  };
  purchases: Purchase[];
}

// ─────────────────────────────────────────────────────────
// Coupons
// ─────────────────────────────────────────────────────────
export interface Coupon {
  _id: string;
  customerId: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  discountType: "percentage" | "flat";
  minPurchase: number;
  maxDiscount: number;
  expiryDate: string;
  status: "active" | "used" | "expired";
  usedDate?: string;
}

export interface CouponsData {
  summary: {
    total: number;
    active: number;
    used: number;
    expired: number;
  };
  coupons: Coupon[];
}

// ─────────────────────────────────────────────────────────
// Offers
// ─────────────────────────────────────────────────────────
export interface Offer {
  _id: string;
  title: string;
  description: string;
  discount: number;
  discountType: "percentage" | "flat";
  bannerImage?: string;
  featured: boolean;
  expiryDate: string;
  terms: string[];
  category: string;
  brand: string;
  isActive: boolean;
}

export interface OffersData {
  summary: {
    total: number;
    featured: number;
  };
  featured: Offer[];
  regular: Offer[];
  byCategory: Record<string, Offer[]>;
}

// ─────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────
export interface Notification {
  _id: string;
  customerId: string;
  type: "reward" | "coupon" | "offer" | "purchase" | "system";
  title: string;
  message: string;
  icon?: string;
  read: boolean;
  date: string;
}

export interface NotificationsData {
  summary: {
    total: number;
    unread: number;
  };
  notifications: Notification[];
  byType: Record<string, Notification[]>;
}

// ─────────────────────────────────────────────────────────
// API Responses
// ─────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthResponse {
  token: string;
  customer: Customer;
}
