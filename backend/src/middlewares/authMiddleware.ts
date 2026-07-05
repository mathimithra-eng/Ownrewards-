import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiResponse } from '../utils/apiResponse';
import { Profile } from '../models/Profile';
import { Account } from '../models/Account';
import { RewardLedger } from '../models/RewardLedger';

export interface AuthRequest extends Request {
  customer?: {
    id: string;
    profileId: string;
    accountId: string;
    phone: string;
    name: string;
  };
  organizationId?: string;
  outletId?: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ApiResponse.unauthorized(res, 'Access token is required');
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      ApiResponse.unauthorized(res, 'Invalid token format');
      return;
    }

    const decoded = jwt.verify(token, env.jwtSecret) as {
      userId: string;
      profileId: string;
      accountId: string;
      phone: string;
      role: string;
    };

    const profile = await Profile.findById(decoded.profileId).select('name isActive');
    const account = await Account.findById(decoded.accountId).select('phoneNo isActive');

    if (!profile || !profile.isActive || !account || !account.isActive) {
      ApiResponse.unauthorized(res, 'Account or Profile not found or deactivated');
      return;
    }

    req.customer = {
      id: profile._id.toString(),
      profileId: profile._id.toString(),
      accountId: account._id.toString(),
      phone: account.phoneNo,
      name: profile.name,
    };

    // Extract tenant context from headers or query params
    let organizationId = (req.headers['x-organization-id'] || req.query.organizationId) as string;
    let outletId = (req.headers['x-outlet-id'] || req.query.outletId) as string;

    // Fallback to first ledger if not provided
    if (!organizationId) {
      const firstLedger = await RewardLedger.findOne({ profileId: profile._id }).sort({ _id: 1 });
      if (firstLedger) {
        organizationId = firstLedger.organizationId;
        outletId = firstLedger.outletId || '';
      } else {
        organizationId = 'simmati';
        outletId = 'thiruvarur';
      }
    }

    req.organizationId = organizationId;
    req.outletId = outletId || '';

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      ApiResponse.unauthorized(res, 'Token has expired');
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      ApiResponse.unauthorized(res, 'Invalid token');
      return;
    }
    ApiResponse.error(res, 'Authentication failed');
  }
};
