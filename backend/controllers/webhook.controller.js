
import User from "../model/userModel.js";
import { Webhook } from 'svix';
export const clerkWebHook = async (req, res) => {
  // Handle webhook events
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Error('Webhook secret not configured');
  }

  const payload = req.body;
    const headers = req.headers;

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;
    try {
        evt = wh.verify(payload, headers);
    } catch (err) {
        res.status(400).json({
            message: "webhook verification failed!"
        });
         return;
    }
    console.log('Webhook event received:', evt);
    if ( evt.type === "user.created") {
    // Handle the verified webhook message
    try {
      const newUser = new User({
        clerkUserId: evt.data.id,
        username: evt.data.username || evt.data.email_addresses[0].email_address,
        email: evt.data.email_addresses[0].email_address,
        image: evt.data.profile_image_url,
      });
      await newUser.save();
      console.log('New user saved:', newUser);
      res.status(201).json({ message: 'User created', user: newUser });
    } catch (err) {
      console.error('Error saving user:', err);
      return res.status(500).json({ message: 'Error saving user', error: err.message });
    }
  } else {
    return res.status(200).json({ message: 'Webhook received, no user created.' });
  }
};



