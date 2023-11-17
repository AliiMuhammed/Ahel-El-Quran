import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AboutUs from "./Pages/About Us/AboutUs";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/aboutUs",
        element: <AboutUs />,
      },
    ],
    errorElement: <NotFound />,
  },
]);
