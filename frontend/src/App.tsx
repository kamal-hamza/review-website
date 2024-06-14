import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Components/Login/Login'
import Signup from './Components/Signup/Signup';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello, World</div>
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;