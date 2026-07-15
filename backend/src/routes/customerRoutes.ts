import { Router } from 'express';
import { CustomerController } from '../controllers/customerController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All customer routes are protected
router.use(authMiddleware);

// GET /api/customer/profile
router.get('/profile', CustomerController.getProfile);

// PUT /api/customer/profile
router.put('/profile', CustomerController.updateProfile);

// GET /api/customer/dashboard
router.get('/dashboard', CustomerController.getDashboard);

// GET /api/customer/rewards
router.get('/rewards', CustomerController.getRewards);

// GET /api/customer/purchases
router.get('/purchases', CustomerController.getPurchases);

// GET /api/customer/coupons
router.get('/coupons', CustomerController.getCoupons);

// GET /api/customer/offers
router.get('/offers', CustomerController.getOffers);

// GET /api/customer/notifications
router.get('/notifications', CustomerController.getNotifications);

// PATCH /api/customer/notifications/:id/read
router.patch('/notifications/:id/read', CustomerController.markNotificationRead);

// PATCH /api/customer/notifications/read-all
router.patch('/notifications/read-all', CustomerController.markAllNotificationsRead);

// GET /api/customer/organizations
router.get('/organizations', CustomerController.getOrganizations);

import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

// POST /api/customer/feedback
router.post('/feedback', upload.single('file'), CustomerController.submitFeedback);

export default router;
