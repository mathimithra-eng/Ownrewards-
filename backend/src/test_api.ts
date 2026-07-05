import mongoose from 'mongoose';
import { CustomerService } from './services/customerService';
import { env } from './config/env';

async function test() {
  await mongoose.connect(env.mongodbUri);
  console.log('Connected to MongoDB');

  const profileId = 'profileId';
  const accountId = 'accountId';
  const phone = '+919876543210';

  const dashboard = await CustomerService.getDashboard(profileId, accountId, phone);
  console.log('DASHBOARD RESULT:', JSON.stringify(dashboard.summary.customer, null, 2));

  const rewards = await CustomerService.getRewards(profileId);
  console.log('REWARDS RESULT:', JSON.stringify(rewards.summary, null, 2));

  await mongoose.disconnect();
}

test().catch(console.error);
