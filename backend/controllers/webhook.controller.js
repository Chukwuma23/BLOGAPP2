
import User from "../model/userModel.js";
import { Webhook } from 'svix';

export const clerkWebHook = async (req, res) => {
  console.log('=== WEBHOOK RECEIVED ===');
  console.log('Headers:', JSON.stringify(req.headers));
  
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('❌ Webhook secret not configured');
    return res.status(500).json({ message: 'Webhook secret not configured' });
  }

  // Get the raw body
  const payload = req.body.toString();
  const headers = {
    'svix-id': req.headers['svix-id'],
    'svix-timestamp': req.headers['svix-timestamp'],
    'svix-signature': req.headers['svix-signature']
  };

  console.log('Raw payload length:', payload.length);
  console.log('Svix headers:', headers);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(payload, headers);
    console.log('✅ Webhook verified successfully:', evt.type);
  } catch (err) {
    console.error('❌ Webhook verification failed:', err.message);
    return res.status(400).json({ message: "Webhook verification failed!" });
  }

  console.log('Event type:', evt.type);

  if (evt.type === "user.created") {
    try {
      console.log('User data received:', JSON.stringify(evt.data, null, 2));

      // Check if user already exists
      const existingUser = await User.findOne({ clerkUserId: evt.data.id });
      if (existingUser) {
        console.log('✅ User already exists in DB:', existingUser._id);
        return res.status(200).json({ message: 'User already exists' });
      }

      const email = evt.data.email_addresses?.[0]?.email_address;
      const username = evt.data.username || (email ? email.split('@')[0] : `user_${evt.data.id.slice(0, 8)}`);

      console.log('Creating user with:', { 
        clerkUserId: evt.data.id, 
        email, 
        username 
      });

      if (!email) {
        console.warn('⚠️ No email found for user:', evt.data.id);
        return res.status(400).json({ message: 'Email is required' });
      }

      const newUser = new User({
        clerkUserId: evt.data.id,
        username: username,
        email: email,
        image: evt.data.profile_image_url || "",
      });

      const savedUser = await newUser.save();
      console.log('✅ New user saved successfully to DB:', savedUser._id);
      return res.status(201).json({ 
        message: 'User created', 
        user: {
          id: savedUser._id,
          clerkUserId: savedUser.clerkUserId,
          username: savedUser.username,
          email: savedUser.email
        }
      });

    } catch (err) {
      console.error('❌ Error saving user to DB:', err);
      
      if (err.code === 11000) {
        console.error('Duplicate key error:', err.keyValue);
        return res.status(409).json({ 
          message: 'User already exists with this email or username',
          error: err.message 
        });
      }
      
      return res.status(500).json({ 
        message: 'Error saving user', 
        error: err.message 
      });
    }
  }

  console.log('No action taken for event type:', evt.type);
  return res.status(200).json({ message: 'Webhook received, no action taken' });
};