import express from 'express';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
import commentRoute from './routes/commentRoute.js';
import postsRoute from './routes/postsRoute.js';
import connectDB from './lib/connentDB.js';
import webhookRoute from './routes/webhook.route.js';
import {clerkMiddleware, requireAuth} from '@clerk/express';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Enable CORS
app.use(clerkMiddleware()); // Middleware for Clerk authentication
app.use('/webhook', webhookRoute); // Assuming webhookRoute.js is the route for handling webhooks
app.use(express.json()); // Middleware to parse JSON bodies

// Example route to demonstrate Clerk authentication
app.get('/auth-state', (req, res) => {
  const authState = req.auth(); // Access the auth state from the request
  if (!authState || !authState.userId) {
    return res.status(401).json(authState);
  }
  res.json(authState);
});
//protected route example
//app.get('/protected', clerkMiddleware(), (req, res) => {
  //const {userId} = req.auth();
  //if (!userId) {
   // return res.status(401).json({ message: "You are not authenticated" });
  //}
  //res.status(200).json({ message: "You have accessed this protected route" });
//});


//protected route example2
app.get('/protected2', requireAuth(), (req, res) => {
 
  res.status(200).json({ message: "You have accessed this protected route" });
});

// Middleware to handle CORS
app.use('/users', userRoute);
app.use("/comments", commentRoute); // Assuming commentRoute.js is similar to userRoute.js
app.use("/posts", postsRoute); // Assuming postRoute.js is similar to userRoute.js
app.use((error, req, res, next) => {
  res.json({
     message: error.message || 'An error has occurred!',
      status: error.status || 500,
      stack: process.env.NODE_ENV === 'development' ? error.stack : {}
    });
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*'); // Allow all origins
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//app.get('/test', (req, res) => {
//  res.status(200).send('Hello World!');
//});

//console.log(process.env.test); // This will log the value of the 'test' variable from .env file
const port = process.env.PORT || 2345; 

app.listen(port, '0.0.0.0', () => { // ✅ Add '0.0.0.0' as second parameter
  connectDB(); // Connect to MongoDB
  console.log('Connected to MongoDB');
  console.log(`Server is running on port ${port}`);
});