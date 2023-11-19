import { Outlet } from "react-router-dom";
import NavBar from "./Shared/components/NavBar";
import Footer from "./Shared/components/Footer";
import MovetoTop from "./Shared/components/MovetoTop";
import ScrollToTop from "react-scroll-to-top";
import { Provider } from "react-redux";
import store from "./store";
function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
