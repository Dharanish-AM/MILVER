import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {jwtDecode} from "jwt-decode"; 
import Dashboard from "./pages/Dashboard";
import Deliverymandetails from "./pages/Deliverymandetails";
import MapRoutes from "./pages/MapRoutes";
import Customers from "./pages/Customers";
import Fuel from "./pages/Fuel";
import Login from "./pages/Login";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found, redirecting to login.");
        navigate("/"); 
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; 

        if (decoded.exp < currentTime) {
          console.log("Token expired, redirecting to login.");
          localStorage.removeItem("trainerToken");
          navigate("/");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    checkToken();
  }, [navigate]); 

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Deliverymandetails" element={<Deliverymandetails />} />
      <Route path="/Routes" element={<MapRoutes />} />
      <Route path="/Customers" element={<Customers />} />
      <Route path="/fuel" element={<Fuel />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
