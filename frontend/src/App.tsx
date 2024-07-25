import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Components/Login/Login'
import Signup from './Components/Signup/Signup';
import CreateProduct from './Components/CreateProduct/CreateProduct';
import Search from './Components/Search/Search';
import ProductView from './Components/ProductView/ProductView';
import Home from './Components/Home/Home';

function App() {

  const router = createBrowserRouter([
    {
      path: "",
      element: <Home />
    },
    {
      path: "/search",
      element: <Search />
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
    },
    {
      path: "/products/:id",
      element: <ProductView />
    }
  ]);

  return (
    <div className="App" title='app'>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;