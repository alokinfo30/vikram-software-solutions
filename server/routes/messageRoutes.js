// server/routes/messageRoutes.js
import express from 'express';
const router = express.Router();
import {
  sendMessage,
  getMessages,
  getConversations,
  markAsRead,
  getUnreadCount,
  deleteMessage
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

// All routes are protected
router.use(protect);

router.get('/conversations', getConversations);
router.get('/unread/count', getUnreadCount);
router.post('/', sendMessage);
router.get('/:userId', getMessages);
router.put('/:messageId/read', markAsRead);
router.delete('/:messageId', deleteMessage);

export default router;