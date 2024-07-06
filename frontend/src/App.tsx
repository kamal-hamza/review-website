import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Components/Login/Login'
import Signup from './Components/Signup/Signup';
import CreateProduct from './Components/CreateProduct/CreateProduct';

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
    },
    {
      path: "/create-product",
      element: <CreateProduct />
    }
  ]);

  return (
    <div className="App" title='app'>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;