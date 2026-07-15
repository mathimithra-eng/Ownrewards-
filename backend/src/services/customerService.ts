import { Profile } from '../models/Profile';
import { Account } from '../models/Account';
import { Transaction } from '../models/Transaction';
import { Coupon } from '../models/Coupon';
import { Reward } from '../models/Reward';
import { RewardLedger } from '../models/RewardLedger';
import { TopProduct } from '../models/TopProduct';
import { Offer } from '../models/Offer';
import { Notification } from '../models/Notification';
import { Organization } from '../models/Organization';
import { Feedback } from '../models/Feedback';

export class CustomerService {
  // ─────────────────────────────────────────
  // Dashboard — returns shape matching frontend Dashboard type
  // ─────────────────────────────────────────
  static async getDashboard(profileId: string, accountId: string, phone: string, organizationId?: string, outletId?: string) {
    const query: any = { profileId };
    if (organizationId) query.organizationId = organizationId;
    if (outletId) query.outletId = outletId;

    const couponQuery: any = { accountId };
    if (organizationId) couponQuery.organizationId = organizationId;
    if (outletId) couponQuery.outletId = outletId;

    const [profile, ledger, coupons, rewards, topProducts, [txnAggregation]] = await Promise.all([
      Profile.findOne({ _id: profileId }).select('name tier metrics'),
      RewardLedger.findOne(query),
      Coupon.find({ ...couponQuery, status: 'active' }).sort({ issuedAt: -1 }).limit(10), 
      Reward.find({ ...query, status: 'active' }).sort({ issuedAt: -1 }).limit(10), 
      TopProduct.find(query).sort({ orderCount: -1 }).limit(5),
      Transaction.aggregate([
        { $match: query },
        {
          $facet: {
            stats: [
              { $match: { type: 'bill_created' } },
              { $group: { _id: null, totalOrders: { $sum: 1 }, totalSpend: { $sum: '$billAmount' }, lastVisit: { $max: '$createdAt' } } }
            ],
            history: [
              { $sort: { createdAt: -1 } },
              { $limit: 20 }
            ]
          }
        }
      ])
    ]);

    if (!profile) throw new Error('Profile not found');

    const stats = txnAggregation?.stats[0] || { totalOrders: 0, totalSpend: 0, lastVisit: profile.metrics?.lastVisit || new Date() };
    const history = txnAggregation?.history || [];

    const totalOrders = stats.totalOrders;
    const totalSpend = stats.totalSpend;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalSpend / totalOrders) : 0;
    const lastVisit = stats.lastVisit;
    
