import { Outlet } from "react-router-dom";
import NavBar from "./Shared/components/NavBar";
import Footer from "./Shared/components/Footer";
import MovetoTop from "./Shared/components/MovetoTop";
import ScrollToTop from "react-scroll-to-top";
function App() {
  return (
    <>
      <MovetoTop />
      <NavBar />
      <Outlet />
      <Footer />
      <ScrollToTop
        smooth
        className="scrollToTop-btn"
        width="25px"
        color="#fff"
      />
    </>
  );
}

export default App;
