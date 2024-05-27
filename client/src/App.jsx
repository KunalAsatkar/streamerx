import './App.css'
import GoLive from './pages/GoLive'
import Login from "./pages/Login";
import Navbar from './pages/Navbar';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Videouploads from './pages/Videouploads';
import { Platforms } from './pages/Platforms';
import { useEffect } from 'react';
import Footer from './pages/Footer';

function App() {
  useEffect(() => {
    // Cleanup function to remove expired tokens from localStorage
    const tokenExpiryString = localStorage.getItem('token_expiry');
    if (tokenExpiryString) {
      const tokenExpiry = new Date(tokenExpiryString);
      const currentTime = new Date();
      if (currentTime >= tokenExpiry) {
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('userId');
        localStorage.removeItem('fname');
        localStorage.removeItem('token_expiry');
      }
    }
  }, []); // Run once when component mounts


  const isAuthenticated = localStorage.getItem('jwt_token');
  const router = createBrowserRouter([

    {
      path: '/',
      element: <Navbar />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          index: true,
          element: isAuthenticated ? <Home /> : <Login />,
        },
        {
          path: '/wellcome',
          element: isAuthenticated ? <Home /> : <Navigate to='/' />,
        },
        {
          path: 'golive',
          element: isAuthenticated ? <GoLive /> : <Navigate to='/' />,
        },
        {
          path: "/videouploads",
          element: isAuthenticated ? <Videouploads /> : <Navigate to='/' />,
        },
        {
          path: '/platform',
          element: isAuthenticated ? <Platforms /> : <Navigate to='/' />,
        }
      ]
    }
  
  ])

  return (
    <div className="App">
      <RouterProvider router={router} />
      <Footer />
    </div>
  );
}

export default App;
