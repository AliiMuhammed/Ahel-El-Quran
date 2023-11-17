import { Outlet } from "react-router-dom";
import NavBar from "./Shared/components/NavBar";
import Footer from "./Shared/components/Footer";
import MovetoTop from "./Shared/components/MovetoTop";

function App() {
  return (
    <>
      <MovetoTop />
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
