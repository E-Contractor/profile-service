import express from 'express';
import { authMiddleware } from '../middleware/profile.middleware';
import * as ProfileController from '../controllers/profile.controller';

const router = express.Router();

router.post('/client', ProfileController.createClientProfileController);
router.post('/contractor', ProfileController.createContractorProfileController);

router.get(
  '/contractor/search',
  authMiddleware,
  ProfileController.searchContractorsController
);

router.get(
  '/me',
  authMiddleware,
  ProfileController.getMeController
);

router.patch(
  '/me',
  authMiddleware,
  ProfileController.updateMeController
);

router.patch(
  '/client',
  authMiddleware,
  ProfileController.updateClientProfileController
);

router.patch(
  '/contractor',
  authMiddleware,
  ProfileController.updateContractorProfileController
);
router.get(
  '/me/contractor/status',
  authMiddleware,
  ProfileController.getContractorCompletionController
);

router.get(
  '/:role/:userId',
  authMiddleware,
  ProfileController.getProfileController
);

export default router;
