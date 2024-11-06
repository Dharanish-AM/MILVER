import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

import dashboard from "../assets/dashboard.png";
import customer from "../assets/customer.png";
import delivery from "../assets/delivery.png";
import routes from "../assets/routes.png";
import stats from "../assets/stats.png";

function Header() {
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    switch (select) {
      case 0:
        navigate("/Dashboard");
        break;
      case 1:
        navigate("/Customer");
        break;
      case 2:
        navigate("/Delivery");
        break;
      case 3:
        navigate("/Routes");
        break;
      case 4:
        navigate("/Stats");
        break;

      default:
        break;
    }
  }, [select, navigate]);

  return (
    <section className="Header-container">
      <div className="Header-innerContainer">
        <div
          className="Header-dashboard"
          style={{
            backgroundColor: select === 0 ? "black" : "initial",
            backgroundImage: `url(${dashboard})`,
          }}
          onClick={() => setSelect(0)}
        ></div>
        <div
          className="Header-customer"
          style={{
            backgroundColor: select === 1 ? "black" : "initial",
            backgroundImage: `url(${customer})`,
          }}
          onClick={() => setSelect(1)}
        ></div>
        <div
          className="Header-delivery"
          style={{
            backgroundColor: select === 2 ? "black" : "initial",
            backgroundImage: `url(${delivery})`,
          }}
          onClick={() => setSelect(2)}
        ></div>
        <div
          className="Header-routes"
          style={{
            backgroundColor: select === 3 ? "black" : "initial",
            backgroundImage: `url(${routes})`,
          }}
          onClick={() => setSelect(3)}
        ></div>
        <div
          className="Header-report"
          style={{
            backgroundColor: select === 4 ? "black" : "initial",
            backgroundImage: `url(${stats})`,
          }}
          onClick={() => setSelect(4)}
        ></div>
      </div>
    </section>
  );
}

export default Header;
