import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { assets } from "../assets/assets"; // Import icons

const Login = () => {
  const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle login/signup form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (state === "Login") {
        response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
      } else {
        response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
      }

      const { data } = response;
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        setShowLogin(false);
        toast.success(state === "Login" ? "Login successful!" : "Account created successfully!");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error, try again!");
    }
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 right-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-neutral-700 text-2xl font-medium">
          {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>

        {state !== "Login" && (
          <div className="border px-5 py-2 flex items-center gap-1 rounded-full mt-5">
            <img className="w-5" src={assets.profile_icon} alt="Profile" />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="outline-none text-sm"
              type="text"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        <div className="border px-5 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.email_icon} alt="Email" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="outline-none text-sm"
            type="email"
            placeholder="Email ID"
            required
          />
        </div>

        <div className="border px-5 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.lock_icon} alt="Password" />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="outline-none text-sm"
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <p className="text-sm text-blue-600 my-4 cursor-pointer">
          Forgot password?
        </p>

        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded-full"
        >
          {state === "Login" ? "Login" : "Create Account"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-600 cursor-pointer"
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-600 cursor-pointer"
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => setShowLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
          alt="Close"
        />
      </motion.form>
    </div>
  );
};

export default Login;
