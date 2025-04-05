// import { createContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import axios from "axios";
// import {useNavigate} from "react-router-dom"

// export const AppContext = createContext();

// const AppContextProvider = (props) => {
//   const [user, setUser] = useState(null);
//   const [showLogin, setShowLogin] = useState(false);
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [credit, setCredit] = useState(false);

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const navigate = useNavigate()

//   const loadCreditsData = async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
//         headers: { token },
//       });
//       if (data.success) {
//         setCredit(data.credits);
//         setUser(data.user);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   const generateImage = async (prompt) => {
//     try {
//     const {data} =  await axios.post(backendUrl + "/api/image/generate-image", {prompt}, {headers: {token}})
//     if (data.success) {
//       loadCreditsData()
//       return data.resultImage
//     }
//     else {
//       toast.error(data.message)
//       if (data.creditBalance === 0) {
//         navigate("/buy")
//       }
//     }

//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   }
  

//   const logout = () =>{
//     localStorage.removeItem('token')
//     setToken('')
//     setUser(null)
//   }

//   useEffect(() => {
//     if (token) {
//       loadCreditsData();
//     }
//   }, [token]);

//   const value = {
//     user,
//     setUser,
//     showLogin,
//     setShowLogin,
//     backendUrl,
//     token,
//     setToken,
//     credit,
//     setCredit,
//     loadCreditsData,
//     logout,
//     generateImage
//   };

//   return (
//     <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
//   );
// };


import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [credit, setCredit] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const navigate = useNavigate();

  // Function to load user credits and details
  const loadCreditsData = async () => {
    if (!token) {
      toast.error("Session expired. Please log in again.");
      logout();
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      } else {
        toast.error(data.message || "Failed to load credits");
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      } else {
        toast.error("Server error. Try again later.");
      }
    }
  };

  // Function to generate image
  const generateImage = async (prompt) => {
    if (!token) {
      toast.error("Please log in to generate images.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        loadCreditsData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error.response?.data?.message || "Image generation failed");
    }
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.info("Logged out successfully.");
    navigate("/");
  };

  // Load credits when token changes
  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
