import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("token") || localStorage.getItem("token");
    }
    return null;
  });
  const [loadingUser, setLoadingUser] = useState(true);

  const loginUser = async (email, password) => {
    toast.loading("Logging you in ...");
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", { email, password });
      const { access_token } = response.data;

      if (access_token) {
        toast.dismiss();
        if (typeof window !== "undefined") {
          sessionStorage.setItem("token", access_token);
          localStorage.setItem("token", access_token);
        }
        setAuthToken(access_token);
        await fetchCurrentUser(access_token);
        toast.success("Successfully Logged in");
        navigate("/");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.error || "Failed to login");
    }
  };

  const registerUser = async (username, email, password) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/users", {
        username,
        email,
        password,
      });

      if (response.data.success) {
        toast.success("User registered successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to register user");
    }
  };

  const fetchCurrentUser = async (token) => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/current_user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.email) setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error.response?.data || error);
      logoutUser();
    } finally {
      setLoadingUser(false);
    }
  };

  const logoutUser = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("token");
      localStorage.removeItem("token");
    }
    setAuthToken(null);
    setCurrentUser(null);
    navigate("/login");
  };

  useEffect(() => {
    if (authToken) fetchCurrentUser(authToken);
    else setLoadingUser(false);
  }, [authToken]);

  return (
    <UserContext.Provider
      value={{
        authToken,
        currentUser,
        loadingUser,
        loginUser,
        logoutUser,
        registerUser, // Add registerUser to the context value
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext }; // Ensure this export is added
export const useUserContext = () => useContext(UserContext);