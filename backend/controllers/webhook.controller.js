
import User from "../model/userModel.js";
import { Webhook } from 'svix';

export const clerkWebHook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if(!WEBHOOK_SECRET) {
 throw new Error("webhook secret needed!");
  }
  const payload = req.body;
  const header = req.header;

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;
  try {
    evt = wh.verify(payload, header);
  } catch(err) {
    console.log("webhook verification failed!");
res.status(400).json({ message: "webhook verification failed!"})
  }

  console.log(evt.data)

  if(evt.type === "user.created") {
    const newUser = new User({
      clerkUserId : evt.data.id,
      username: evt.data.username || evt.data.email_addresses[0].email_addresses,
      eamil: evt.data.email_addresses[0].email_addresses,
      image: evt.data.profile_img_url,
    });
    await newUser.save();
  }
  console.log("webhook received");
  return res.status(200).json({message: "webhook received"});
};