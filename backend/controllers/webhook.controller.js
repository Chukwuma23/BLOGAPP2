import User from "../model/userModel.js";
import { Webhook } from 'svix';

export const clerkWebHook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("Webhook secret missing!");
    return res.status(500).json({ message: "Webhook secret not configured" });
  }
  // Add this at the beginning of your webhook function
console.log("📥 Webhook received");
console.log("Headers:", req.headers);
console.log("Event type from header:", req.headers['svix-id'] ? 'Present' : 'Missing');

  const payload = req.body;
  const headers = req.headers; // ✅ Fixed: use headers (plural)

  // Extract the Svix headers
  const svixId = headers['svix-id'];
  const svixTimestamp = headers['svix-timestamp'];
  const svixSignature = headers['svix-signature'];

  // If Svix headers are missing, return error
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Svix headers missing");
    return res.status(400).json({ message: "Svix headers missing" });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ message: "Webhook verification failed!" }); // ✅ Added return
  }

  console.log("Webhook event type:", evt.type);
  console.log("Webhook event data:", evt.data);

  try {
    if (evt.type === "user.created") {
      // ✅ Fixed email access and typo
      const email = evt.data.email_addresses?.[0]?.email_address;
      const username = evt.data.username || email?.split('@')[0] || `user_${evt.data.id}`;

      const newUser = new User({
        clerkUserId: evt.data.id,
        username: username,
        email: email, // ✅ Fixed typo and correct access
        image: evt.data.profile_image_url || evt.data.image_url || '', // ✅ Fixed field name
      });

      await newUser.save();
      console.log("✅ New user created in database:", newUser._id);
    }

    console.log("✅ Webhook processed successfully");
    return res.status(200).json({ message: "Webhook received and processed" });

  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return res.status(500).json({ 
      message: "Error processing webhook", 
      error: error.message 
    });
  }
};