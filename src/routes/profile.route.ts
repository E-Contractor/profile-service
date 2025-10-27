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


// router.put(
//   '/user/:userId/status',
//   serviceAuthMiddleware,
//   ProfileController.updateUserStatusController
// );

// Client routes (protected by JWT)
// router.get(
//   '/me/client',
//   authMiddleware,
//   ProfileController.getMyClientProfileController
// );
// router.patch(
//   '/me/client',
//   authMiddleware,
//   ProfileController.updateClientProfileController
// );
// router.get(
//   '/me/client/status',
//   authMiddleware,
//   ProfileController.getClientCompletionController
// );

// Contractor routes (protected by JWT)
// router.get(
//   '/me/contractor',
//   authMiddleware,
//   ProfileController.getMyContractorProfileController
// );


// Profile completion route
// router.get(
//   '/completion/:userId/:role',
//   serviceAuthMiddleware,
//   ProfileController.getCompletionController
// );

export default router;
