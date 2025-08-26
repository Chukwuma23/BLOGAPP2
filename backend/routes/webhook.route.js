import express from 'express';
import { clerkWebHook } from '../controllers/webhook.controller.js';

const router = express.Router();

// Webhook route - no Clerk middleware here!
router.post('/', clerkWebHook);

export default router;


