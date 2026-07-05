import { Profile } from '../models/Profile';
import { Account } from '../models/Account';
import { Transaction } from '../models/Transaction';
import { Coupon } from '../models/Coupon';
import { Reward } from '../models/Reward';
import { RewardLedger } from '../models/RewardLedger';
import { TopProduct } from '../models/TopProduct';
import { Offer } from '../models/Offer';
import { Notification } from '../models/Notification';

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

    const rewardQuery: any = { profileId };
    if (organizationId) rewardQuery.organizationId = organizationId;
    if (outletId) rewardQuery.outletId = outletId;

    const ledgerQuery: any = { profileId };
    if (organizationId) ledgerQuery.organizationId = organizationId;
    if (outletId) ledgerQuery.outletId = outletId;

    const [profile, ledger, transactions, coupons, rewards, topProducts] = await Promise.all([
      Profile.findOne({ _id: profileId }).select('-__v'),
      RewardLedger.findOne(ledgerQuery),
      Transaction.find(query).sort({ createdAt: -1 }),
      Coupon.find({ ...couponQuery, status: 'active' }).sort({ issuedAt: -1 }), 
      Reward.find({ ...rewardQuery, status: 'active' }).sort({ issuedAt: -1 }), 
      TopProduct.find(query).sort({ orderCount: -1 }),
    ]);

    if (!profile) throw new Error('Profile not found');

    // Compute metrics dynamically based on filtered transactions
    const billTxns = transactions.filter(t => t.type === 'bill_created');
    const totalOrders = billTxns.length;
    const totalSpend = billTxns.reduce((sum, t) => sum + (t.billAmount || 0), 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(totalSpend / totalOrders) : 0;
    const lastVisit = billTxns.length > 0 ? billTxns[0].createdAt : (profile.metrics?.lastVisit || new Date());
    
    let recencyDays = 0;
    if (billTxns.length > 0) {
      const diffTime = Math.abs(Date.now() - new Date(lastVisit).getTime());
      recencyDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      summary: {
        customer: {
          name: profile.name,
          phoneNo: phone,
          tier: profile.tier,
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
      transactionHistory: transactions.map(t => {
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
      membership: profile.tier,
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

    const [ledger, transactions] = await Promise.all([
      RewardLedger.findOne(ledgerQuery),
      Transaction.find({ 
        ...query, 
        type: { $in: ['reward_grant', 'redemption', 'loyalty_award', 'points_expiry', 'rule_action', 'bill_created'] } 
      }).sort({ createdAt: -1 })
    ]);

    const rewardTransactions = transactions.map(t => {
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

    const transactionHistory = transactions.map(t => {
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

    let totalEarned = 0;
    let totalRedeemed = 0;
    rewardTransactions.forEach(t => {
      if (t.type === 'earned') totalEarned += t.points;
      else totalRedeemed += t.points;
    });

    return {
      summary: {
        currentBalance: ledger?.points || 0,
        totalEarned,
        totalRedeemed
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

    const [profile, transactions] = await Promise.all([
      Profile.findOne({ _id: profileId }).select('metrics'),
      Transaction.find(query).sort({ createdAt: -1 })
    ]);

    let totalPurchases = transactions.length;
    let totalAmount = 0;
    let totalRewardsEarned = 0;

    const purchases = transactions.map(t => {
      const amount = t.billAmount || 0;
      const earned = Math.abs(t.pointsImpact || 0);
      
      totalAmount += amount;
      totalRewardsEarned += earned;

      return {
        _id: t._id,
        customerId: profileId,
        invoiceNumber: t._id,
        storeName: organizationId ? (organizationId === 'simmati' ? 'Simmati Store' : 'Maharaja Store') : 'OwnRewards Store',
        storeLocation: outletId || 'Online',
        items: t.metadata?.items || [],
        amount,
        rewardEarned: earned,
        date: t.createdAt,
        paymentStatus: 'completed',
        paymentMethod: 'card'
      };
    });

    const averageOrderValue = totalPurchases > 0 ? Math.round(totalAmount / totalPurchases) : 0;
    const lastVisit = transactions.length > 0 ? transactions[0].createdAt : new Date();

    return {
      summary: {
        totalPurchases,
        totalAmount,
        totalRewardsEarned,
        metrics: {
          totalOrders: totalPurchases,
          totalSpend: totalAmount,
          averageOrderValue,
          recencyDays: 0, // dynamic fallback
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
}
