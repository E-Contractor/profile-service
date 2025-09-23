import express from 'express';
import {
  authMiddleware,
  serviceAuthMiddleware,
} from '../middleware/profile.middleware';
import * as ProfileController from '../controllers/profile.controller';

const router = express.Router();

// Service-to-service routes
router.post(
  '/profiles/client',
  serviceAuthMiddleware,
  ProfileController.createClientProfileController
);
router.post(
  '/profiles/contractor',
  serviceAuthMiddleware,
  ProfileController.createContractorProfileController
);
router.get(
  '/profiles/:role/:userId',
  serviceAuthMiddleware,
  ProfileController.getProfileController
);
router.put(
  '/profiles/user/:userId/status',
  serviceAuthMiddleware,
  ProfileController.updateUserStatusController
);

// Client routes (protected by JWT)
router.get(
  '/client/profile',
  authMiddleware,
  ProfileController.getMyClientProfileController
);
router.patch(
  '/client/profile',
  authMiddleware,
  ProfileController.updateClientProfileController
);
router.get(
  '/client/completion',
  authMiddleware,
  ProfileController.getClientCompletionController
);

// Contractor routes (protected by JWT)
router.get(
  '/contractor/profile',
  authMiddleware,
  ProfileController.getMyContractorProfileController
);
router.patch(
  '/contractor/profile',
  authMiddleware,
  ProfileController.updateContractorProfileController
);
router.get(
  '/contractor/completion',
  authMiddleware,
  ProfileController.getContractorCompletionController
);

// Public contractor search
router.get(
  '/contractors/search',
  ProfileController.searchContractorsController
);

router.get('/contractor/:userId', ProfileController.getContractorById);

// Profile completion route
router.get(
  '/completion/:userId/:role',
  serviceAuthMiddleware,
  ProfileController.getCompletionController
);

export default router;
