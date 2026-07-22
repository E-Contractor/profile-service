import express from 'express';
import { authMiddleware, serviceAuthMiddleware } from '../middleware/profile.middleware';
import * as ProfileController from '../controllers/profile.controller';

const router = express.Router();

router.post(
  '/internal/match-contractors',
  serviceAuthMiddleware,
  ProfileController.matchContractorsController
);

router.post('/client', ProfileController.createClientProfileController);
router.post('/contractor', ProfileController.createContractorProfileController);

router.get('/contractor/featured', ProfileController.getFeaturedContractorsController);
router.get('/stats/breakdown', ProfileController.getStatsBreakdownController);

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

router.get('/me/portfolio', authMiddleware, ProfileController.getMyPortfolioController);
router.post('/me/portfolio', authMiddleware, ProfileController.addPortfolioItemController);
router.patch('/me/portfolio/:itemId', authMiddleware, ProfileController.updatePortfolioItemController);
router.delete('/me/portfolio/:itemId', authMiddleware, ProfileController.deletePortfolioItemController);

router.get(
  '/contractor/:userId/portfolio',
  authMiddleware,
  ProfileController.getPortfolioByUserIdController
);

router.get(
  '/:role/:userId',
  authMiddleware,
  ProfileController.getProfileController
);

export default router;
