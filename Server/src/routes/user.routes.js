import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateAccountDetails,
  changeCurrentPassword,
  updateAvatar,
  updateCoverImage,
} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

// Auth routes (no auth middleware)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);

// Protected routes
router.use(verifyJWT);

router.post('/logout', logoutUser);
router.get('/current-user', getCurrentUser);
router.patch('/update-account', updateAccountDetails);
router.post('/change-password', changeCurrentPassword);
router.patch('/avatar', upload.single('avatar'), updateAvatar);
router.patch('/cover-image', upload.single('coverImage'), updateCoverImage);

export { router };