import { Children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import HomePage from './Routes/HomePage.jsx';
import PostListPage from './Routes/PostListPage.jsx'; // Fixed typo in filename
import Write from './Routes/Write.jsx';
import LoginPage from './Routes/LoginPage.jsx';
import ErrorPage from './Routes/ErrorPage.jsx'; // Add an error page
import RegisterPage from './Routes/RegisterPage.jsx';
import SinglePostPage from './Routes/SinglePostPage.jsx';
import Layout from './Layout.jsx';
import { ClerkProvider } from '@clerk/clerk-react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient()

//import _ from 'lodash';
//window._ = _; // Make it globally available

//import PostDetailPage from './Routes/PostDetailPage.jsx'; // Example of dynamic route


// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
const router = createBrowserRouter([
  {
    element: <Layout />,
  children:[
    {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage /> // Add error handling
  },
  {
    path: "/posts",
    element: <PostListPage />,
  },
  {
    path: "/register", // Dynamic route example
    element: <RegisterPage/>
  },
  {
    path: "/write",
    element: <Write />
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/:slug",
    element: <SinglePostPage />,
  },
  {
    path: "*", // Catch-all 404 route
    element: <ErrorPage status={404} />
  }
]
}
]);

createRoot(document.getElementById('root')).render(
 <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer position='top-right'/>
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>
);