import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/users/me - Get current user profile
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/users/me - Update current user profile
router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    await user.save();

    res.json({ 
      message: 'Profile updated successfully',
      data: { id: user._id, email: user.email, name: user.name }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
