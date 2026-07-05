import mongoose from 'mongoose';
import { env } from './config/env';
import { Account, Profile, Transaction, RewardLedger } from './models';

async function check() {
  await mongoose.connect(env.mongodbUri);
  console.log('Connected to MongoDB');
  
  const profiles = await Profile.find({});
  console.log('PROFILES:', JSON.stringify(profiles, null, 2));
  
  const ledgers = await RewardLedger.find({});
  console.log('LEDGERS:', JSON.stringify(ledgers, null, 2));

  const accounts = await Account.find({});
  console.log('ACCOUNTS:', JSON.stringify(accounts, null, 2));

  const txns = await Transaction.find({});
  console.log('TRANSACTIONS COUNT:', txns.length);
  
  await mongoose.disconnect();
}

check().catch(console.error);
