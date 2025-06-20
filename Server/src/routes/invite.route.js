// routes/inviteRoutes.ts or similar
import express from 'express';
import { sendInvite, acceptInvite, getInviteInfo } from '../controllers/invite.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', sendInvite); // owner sends invite
router.get('/:token', getInviteInfo);       // frontend fetches invite info
router.post('/accept/:token', protectRoute, protectRoute, acceptInvite); // logged in user accepts invite

export default router;
