import express from 'express';
import { 
  receiveMessage, 
  listMessages, 
  getMessage, 
  updateMessage, 
  deleteMessage,
  regenerateAI 
} from '../controllers/messageController.js';
import { sendReply, sendAIReply } from '../controllers/replyController.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Webhook endpoint - no auth required (n8n will POST here)
// In production, consider adding webhook signature verification
router.post('/', receiveMessage);

// Protected routes
router.get('/', requireAuth, listMessages);
router.get('/:id', requireAuth, getMessage);
router.patch('/:id', requireAuth, updateMessage);
router.delete('/:id', requireAuth, deleteMessage);
router.post('/:id/regenerate', requireAuth, regenerateAI);

// Reply endpoints
router.post('/:id/reply', requireAuth, sendReply);
router.post('/:id/reply-with-ai', requireAuth, sendAIReply);

export default router;
