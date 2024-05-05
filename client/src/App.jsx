import './App.css'
import GoLive from './pages/GoLive'
import Login from "./pages/Login";
import Navbar from './pages/Navbar';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
// import EventDetails from './EventDetails';
// import CreateEvent from './CreateEvent';
// import Wellcome from './pages/Wellcome';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Videouploads from './pages/Videouploads';
import { Platforms } from './pages/Platforms';
import { useState } from 'react';
// import Dashboard from './Dashboard';
// import CalendarCallback from './CalendarCalback';
// import Footer from './pages/Footer';

const router = createBrowserRouter([

  {
    path: '/',
    element: <Navbar />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        index: true,
        element: <Login />,
      },
      {
        path: '/wellcome',
        element: <Home />
      },
      {
        path: 'golive',
        element: <GoLive />
      },
      // {
      //   path: "/:user/createEvent",
      //   element: <CreateEvent />
      // },
      // {
      //   path: "/dashboard/:user",
      //   element: <Dashboard />
      // },
      {
        path: "/videouploads",
        element: <Videouploads />
      },
      // {
      //   path: '/calendar/google/callback',
      //   element: <CalendarCallback />
      // },
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


  return (
    <div className="App">
      <RouterProvider router={router} />
      {/* <Footer /> */}

    </div >
  );
}

export default App;
