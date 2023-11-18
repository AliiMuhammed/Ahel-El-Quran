import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AboutUs from "./Pages/About Us/AboutUs";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import Live from "./Pages/Live Tv/Live";
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
      {
        path: "/live",
        element: <Live />,
      },
    ],
    errorElement: <NotFound />,
  },
]);
