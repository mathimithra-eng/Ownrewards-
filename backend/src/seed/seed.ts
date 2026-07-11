import mongoose from 'mongoose';
import { env } from '../config/env';
import {
  Account,
  Profile,
  Transaction,
  Coupon,
  Reward,
  RewardLedger,
  TopProduct,
  Offer,
  Notification,
  Organization,
  Outlet,
} from '../models';

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.mongodbUri, {
      maxPoolSize: 10,
    });
    console.log('✅ Connected to MongoDB');

    const collections = await mongoose.connection.db?.collections();
    if (collections) {
      for (let collection of collections) {
        await collection.drop().catch(() => {});
      }
    }
    console.log('🗑️  Dropped existing collections (and indexes)');

    const accountId = 'accountId';
    const profileId = 'profileId';
    const phone = '+919876543210';

    // 1. Create Organizations
    await Organization.create({
      _id: 'burgerking',
      name: 'Burger King India',
      logoUrl: '/logos/burgerking.svg',
      industry: 'Restaurant',
      isActive: true,
    });
    
    await Organization.create({
      _id: 'lifestyle',
      name: 'Lifestyle Stores',
      logoUrl: '/logos/lifestyle.svg',
      industry: 'Retail',
      isActive: true,
    });
    console.log('🏢 Organizations created');

    // 2. Create Outlets
    await Outlet.create({ _id: 'bk_cp', organizationId: 'burgerking', name: 'Burger King - Connaught Place', location: 'New Delhi', isActive: true });
    
    await Outlet.create({ _id: 'lifestyle_moi', organizationId: 'lifestyle', name: 'Lifestyle - Mall of India', location: 'Noida', isActive: true });
    await Outlet.create({ _id: 'lifestyle_ambience', organizationId: 'lifestyle', name: 'Lifestyle - Ambience Mall', location: 'Gurgaon', isActive: true });
    console.log('📍 Outlets created');

    // 3. Create Account & Profile
    await Account.create({
      _id: accountId,
      phoneNo: phone,
      email: 'arun@gmail.com',
      isActive: true,
    });
    console.log('👤 Account created');

    await Profile.create({
      _id: profileId,
      accountId: accountId,
      name: 'Arun Kumar',
      tier: 'Gold', // Default profile tier
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
    console.log('👤 Profile created');

    // 4. Create RewardLedgers (loyalty points + cashback per organization & outlet)
    // Burger King Ledger
    await RewardLedger.create({
      _id: 'ledger_bk_cp',
      profileId,
      organizationId: 'burgerking',
      outletId: 'bk_cp',
      points: 2450,
      walletBalance: 150.00,
      tier: 'Gold',
      lastVisit: new Date('2026-06-28T14:30:00.000Z')
    });
    
    // Lifestyle Ledgers
    await RewardLedger.create({
      _id: 'ledger_lifestyle_moi',
      profileId,
      organizationId: 'lifestyle',
      outletId: 'lifestyle_moi',
      points: 750,
      walletBalance: 0,
      tier: 'Silver',
      lastVisit: new Date('2026-05-15T18:45:00.000Z')
    });
    
    await RewardLedger.create({
      _id: 'ledger_lifestyle_ambience',
      profileId,
      organizationId: 'lifestyle',
      outletId: 'lifestyle_ambience',
      points: 0,
      walletBalance: 0,
      tier: 'Bronze',
      lastVisit: new Date('2025-12-10T14:30:00.000Z')
    });
    console.log('💰 RewardLedgers created');

    // 5. Create Transactions so the login isn't blocked by Rule 2
    const transactions = [
      {
        _id: "txn_bk_1",
        profileId,
        organizationId: 'burgerking',
        outletId: 'bk_cp',
        type: "bill_created",
        title: "Order #BK-1024",
        description: "Dine-in at Connaught Place",
        createdAt: new Date("2026-06-28T14:30:00.000Z"),
        billAmount: 550,
        pointsImpact: 55,
        metadata: {
          items: [
            { itemName: "Veg Whopper Combo", quantity: 1 },
            { itemName: "Crispy Chicken Burger", quantity: 2 }
          ]
        }
      },
      {
        _id: "txn_ls_1",
        profileId,
        organizationId: 'lifestyle',
        outletId: 'lifestyle_moi',
        type: "bill_created",
        title: "Order #LS-5521",
        description: "Shopping at Mall of India",
        createdAt: new Date("2026-05-15T18:45:00.000Z"),
        billAmount: 4500,
        pointsImpact: 450,
        metadata: {
          items: [
            { itemName: "Levis Blue Jeans", quantity: 1 },
            { itemName: "Puma Sneakers", quantity: 1 }
          ]
        }
      },
      {
        _id: "txn_ls_2",
        profileId,
        organizationId: 'lifestyle',
        outletId: 'lifestyle_ambience',
        type: "bill_created",
        title: "Order #LS-8890",
        description: "Shopping at Ambience Mall",
        createdAt: new Date("2025-12-10T14:30:00.000Z"),
        billAmount: 2100,
        pointsImpact: 210,
        metadata: {
          items: [
            { itemName: "Jack & Jones T-Shirt", quantity: 2 }
          ]
        }
      }
    ];

    for (const txn of transactions) {
      await Transaction.create(txn);
    }
    console.log('📝 Transactions created');

    // 6. Create Coupons
    const coupons = [
      {
        _id: 'coupon_bk_summer',
        accountId,
        organizationId: 'burgerking',
        outletId: 'bk_cp',
        couponName: "Free Fries on Orders above ₹300",
        couponCode: "BKFRIES",
        issuedAt: new Date("2026-06-01T00:00:00.000Z"),
        expiresAt: new Date("2026-07-31T23:59:59.000Z"),
        status: "active",
      },
      {
        _id: 'coupon_ls_moi',
        accountId,
        organizationId: 'lifestyle',
        outletId: 'lifestyle_moi',
        couponName: "Flat 20% Off on Footwear",
        couponCode: "SHOES20",
        issuedAt: new Date("2026-05-01T00:00:00.000Z"),
        expiresAt: new Date("2026-08-31T23:59:59.000Z"),
        status: "active",
      },
      {
        _id: 'coupon_ls_amb',
        accountId,
        organizationId: 'lifestyle',
        outletId: 'lifestyle_ambience',
        couponName: "₹500 Off on Winter Wear",
        couponCode: "WINTER500",
        issuedAt: new Date("2025-11-01T00:00:00.000Z"),
        expiresAt: new Date("2026-01-31T23:59:59.000Z"),
        status: "expired",
      }
    ];

    for (const cp of coupons) {
      await Coupon.create(cp);
    }
    console.log('🎫 Coupons created');

    // 7. Create Rewards
    const rewards = [
      {
        _id: 'reward_bk',
        profileId,
        organizationId: 'burgerking',
        outletId: 'bk_cp',
        rewardName: "Free Chocolate Shake",
        issuedAt: new Date("2026-06-15T12:00:00.000Z"),
        expiresAt: new Date("2026-08-15T12:00:00.000Z"),
        status: "active",
      },
      {
        _id: 'reward_ls_moi',
        profileId,
        organizationId: 'lifestyle',
        outletId: 'lifestyle_moi',
        rewardName: "Silver Tier Priority Checkout",
        issuedAt: new Date("2026-05-15T12:00:00.000Z"),
        expiresAt: new Date("2027-05-15T12:00:00.000Z"),
        status: "active",
      },
      {
        _id: 'reward_ls_amb',
        profileId,
        organizationId: 'lifestyle',
        outletId: 'lifestyle_ambience',
        rewardName: "Bronze Tier Welcome Gift",
        issuedAt: new Date("2025-12-10T12:00:00.000Z"),
        expiresAt: new Date("2026-12-10T12:00:00.000Z"),
        status: "active",
      }
    ];

    for (const rw of rewards) {
      await Reward.create(rw);
    }
    console.log('🏆 Rewards created');

    // 8. Create Top Products
    await TopProduct.create([
      {
        _id: 'prod_whopper',
        profileId,
        organizationId: 'burgerking',
        outletId: 'bk_cp',
        productName: "Veg Whopper",
        category: "Burgers",
        orderCount: 15,
      },
      {
        _id: 'prod_jeans',
        profileId,
        organizationId: 'lifestyle',
        outletId: 'lifestyle_moi',
        productName: "Levis Blue Jeans",
        category: "Clothing",
        orderCount: 4,
      },
      {
        _id: 'prod_tshirt',
        profileId,
        organizationId: 'lifestyle',
        outletId: 'lifestyle_ambience',
        productName: "Jack & Jones T-Shirt",
        category: "Clothing",
        orderCount: 8,
      }
    ]);
    console.log('🛒 Top Products created');

    // 9. Create Notifications
    const notifications = [
      {
        customerId: profileId,
        organizationId: 'burgerking',
        outletId: 'bk_cp',
        type: 'purchase',
        title: 'Order Completed',
        message: 'Your order #BK-1024 at Connaught Place was successful. You earned 55 points!',
        icon: 'ShoppingBag',
        date: new Date("2026-06-28T14:35:00.000Z"),
      },
      {
        customerId: profileId,
        organizationId: 'burgerking',
        outletId: 'bk_cp',
        type: 'coupon',
        title: 'New Coupon Available',
        message: 'You have received a new coupon: Free Fries on Orders above ₹300.',
        icon: 'Ticket',
        date: new Date("2026-06-01T00:05:00.000Z"),
      },
      {
        customerId: profileId,
        organizationId: 'lifestyle',
        outletId: 'lifestyle_moi',
        type: 'purchase',
        title: 'Order Completed',
        message: 'Your shopping at Mall of India was successful. You earned 450 points!',
        icon: 'ShoppingBag',
        date: new Date("2026-05-15T18:50:00.000Z"),
      },
      {
        customerId: profileId,
        organizationId: 'lifestyle',
        outletId: 'lifestyle_moi',
        type: 'reward',
        title: 'Reward Unlocked',
        message: 'Congratulations! You unlocked the Silver Tier Priority Checkout reward.',
        icon: 'Gift',
        date: new Date("2026-05-15T12:05:00.000Z"),
      },
      {
        customerId: profileId,
        organizationId: 'lifestyle',
        outletId: 'lifestyle_ambience',
        type: 'purchase',
        title: 'Order Completed',
        message: 'Your shopping at Ambience Mall was successful. You earned 210 points!',
        icon: 'ShoppingBag',
        date: new Date("2025-12-10T14:35:00.000Z"),
      }
    ];

    for (const notif of notifications) {
      await Notification.create(notif);
    }
    console.log('🔔 Notifications created');

    console.log('\n🌱 Database seeded successfully with user custom data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
