import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AboutUs from "./Pages/About Us/AboutUs";
export const routes = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        path: "/aboutUs",
        element: <AboutUs />,
      },
    ],
  },
]);
