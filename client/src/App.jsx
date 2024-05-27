import './App.css'
import GoLive from './pages/GoLive'
import Login from "./pages/Login";
import Navbar from './pages/Navbar';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Videouploads from './pages/Videouploads';
import { Platforms } from './pages/Platforms';
import { useState } from 'react';
import Footer from './pages/Footer';

const router = createBrowserRouter([

  {
    path: '/',
    element: <Navbar />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        index: true,
        element: window.localStorage.getItem('jwt_token') ? <Home /> : <Login />,
      },
      {
        path: '/wellcome',
        element: <Home />
      },
      {
        path: 'golive',
        element: <GoLive />
      },
      {
        path: "/videouploads",
        element: <Videouploads />
      },
      {
        path: '/platform',
        element: <Platforms />
      }
    ]
  }

])

function App() {
  // const localstorage = window.localStorage();
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const token_expiry = new Date(localStorage.getItem('token_expiry'));
  const currentTime = new Date();
  if(currentTime >= token_expiry) {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fname');
    localStorage.removeItem('token_expiry');
  }

  // username	rutujp78	
  // email	panbuderutuj6@gcoea.ac.in	
  // jwt_token	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NDIwNTA1NjAyM2UzY2I4ZmYxMWZiMSIsImVtYWlsIjoicGFuYnVkZXJ1dHVqNkBnY29lYS5hYy5pbiIsImlhdCI6MTcxNjExNjgyMiwiZXhwIjoxNzE2MjAzMjIyfQ.4m7ZC0_A2rWhg_qZWuprDjsFeVXr6XQ-uobRam48Tgg	
  // userId	664205056023e3cb8ff11fb1	
  // fname	Rutuj


  return (
    <div className="App">
      <RouterProvider router={router} />
      <Footer />
    </div>
  );
}

export default App;
