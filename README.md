BLOGAPP2

A modern, responsive blog platform built with
( React with vite, Node.js, MongoDB, tailwind css.)
This project allows users to read, create, and engage with blog 
content through an intuitive interface.



🚀 Live Demo
link: https://chuksblogapp.netlify.app/

View Live Demo

📋 Table of Contents

· Features
· Tech Stack
· Installation
· Usage
· API Endpoints
· Folder Structure
· Future Improvements
· Contact

✨ Features

· ✅ User authentication (signup/login)
· ✅ Create, read, update, and delete blog posts
· ✅ Rich text editor for writing posts
· ✅ Comment system for reader engagement
· ✅ Responsive design for mobile and desktop
· ✅ Search and filter posts by category/tags
· ✅ User profile pages

🛠️ Tech Stack

Frontend:

· React.js
· Tailwind CSS
· React Router for navigation
· clerk auth integration for authentication 
. Toast for notifications bars
. Quill for post creations.
imagekit for uploading image, lazy loading etc

Backend:

· Node.js with Express.js
· Python 
· RESTful API architecture

Database:

· MongoDB / MySQL

Tools:

· Git & GitHub
· Netlify for frontend deployment
· Render for backend deployment
. postman for API testing

💻 Installation

Prerequisites

· Node.js (v14 or higher)
· npm or yarn
· MongoDB / MySQL installed locally or cloud instance

Steps

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/your-blog-repo.git
   cd your-blog-repo
   ```
2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```
3. Set up environment variables
   Create a .env file in the backend folder:
   ```
   PORT=5000
   MONGODB_URI=your_database_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```
5. Run the application
   ```bash
   # Backend (from backend folder)
   npm start
   
   # Frontend (from frontend folder in new terminal)
   npm start
   
6. Open your browser
   Navigate to http://localhost:3000

📱 Usage

1. Register a new account or login with existing credentials
2. View blog posts on the homepage
3. Click "Create Post" to write and publish new content
4. Comment on posts to engage with other users
5. Visit user profiles to see their published posts

🔌 API Endpoints

Method Endpoint Description
POST /api/auth/register Register new user
POST /api/auth/login Login user
GET /api/posts Get all posts
GET /api/posts/:id Get single post
POST /api/posts Create new post
PUT /api/posts/:id Update post
DELETE /api/posts/:id Delete post
POST /api/posts/:id/comments Add comment

📁 Folder Structure


blog-project/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
└── README.md


🚧 Future Improvements

· Implement dark mode
· Add email notifications for new comments
· Create admin dashboard
· Add social media sharing buttons

🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a new branch (git checkout -b feature/improvement)
3. Commit your changes (git commit -m 'Add new feature')
4. Push to the branch (git push origin feature/improvement)
5. Open a Pull Request

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

📬 Contact

Chukwuma Isaac Kalu

· Email: chukstechservice23@gmail.com
· GitHub: @chukwuma23
· LinkedIn: https://www.linkedin.com/in/chukwuma-kalu-120494261?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app
· Portfolio: https://chukwumakaluwebsiteportfolio.netlify.app/


⭐ If you found this project helpful, please consider giving it a star on GitHub!
