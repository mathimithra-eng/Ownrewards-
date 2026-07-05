export const CONSTANTS = {
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 5,
  OTP_MAX_ATTEMPTS: 3,

  MEMBERSHIP_TIERS: ['Bronze', 'Silver', 'Gold', 'Platinum'] as const,

  REWARD_TYPES: ['earned', 'redeemed'] as const,

  PAYMENT_STATUS: ['completed', 'pending', 'failed', 'refunded'] as const,

  PAYMENT_METHODS: ['card', 'upi', 'wallet', 'netbanking', 'cod'] as const,

  COUPON_STATUS: ['active', 'used', 'expired'] as const,

  DISCOUNT_TYPES: ['percentage', 'flat'] as const,

  NOTIFICATION_TYPES: ['reward', 'coupon', 'offer', 'purchase', 'system'] as const,

  OFFER_CATEGORIES: ['electronics', 'fashion', 'food', 'travel', 'shopping', 'entertainment', 'health', 'lifestyle'] as const,

  CHAT_ROLES: ['user', 'assistant'] as const,

  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export type MembershipTier = typeof CONSTANTS.MEMBERSHIP_TIERS[number];
export type RewardType = typeof CONSTANTS.REWARD_TYPES[number];
export type PaymentStatus = typeof CONSTANTS.PAYMENT_STATUS[number];
export type PaymentMethod = typeof CONSTANTS.PAYMENT_METHODS[number];
export type CouponStatus = typeof CONSTANTS.COUPON_STATUS[number];
export type DiscountType = typeof CONSTANTS.DISCOUNT_TYPES[number];
export type NotificationType = typeof CONSTANTS.NOTIFICATION_TYPES[number];
export type OfferCategory = typeof CONSTANTS.OFFER_CATEGORIES[number];
export type ChatRole = typeof CONSTANTS.CHAT_ROLES[number];
