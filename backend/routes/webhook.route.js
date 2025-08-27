import express from 'express';
import { clerkWebHook } from '../controllers/webhook.controller.js';
import bodyParser from 'body-parser';

const router = express.Router();

// Webhook route - no Clerk middleware here!
router.post('/clerk',bodyParser.raw({type: 'application/json'}), clerkWebHook);

export default router;


