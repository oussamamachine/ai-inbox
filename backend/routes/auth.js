import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// The stricter auth limiter is applied only to the write endpoints.
// Profile fetches are protected by JWT, so they don't need the same throttle.
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/profile', requireAuth, getProfile);

export default router;
