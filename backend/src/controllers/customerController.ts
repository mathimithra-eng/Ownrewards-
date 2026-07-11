import { Request, Response } from 'express';
import { CustomerService } from '../services/customerService';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../middlewares/errorHandler';
import { AuthRequest } from '../middlewares/authMiddleware';
import { Organization, Outlet, RewardLedger } from '../models';

export class CustomerController {
  // ─────────────────────────────────────────
  // GET /api/customer/profile
  // ─────────────────────────────────────────
  static getProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const profileId = req.customer!.profileId;
    const { organizationId, outletId } = req;
    const profile = await CustomerService.getProfile(profileId, organizationId, outletId);
    ApiResponse.success(res, 'Profile fetched successfully', profile);
  });

  // ─────────────────────────────────────────
  // GET /api/customer/dashboard
  // ─────────────────────────────────────────
  static getDashboard = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { profileId, accountId, phone } = req.customer!;
    const { organizationId, outletId } = req;
    const dashboard = await CustomerService.getDashboard(profileId, accountId, phone, organizationId, outletId);
    ApiResponse.success(res, 'Dashboard data fetched successfully', dashboard);
  });

  // ─────────────────────────────────────────
  // GET /api/customer/rewards
  // ─────────────────────────────────────────
  static getRewards = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const profileId = req.customer!.profileId;
    const { organizationId, outletId } = req;
    const rewards = await CustomerService.getRewards(profileId, organizationId, outletId);
    ApiResponse.success(res, 'Rewards fetched successfully', rewards);
  });

  // ─────────────────────────────────────────
  // GET /api/customer/purchases
  // ─────────────────────────────────────────
  static getPurchases = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const profileId = req.customer!.profileId;
    const { organizationId, outletId } = req;
    const purchases = await CustomerService.getPurchases(profileId, organizationId, outletId);
    ApiResponse.success(res, 'Purchases fetched successfully', purchases);
  });

  // ─────────────────────────────────────────
  // GET /api/customer/coupons
  // ─────────────────────────────────────────
  static getCoupons = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const accountId = req.customer!.accountId;
    const { organizationId, outletId } = req;
    const coupons = await CustomerService.getCoupons(accountId, organizationId, outletId);
    ApiResponse.success(res, 'Coupons fetched successfully', coupons);
  });

  // ─────────────────────────────────────────
  // GET /api/customer/offers
  // ─────────────────────────────────────────
  static getOffers = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { organizationId, outletId } = req;
    const offers = await CustomerService.getOffers(organizationId, outletId);
    ApiResponse.success(res, 'Offers fetched successfully', offers);
  });

  // ─────────────────────────────────────────
  // GET /api/customer/notifications
  // ─────────────────────────────────────────
  static getNotifications = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const profileId = req.customer!.profileId;
    const { organizationId, outletId } = req;
    const notifications = await CustomerService.getNotifications(profileId, organizationId, outletId);
    ApiResponse.success(res, 'Notifications fetched successfully', notifications);
  });

  // ─────────────────────────────────────────
  // PATCH /api/customer/notifications/:id/read
  // ─────────────────────────────────────────
  static markNotificationRead = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const profileId = req.customer!.profileId;
    const { id } = req.params;
    const notification = await CustomerService.markNotificationRead(id as string, profileId);
    if (!notification) {
      ApiResponse.notFound(res, 'Notification not found');
      return;
    }
    ApiResponse.success(res, 'Notification marked as read', notification);
  });

  // ─────────────────────────────────────────
  // PATCH /api/customer/notifications/read-all
  // ─────────────────────────────────────────
  static markAllNotificationsRead = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const profileId = req.customer!.profileId;
    await CustomerService.markAllNotificationsRead(profileId);
    ApiResponse.success(res, 'All notifications marked as read');
  });

  // ─────────────────────────────────────────
  // PUT /api/customer/profile
  // ─────────────────────────────────────────
  static updateProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const profileId = req.customer!.profileId;
    const { name, email, dob } = req.body;

    const updated = await CustomerService.updateProfile(profileId, { name, email, dob });
    if (!updated) {
      ApiResponse.notFound(res, 'Customer not found');
      return;
    }
    ApiResponse.success(res, 'Profile updated successfully', updated);
  });

  // ─────────────────────────────────────────
  // GET /api/customer/organizations
  // ─────────────────────────────────────────
  static getOrganizations = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const profileId = req.customer!.profileId;

    // Get all ledgers for this profile to find their orgs/outlets
    const ledgers = await RewardLedger.find({ profileId });
    const uniqueOrgIds = Array.from(new Set(ledgers.map(l => l.organizationId)));
    const uniqueOutletIds = Array.from(new Set(ledgers.map(l => l.outletId)));

    const [organizations, outlets] = await Promise.all([
      Organization.find({ _id: { $in: uniqueOrgIds }, isActive: true }),
      Outlet.find({ _id: { $in: uniqueOutletIds }, isActive: true }),
    ]);

    let totalOrganizations = organizations.length;
    let totalOutlets = 0;

    const mappedOrgs = organizations.map(org => {
      // Find ledgers belonging to this org
      const orgLedgers = ledgers.filter(l => l.organizationId === org._id);
      
      const orgOutlets = outlets
        .filter(o => o.organizationId === org._id)
        .map(o => {
          totalOutlets++;
          const ledger = orgLedgers.find(l => l.outletId === o._id);
          return {
            outletId: o._id,
            outletName: o.name,
            location: o.location || '',
            customerId: profileId,
            tier: ledger ? ledger.tier : 'Member',
            points: ledger ? ledger.points : 0,
            lastVisit: ledger && ledger.lastVisit ? ledger.lastVisit.toISOString() : null
          };
        });
        
      const totalOrgPoints = orgLedgers.reduce((acc, curr) => acc + curr.points, 0);

      return {
        organizationId: org._id,
        organizationName: org.name,
        logoUrl: org.logoUrl || '',
        industry: org.industry || '',
        totalOrgPoints,
        outlets: orgOutlets,
      };
    });

    const responseData = {
      summary: {
        totalOrganizations,
        totalOutlets
      },
      organizations: mappedOrgs
    };

    ApiResponse.success(res, 'Organizations and outlets fetched successfully', responseData);
  });
}
