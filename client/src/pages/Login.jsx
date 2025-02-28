import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import "../styles/Login.css"; 
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const navigate=useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.warning("Fill all fields");
      return;
    }
    
    console.log("Sending data:", { email, password });
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password }
      );
  
      console.log("Server Response:", response);
  
      if (response.status === 200) {
        toast.success("Login successful!");
        const decoded = jwtDecode(response.data.token);
        console.log("Decoded Token:", decoded);
        localStorage.setItem("token", response.data.token);
        setTimeout(() => navigate("Dashboard"), 1000);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>

        <form className="login-form">
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-button" onClick={handleSubmit}>
            Sign In
          </button>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}
