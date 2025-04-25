// import Authenticator from "./components/Authenticator";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from "./components/HomePage";
import Admin from "./components/Admin";

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage/>
    }, 
    {
      path: '/admin',
      element: <Admin/>
    }
  ]);

  return (
    <>
      <div className="bg-zinc-900 w-full overflow-hidden">
        <RouterProvider router = {router}/>
      </div>
    </>
  )
}

export default App
