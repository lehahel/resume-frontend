import "./styles/main.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/homes/Home";
import Creater from "./pages/creater/Creater";
import AboutSite from "./pages/about/AboutSite";
import Auth from "./pages/authh/Auth";
import "./pages/homes/Home.css";
import "./components/navbar/style.css";
import "./components/footer/footer__style.css";
import ThemeSelection from "./pages/themess/ThemeSelection";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoot";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/themess" element={<ThemeSelection />} />
              <Route element={<PrivateRoute />}>
                <Route path="/create" element={<Creater />} />
              </Route>
              <Route path="/about" element={<AboutSite />} />
              <Route path="/authh" element={<Auth />} />
              <Route path="*" element={<h2>Страница не найдена</h2>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
