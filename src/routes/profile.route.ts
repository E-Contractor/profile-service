import express from 'express';
import { authMiddleware } from '../middleware/profile.middleware';
import * as ProfileController from '../controllers/profile.controller';

const router = express.Router();

router.post('/client', ProfileController.createClientProfileController);
router.post('/contractor', ProfileController.createContractorProfileController);

// Public — no auth required (used by homepage for guests)
router.get('/contractor/featured', ProfileController.getFeaturedContractorsController);

router.get(
  '/contractor/search',
  authMiddleware,
  ProfileController.searchContractorsController
);

router.get(
  '/contractor/search/pcab',
  authMiddleware,
  ProfileController.searchPcabContractorsController
);

router.get(
  '/contractor/search/non-pcab',
  authMiddleware,
  ProfileController.searchNonPcabContractorsController
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

router.post('/me/portfolio', authMiddleware, ProfileController.addPortfolioItemController);
router.patch('/me/portfolio/:itemId', authMiddleware, ProfileController.updatePortfolioItemController);
router.delete('/me/portfolio/:itemId', authMiddleware, ProfileController.deletePortfolioItemController);

router.get(
  '/:role/:userId',
  authMiddleware,
  ProfileController.getProfileController
);

export default router;
