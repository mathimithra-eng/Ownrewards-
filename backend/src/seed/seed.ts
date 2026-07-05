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

    // Clear existing collections by dropping them to remove old indexes
    const collections = await mongoose.connection.db?.collections();
    if (collections) {
      for (let collection of collections) {
        await collection.drop().catch(() => {}); // ignore errors if it doesn't exist
      }
    }
    console.log('🗑️  Dropped existing collections (and indexes)');

    const accountId = 'accountId';
    const profileId = 'profileId';
    const phone = '+919876543210';

    // 1. Create Organizations
    const simmati = await Organization.create({
      _id: 'simmati',
      name: 'Simmati',
      isActive: true,
    });
    const maharaja = await Organization.create({
      _id: 'maharaja',
      name: 'Maharaja',
      isActive: true,
    });
    console.log('🏢 Organizations created');

    // 2. Create Outlets
    // Simmati Outlets
    await Outlet.create({ _id: 'thiruvarur', organizationId: 'simmati', name: 'Thiruvarur', isActive: true });
    await Outlet.create({ _id: 'nagapattinam', organizationId: 'simmati', name: 'Nagapattinam', isActive: true });
    await Outlet.create({ _id: 'simmati_mayiladuthurai', organizationId: 'simmati', name: 'Mayiladuthurai', isActive: true });

    // Maharaja Outlets
    await Outlet.create({ _id: 'maharaja_thiruvarur', organizationId: 'maharaja', name: 'Thiruvarur', isActive: true });
    await Outlet.create({ _id: 'mayiladuthurai', organizationId: 'maharaja', name: 'Mayiladuthurai', isActive: true });
    await Outlet.create({ _id: 'maharaja_karaikal', organizationId: 'maharaja', name: 'Karaikal', isActive: true });
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
      tier: 'Gold',
      walletBalance: 150.00, // kept as global fallback, but we will read per org/outlet
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
    // Simmati Outlets
    await RewardLedger.create({
      _id: 'ledger_simmati_thiruvarur',
      profileId,
      organizationId: 'simmati',
      outletId: 'thiruvarur',
      points: 2450,
      walletBalance: 150.00,
    });
    await RewardLedger.create({
      _id: 'ledger_simmati_nagapattinam',
      profileId,
      organizationId: 'simmati',
      outletId: 'nagapattinam',
      points: 1200,
      walletBalance: 80.00,
    });
    await RewardLedger.create({
      _id: 'ledger_simmati_mayiladuthurai',
      profileId,
      organizationId: 'simmati',
      outletId: 'simmati_mayiladuthurai',
      points: 800,
      walletBalance: 40.00,
    });

    // Maharaja Outlets
    await RewardLedger.create({
      _id: 'ledger_maharaja_thiruvarur',
      profileId,
      organizationId: 'maharaja',
      outletId: 'maharaja_thiruvarur',
      points: 1800,
      walletBalance: 120.00,
    });
    await RewardLedger.create({
      _id: 'ledger_maharaja_mayiladuthurai',
      profileId,
      organizationId: 'maharaja',
      outletId: 'mayiladuthurai',
      points: 950,
      walletBalance: 50.00,
    });
    await RewardLedger.create({
      _id: 'ledger_maharaja_karaikal',
      profileId,
      organizationId: 'maharaja',
      outletId: 'maharaja_karaikal',
      points: 600,
      walletBalance: 30.00,
    });
    console.log('💰 RewardLedgers created');

    // 5. Create Transactions per Organization and Outlet
    const transactions = [
      // Simmati - Thiruvarur
      {
        _id: 'txn_sim_thir_1',
        profileId,
        organizationId: 'simmati',
        outletId: 'thiruvarur',
        type: 'bill_created',
        title: 'Order #SIM-TH-101',
        description: 'Dine-in at Simmati Thiruvarur Outlet',
        createdAt: new Date('2026-06-28T14:30:00.000Z'),
        billAmount: 1500,
        pointsImpact: 150,
        metadata: { items: [{ itemName: 'Paneer Tikka Masala', quantity: 1 }, { itemName: 'Garlic Naan', quantity: 2 }] },
      },
      {
        _id: 'txn_sim_thir_2',
        profileId,
        organizationId: 'simmati',
        outletId: 'thiruvarur',
        type: 'rule_action',
        title: 'Birthday Bonus',
        description: 'Happy Birthday from Simmati!',
        createdAt: new Date('2026-06-25T10:00:00.000Z'),
        billAmount: null,
        pointsImpact: 500,
        metadata: {},
      },
      // Simmati - Nagapattinam
      {
        _id: 'txn_sim_nag_1',
        profileId,
        organizationId: 'simmati',
        outletId: 'nagapattinam',
        type: 'bill_created',
        title: 'Order #SIM-NG-201',
        description: 'Takeaway from Simmati Nagapattinam Outlet',
        createdAt: new Date('2026-06-20T18:00:00.000Z'),
        billAmount: 800,
        pointsImpact: 80,
        metadata: { items: [{ itemName: 'Veg Biryani', quantity: 1 }] },
      },
      // Maharaja - Thiruvarur
      {
        _id: 'txn_mah_thir_1',
        profileId,
        organizationId: 'maharaja',
        outletId: 'maharaja_thiruvarur',
        type: 'bill_created',
        title: 'Order #MAH-TH-401',
        description: 'Dine-in at Maharaja Thiruvarur Outlet',
        createdAt: new Date('2026-06-27T19:30:00.000Z'),
        billAmount: 1200,
        pointsImpact: 120,
        metadata: { items: [{ itemName: 'Butter Chicken', quantity: 1 }] },
      },
      // Maharaja - Mayiladuthurai
      {
        _id: 'txn_mah_may_1',
        profileId,
        organizationId: 'maharaja',
        outletId: 'mayiladuthurai',
        type: 'bill_created',
        title: 'Order #MAH-MY-501',
        description: 'Delivery from Maharaja Mayiladuthurai Outlet',
        createdAt: new Date('2026-06-15T20:00:00.000Z'),
        billAmount: 950,
        pointsImpact: 95,
        metadata: {},
      },
    ];

    for (const txn of transactions) {
      await Transaction.create(txn);
    }
    console.log('📝 Transactions created');

    // 6. Create Coupons per Organization and Outlet
    const coupons = [
      // Simmati coupons
      {
        _id: 'coupon_sim_1',
        accountId,
        organizationId: 'simmati',
        outletId: 'thiruvarur',
        couponName: 'Simmati Summer 20% Off',
        couponCode: 'SIMMATI20',
        issuedAt: new Date('2026-06-01T00:00:00.000Z'),
        expiresAt: new Date('2026-07-31T23:59:59.000Z'),
        status: 'active',
      },
      {
        _id: 'coupon_sim_2',
        accountId,
        organizationId: 'simmati',
        outletId: 'nagapattinam',
        couponName: 'Simmati NGT Flat ₹100 Off',
        couponCode: 'SIMNGT100',
        issuedAt: new Date('2026-06-05T00:00:00.000Z'),
        expiresAt: new Date('2026-07-31T23:59:59.000Z'),
        status: 'active',
      },
      // Maharaja coupons
      {
        _id: 'coupon_mah_1',
        accountId,
        organizationId: 'maharaja',
        outletId: 'maharaja_thiruvarur',
        couponName: 'Maharaja Royal ₹200 Off',
        couponCode: 'MAHARAJA200',
        issuedAt: new Date('2026-06-10T00:00:00.000Z'),
        expiresAt: new Date('2026-08-15T23:59:59.000Z'),
        status: 'active',
      },
      {
        _id: 'coupon_mah_2',
        accountId,
        organizationId: 'maharaja',
        outletId: 'mayiladuthurai',
        couponName: 'Maharaja Mayiladuthurai Special',
        couponCode: 'MAHMAY15',
        issuedAt: new Date('2026-06-12T00:00:00.000Z'),
        expiresAt: new Date('2026-08-31T23:59:59.000Z'),
        status: 'active',
      },
    ];

    for (const cp of coupons) {
      await Coupon.create(cp);
    }
    console.log('🎫 Coupons created');

    // 7. Create Rewards per Organization and Outlet
    const rewards = [
      {
        _id: 'reward_sim_1',
        profileId,
        organizationId: 'simmati',
        outletId: 'thiruvarur',
        rewardName: 'Free Simmati Cold Coffee',
        issuedAt: new Date('2026-06-15T12:00:00.000Z'),
        expiresAt: new Date('2026-08-15T12:00:00.000Z'),
        status: 'active',
      },
      {
        _id: 'reward_mah_1',
        profileId,
        organizationId: 'maharaja',
        outletId: 'maharaja_thiruvarur',
        rewardName: 'Free Maharaja Royal Lassi',
        issuedAt: new Date('2026-06-18T12:00:00.000Z'),
        expiresAt: new Date('2026-08-18T12:00:00.000Z'),
        status: 'active',
      },
    ];

    for (const rw of rewards) {
      await Reward.create(rw);
    }
    console.log('🏆 Rewards created');

    // 8. Create Top Products per Organization and Outlet
    await TopProduct.create({
      _id: 'prod_sim_1',
      profileId,
      organizationId: 'simmati',
      outletId: 'thiruvarur',
      productName: 'Paneer Tikka Masala',
      category: 'Main Course',
      orderCount: 8,
    });
    await TopProduct.create({
      _id: 'prod_mah_1',
      profileId,
      organizationId: 'maharaja',
      outletId: 'maharaja_thiruvarur',
      productName: 'Butter Chicken',
      category: 'Main Course',
      orderCount: 12,
    });
    console.log('🛒 Top Products created');

    // 9. Create Offers per Organization and Outlet
    const offers = [
      {
        title: 'Simmati Fest: Flat 30% Off',
        description: 'Enjoy delicious meals at Simmati outlets',
        discount: 30,
        discountType: 'percentage',
        bannerImage: '',
        featured: true,
        expiryDate: new Date('2026-08-31T23:59:59.000Z'),
        terms: ['Valid on Dine-in only'],
        category: 'food',
        brand: 'Simmati',
        isActive: true,
        organizationId: 'simmati',
        outletId: 'thiruvarur',
      },
      {
        title: 'Maharaja Feast: Buy 1 Get 1 Free',
        description: 'On all appetizers at Maharaja Thiruvarur',
        discount: 50,
        discountType: 'percentage',
        bannerImage: '',
        featured: true,
        expiryDate: new Date('2026-07-31T23:59:59.000Z'),
        terms: ['Valid on selective days'],
        category: 'food',
        brand: 'Maharaja',
        isActive: true,
        organizationId: 'maharaja',
        outletId: 'maharaja_thiruvarur',
      },
    ];

    for (const ofr of offers) {
      await Offer.create(ofr);
    }
    console.log('🎯 Offers created');

    // 10. Create Notifications per Organization and Outlet
    const notifications = [
      {
        customerId: profileId,
        organizationId: 'simmati',
        outletId: 'thiruvarur',
        type: 'reward',
        title: 'Points Earned at Simmati!',
        message: 'You earned 150 points for order #SIM-TH-101.',
        read: false,
        date: new Date('2026-06-28T14:35:00.000Z'),
      },
      {
        customerId: profileId,
        organizationId: 'maharaja',
        outletId: 'maharaja_thiruvarur',
        type: 'reward',
        title: 'Points Earned at Maharaja!',
        message: 'You earned 120 points for order #MAH-TH-401.',
        read: false,
        date: new Date('2026-06-27T19:35:00.000Z'),
      },
    ];

    for (const notif of notifications) {
      await Notification.create(notif);
    }
    console.log('🔔 Notifications created');

    console.log('\n🌱 Database seeded successfully with multi-tenant data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
