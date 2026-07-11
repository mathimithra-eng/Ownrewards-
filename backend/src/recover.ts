import mongoose from 'mongoose';
import { env } from './config/env';
import { Profile } from './models/Profile';
import { Account } from './models/Account';
import { RewardLedger } from './models/RewardLedger';
import { Transaction } from './models/Transaction';
import { Coupon } from './models/Coupon';
import { Reward } from './models/Reward';
import { TopProduct } from './models/TopProduct';
import { Organization } from './models/Organization';
import { Outlet } from './models/Outlet';

async function recoverData() {
  try {
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');

    // Use exact IDs expected by authService
    const accountId = 'accountId';
    const profileId = 'profileId';
    const orgId = 'simmati';
    const outletId = 'thiruvarur';

    // Ensure organization and outlet exist
    await Organization.updateOne({ _id: orgId }, { name: 'Simmati', isActive: true }, { upsert: true });
    await Outlet.updateOne({ _id: outletId }, { organizationId: orgId, name: 'Thiruvarur', isActive: true }, { upsert: true });

    // 1. Account
    await Account.deleteMany({ _id: accountId });
    await Account.create({
      _id: accountId,
      phoneNo: '+919876543210',
      isActive: true,
    });
    console.log('Created Account');

    // 2. Profile
    await Profile.deleteMany({ _id: profileId });
    await Profile.create({
      _id: profileId,
      accountId: accountId,
      name: 'Arun Kumar',
      tier: 'Gold',
      walletBalance: 150.00,
      metrics: {
        totalOrders: 12,
        totalSpend: 14500,
        averageOrderValue: 1208,
        recencyDays: 5,
        lastVisit: new Date('2026-06-28T14:30:00.000Z'),
      },
      isActive: true,
    });
    console.log('Created Profile');

    // 3. Reward Ledger
    await RewardLedger.deleteMany({ profileId });
    await RewardLedger.create({
      _id: 'ledger_arun',
      profileId: profileId,
      organizationId: orgId,
      outletId: outletId,
      accountId: accountId,
      points: 2450,
      walletBalance: 150.00,
    });
    console.log('Created RewardLedger');

    // 4. Transactions
    const txns = [
      {
        id: "txn_8923",
        type: "bill_created",
        title: "Order #ORD-1024",
        description: "Dine-in at Connaught Place Outlet",
        createdAt: "2026-06-28T14:30:00.000Z",
        billAmount: 1500,
        pointsImpact: "+150",
        metadata: {
          items: [
            { itemName: "Paneer Tikka Masala", quantity: 1 },
            { itemName: "Garlic Naan", quantity: 2 }
          ]
        }
      },
      {
        id: "txn_8922",
        type: "rule_action",
        title: "Birthday Bonus",
        description: "Happy Birthday from ownRewards!",
        createdAt: "2026-06-25T10:00:00.000Z",
        billAmount: null,
        pointsImpact: "+500",
        metadata: {
          ruleName: "Birthday Bonus Rule"
        }
      },
      {
        id: "txn_8921",
        type: "reward_grant",
        title: "Reward Unlocked",
        description: "Free Cold Coffee added to your wallet",
        createdAt: "2026-06-15T12:00:00.000Z",
        billAmount: null,
        pointsImpact: "0",
        metadata: {
          source: "campaign"
        }
      },
      {
        id: "txn_8920",
        type: "redemption",
        title: "Points Redeemed",
        description: "Redeemed for ₹100 Off Coupon",
        createdAt: "2026-05-10T19:45:00.000Z",
        billAmount: null,
        pointsImpact: "-1000",
        metadata: {
          couponCode: "RW-XYZ123"
        }
      },
      {
        id: "txn_8919",
        type: "loyalty_award",
        title: "Tier Upgraded",
        description: "Congratulations! You are now a Gold member.",
        createdAt: "2026-05-10T19:45:00.000Z",
        billAmount: null,
        pointsImpact: "0",
        metadata: {
          previousTier: "Silver",
          newTier: "Gold"
        }
      },
      {
        id: "txn_8918",
        type: "points_expiry",
        title: "Points Expired",
        description: "Unused points from 2025 have expired.",
        createdAt: "2026-01-01T00:00:00.000Z",
        billAmount: null,
        pointsImpact: "-250",
        metadata: {}
      }
    ];

    await Transaction.deleteMany({ profileId });
    for (const t of txns) {
      await Transaction.create({
        _id: t.id,
        profileId,
        organizationId: orgId,
        outletId: outletId,
        type: t.type,
        title: t.title,
        description: t.description,
        createdAt: new Date(t.createdAt),
        billAmount: t.billAmount,
        pointsImpact: parseInt(t.pointsImpact),
        metadata: t.metadata,
      });
    }
    console.log('Created Transactions');

    // 5. Active Coupons
    await Coupon.deleteMany({ accountId });
    await Coupon.create({
      _id: 'coupon_summer20',
      organizationId: orgId,
      outletId: outletId,
      accountId: accountId,
      couponName: "Summer Special 20% Off",
      couponCode: "SUMMER20",
      issuedAt: new Date("2026-06-01T00:00:00.000Z"),
      expiresAt: new Date("2026-07-31T23:59:59.000Z"),
      status: "active",
      discount: 20,
      discountType: 'percentage',
      description: 'Summer special discount',
    });
    console.log('Created Coupons');

    // 6. Active Rewards
    await Reward.deleteMany({ profileId });
    await Reward.create({
      _id: 'reward_coffee',
      profileId,
      organizationId: orgId,
      outletId: outletId,
      rewardName: "Free Cold Coffee",
      issuedAt: new Date("2026-06-15T12:00:00.000Z"),
      expiresAt: new Date("2026-08-15T12:00:00.000Z"),
      status: "active",
    });
    console.log('Created Rewards');

    // 7. Top Products
    await TopProduct.deleteMany({ profileId });
    await TopProduct.create([
      {
        _id: 'prod_paneer',
        profileId,
        organizationId: orgId,
        outletId: outletId,
        productName: "Paneer Tikka Masala",
        category: "Main Course",
        orderCount: 8,
      },
      {
        _id: 'prod_naan',
        profileId,
        organizationId: orgId,
        outletId: outletId,
        productName: "Garlic Naan",
        category: "Breads",
        orderCount: 14,
      }
    ]);
    console.log('Created Top Products');

    console.log('✅ Successfully recovered all data!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error recovering data:', err);
    process.exit(1);
  }
}

recoverData();
