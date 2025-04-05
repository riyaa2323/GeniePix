import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Result from "./pages/Result";
import BuyCredit from "./pages/BuyCredit";
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import Login from "./components/Login";
import { AppContext } from "./context/AppContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";

const App = () => {
  const { showLogin } = useContext(AppContext);

  return (
    <div
      className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen"
      style={{
        backgroundImage: "url('/bg-img.jpg')", 

        backgroundSize: 'cover',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
      }}
    >
      <ToastContainer position="bottom-right" />
      <Navbar />
      {showLogin && <Login />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/buy" element={<BuyCredit />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
