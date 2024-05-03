import './App.css'
import GoLive from './pages/GoLive'
import Login from "./pages/Login";
import Navbar from './pages/Navbar';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Videouploads from './pages/Videouploads';
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
      {
        path: "/videouploads",
        element: <Videouploads />
      },
    ]
  }

])

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <Footer />

    </div >
  );
}

export default App;