    let recencyDays = 0;
    if (totalOrders > 0) {
      const diffTime = Math.abs(Date.now() - new Date(lastVisit).getTime());
      recencyDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      summary: {
        customer: {
          name: profile.name,
          phoneNo: phone,
          tier: ledger?.tier || profile.tier,
          points: ledger?.points || 0,
          walletBalance: ledger?.walletBalance || 0,
        },
        metrics: {
          totalOrders,
          totalSpend,
          averageOrderValue,
          recencyDays,
          lastVisit,
        }
      },
      transactionHistory: history.map((t: any) => {
        const impact = t.pointsImpact || 0;
        const impactStr = impact > 0 ? `+${impact}` : impact.toString();
        return {
          id: t._id,
          type: t.type,
          title: t.title,
          description: t.description,
          createdAt: t.createdAt,
          billAmount: t.billAmount,
          pointsImpact: impactStr,
          metadata: t.metadata
        };
      }),
      activeCoupons: coupons.map(c => ({
        couponName: c.couponName,
        couponCode: c.couponCode,
        issuedAt: c.issuedAt,
        expiresAt: c.expiresAt,
        status: c.status
      })),
      activeRewards: rewards.map(r => ({
        rewardName: r.rewardName,
        issuedAt: r.issuedAt,
        expiresAt: r.expiresAt,
        status: r.status
      })),
      topProducts: topProducts.map(p => ({
        productName: p.productName,
        category: p.category,
        orderCount: p.orderCount
      }))
    };
  }

  // ─────────────────────────────────────────
  // Profile 
  // ─────────────────────────────────────────
  static async getProfile(profileId: string, organizationId?: string, outletId?: string) {
    const profile = await Profile.findOne({ _id: profileId }).select('-__v');
    if (!profile) throw new Error('Profile not found');
    const account = await Account.findOne({ _id: profile.accountId });

    const ledgerQuery: any = { profileId };
    if (organizationId) ledgerQuery.organizationId = organizationId;
    if (outletId) ledgerQuery.outletId = outletId;
    const ledger = await RewardLedger.findOne(ledgerQuery);
    
    return {
      _id: profile._id,
      customerId: profile._id, // use profile._id as customerId for frontend compatibility
      name: profile.name,
      phone: account?.phoneNo || '',
      membership: ledger?.tier || profile.tier,
      rewardPoints: ledger?.points || 0,
      walletBalance: ledger?.walletBalance || 0,
      isActive: profile.isActive,
      memberSince: profile.createdAt || new Date(),
      lastLogin: profile.updatedAt || new Date(),
    };
  }

  // ─────────────────────────────────────────
  // Rewards
  // ─────────────────────────────────────────
  static async getRewards(profileId: string, organizationId?: string, outletId?: string) {
    const query: any = { profileId };
    if (organizationId) query.organizationId = organizationId;
    if (outletId) query.outletId = outletId;

    const ledgerQuery: any = { profileId };
    if (organizationId) ledgerQuery.organizationId = organizationId;
    if (outletId) ledgerQuery.outletId = outletId;

    const [ledger, [txnAggregation]] = await Promise.all([
      RewardLedger.findOne(ledgerQuery),
      Transaction.aggregate([
        { 
          $match: { 
            ...query, 
            type: { $in: ['reward_grant', 'redemption', 'loyalty_award', 'points_expiry', 'rule_action', 'bill_created'] } 
          } 
        },
        {
          $facet: {
            stats: [
              {
                $group: {
                  _id: null,
                  totalEarned: { $sum: { $cond: [{ $gte: ['$pointsImpact', 0] }, '$pointsImpact', 0] } },
                  totalRedeemed: { $sum: { $cond: [{ $lt: ['$pointsImpact', 0] }, { $abs: '$pointsImpact' }, 0] } }
                }
              }
            ],
            history: [
              { $sort: { createdAt: -1 } },
              { $limit: 100 }
            ]
          }
        }
      ])
    ]);

    const stats = txnAggregation?.stats[0] || { totalEarned: 0, totalRedeemed: 0 };
    const history = txnAggregation?.history || [];

    const rewardTransactions = history.map((t: any) => {
      const pImpact = t.pointsImpact || 0;
      return {
        _id: t._id,
        customerId: profileId,
        type: pImpact >= 0 ? 'earned' : 'redeemed',
        points: Math.abs(pImpact),
        description: t.title,
        source: t.type,
        category: 'general',
        date: t.createdAt
      };
    });

    const transactionHistory = history.map((t: any) => {
      const impact = t.pointsImpact || 0;
      const impactStr = impact > 0 ? `+${impact}` : impact.toString();
      return {
        id: t._id,
        type: t.type,
        title: t.title,
        description: t.description,
        createdAt: t.createdAt,
        billAmount: t.billAmount,
        pointsImpact: impactStr,
        metadata: t.metadata
      };
    });

    return {
      summary: {
        currentBalance: ledger?.points || 0,
        totalEarned: stats.totalEarned,
        totalRedeemed: stats.totalRedeemed
      },
      transactions: rewardTransactions,
      transactionHistory,
      chartData: [] // Dummy empty chart data to satisfy frontend
    };
  }

  // ─────────────────────────────────────────
  // Purchases
  // ─────────────────────────────────────────
  static async getPurchases(profileId: string, organizationId?: string, outletId?: string) {
    const query: any = { profileId, type: 'bill_created' };
    if (organizationId) query.organizationId = organizationId;
    if (outletId) query.outletId = outletId;

    const [profile, orgs, [txnAggregation]] = await Promise.all([
      Profile.findOne({ _id: profileId }).select('metrics'),
      Organization.find({}),
      Transaction.aggregate([
        { $match: query },
        {
          $facet: {
            stats: [
              {
                $group: {
                  _id: null,
                  totalPurchases: { $sum: 1 },
                  totalAmount: { $sum: '$billAmount' },
                  totalRewardsEarned: { $sum: { $abs: { $ifNull: ['$pointsImpact', 0] } } },
                  lastVisit: { $max: '$createdAt' }
                }
              }
            ],
            history: [
              { $sort: { createdAt: -1 } },
              { $limit: 100 }
            ]
          }
        }
      ])
    ]);

    const orgMap = orgs.reduce((acc, org) => {
      acc[org._id] = org.name;
      return acc;
    }, {} as Record<string, string>);

    const stats = txnAggregation?.stats[0] || { totalPurchases: 0, totalAmount: 0, totalRewardsEarned: 0, lastVisit: new Date() };
    const history = txnAggregation?.history || [];

    const totalPurchases = stats.totalPurchases;
    const totalAmount = stats.totalAmount;
    const totalRewardsEarned = stats.totalRewardsEarned;

    const purchases = history.map((t: any) => ({
      _id: t._id,
      customerId: profileId,
      invoiceNumber: t._id,
      storeName: orgMap[t.organizationId] || 'OwnRewards Store',
      storeLocation: t.outletId || 'Online',
      items: t.metadata?.items || [],
      amount: t.billAmount || 0,
      rewardEarned: Math.abs(t.pointsImpact || 0),
      date: t.createdAt,
      paymentStatus: 'completed',
      paymentMethod: 'card'
    }));

    const averageOrderValue = totalPurchases > 0 ? Math.round(totalAmount / totalPurchases) : 0;
    const lastVisit = stats.lastVisit;

    return {
      summary: {
        totalPurchases,
        totalAmount,
        totalRewardsEarned,
        metrics: {
          totalOrders: totalPurchases,
          totalSpend: totalAmount,
          averageOrderValue,
          recencyDays: 0, 
          lastVisit
        }
      },
      purchases
    };
  }

  // ─────────────────────────────────────────
  // Coupons
  // ─────────────────────────────────────────
  static async getCoupons(accountId: string, organizationId?: string, outletId?: string) {
    const query: any = { accountId };
    if (organizationId) query.organizationId = organizationId;
    if (outletId) query.outletId = outletId;

    const coupons = await Coupon.find(query).sort({ issuedAt: -1 });
    
    let active = 0, used = 0, expired = 0;
    
    const formattedCoupons = coupons.map(c => {
      if (c.status === 'active') active++;
      if (c.status === 'used') used++;
      if (c.status === 'expired') expired++;
      
      return {
        _id: c._id,
        customerId: accountId, // Frontend expects customerId
        code: c.couponCode,
        title: c.couponName,
        description: 'Coupon',
        discount: 0,
        discountType: 'percentage',
        minPurchase: 0,
        maxDiscount: 0,
        expiryDate: c.expiresAt,
        status: c.status
      };
    });

    return {
      summary: {
        total: coupons.length,
        active,
        used,
        expired
      },
      coupons: formattedCoupons
    };
  }

  // ─────────────────────────────────────────
  // Offers
  // ─────────────────────────────────────────
  static async getOffers(organizationId?: string, outletId?: string) {
    const query: any = { isActive: true };
    if (organizationId) query.organizationId = organizationId;
    if (outletId) query.outletId = outletId;

    const offers = await Offer.find(query);
    
    const featured = offers.filter(o => o.featured);
    const regular = offers.filter(o => !o.featured);
    const byCategory: Record<string, any[]> = {};
    
    offers.forEach(o => {
      if (!byCategory[o.category]) byCategory[o.category] = [];
      byCategory[o.category].push(o);
    });

    return {
      summary: {
        total: offers.length,
        featured: featured.length
      },
      featured,
      regular,
      byCategory
    };
  }

  // ─────────────────────────────────────────
  // Notifications
  // ─────────────────────────────────────────
  static async getNotifications(profileId: string, organizationId?: string, outletId?: string) {
    const query: any = { customerId: profileId };
    if (organizationId) query.organizationId = organizationId;
    if (outletId) query.outletId = outletId;

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    
    let unread = 0;
    const byType: Record<string, any[]> = {};

    const formatted = notifications.map(n => {
      if (!n.read) unread++;
      
      const notif = {
        _id: n._id,
        customerId: profileId,
        type: n.type || 'system',
        title: n.title,
        message: n.message,
        metadata: n.metadata || {},
        read: n.read,
        date: n.createdAt
      };

      if (!byType[notif.type]) byType[notif.type] = [];
      byType[notif.type].push(notif);

      return notif;
    });

    return {
      summary: {
        total: formatted.length,
        unread
      },
      notifications: formatted,
      byType
    };
  }

  // ─────────────────────────────────────────
  // Notification Actions
  // ─────────────────────────────────────────
  static async markNotificationRead(notificationId: string, profileId: string) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, customerId: profileId },
      { read: true },
      { new: true }
    );
  }

  static async markAllNotificationsRead(profileId: string) {
    return Notification.updateMany({ customerId: profileId, read: false }, { read: true });
  }

  // ─────────────────────────────────────────
  // Profile Update
  // ─────────────────────────────────────────
  static async updateProfile(
    profileId: string,
    data: { name?: string; email?: string; dob?: string }
  ) {
    const update: Record<string, unknown> = {};
    if (data.name) update.name = data.name;

    return Profile.findOneAndUpdate(
      { _id: profileId },
      { $set: update },
      { new: true, select: '-__v' }
    );
  }

  // ─────────────────────────────────────────
  // Feedback
  // ─────────────────────────────────────────
  static async submitFeedback(
    profileId: string,
    organizationId: string,
    outletId: string | undefined,
    data: any,
    fileMetadata?: any
  ) {
    const feedback = new Feedback({
      profileId,
      organizationId,
      outletId,
      type: data.type,
      text: data.text,
      purchaseId: data.purchaseId,
      rating: data.rating ? Number(data.rating) : undefined,
      comment: data.comment,
      fileMetadata
    });

    return feedback.save();
  }
}
