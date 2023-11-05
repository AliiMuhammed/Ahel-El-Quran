import { Outlet } from "react-router-dom";
import NavBar from "./Shared/components/NavBar";
import Footer from "./Shared/components/Footer";

function App() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
