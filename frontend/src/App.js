import React from 'react';
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/login';
import Calculadora from './pages/Calculadora';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login/>,
    },
    {
      path: "/calculadora",
      element: <Calculadora/>,
    },
    
  ]);
  
  
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      
          <RouterProvider router={router} />
       
    </React.StrictMode>
  );
}

export default App;
