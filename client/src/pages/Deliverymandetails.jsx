import React from 'react';
import Header from "../components/Header";
import deliveryman from '../assets/deliveryman.jpg';
import "../styles/deliverymandetails.css";

function Deliverymandetails() {
  return (
    <section className="deliverymandetails">
      <Header />
      <div className="main-content">
        <div className="header-section">
          <h1>Employees</h1>
          <div className="header-buttons">
            <button>Export</button>
            <button className="add-employee-btn">
              <img src="add-icon.png" alt="Add" /> Add Employee
            </button>
          </div>
        </div>
        
        <div className="filter-bar">
          <input type="text" placeholder="Search" />
          <select>
            <option>Status</option>
            {/* More options */}
          </select>
          <select>
            <option>Routes</option>
            {/* More options */}
          </select>
        </div>

        <div className="employee-list">
          {[...Array(20)].map((_, index) => (
            <div key={index} className="employee-card">
              <div className="employee-status">Active</div>
              <div className="employee-info">
                <img src={deliveryman} alt="Employee" className="employee-avatar" />
                <h3>James</h3>
                <p>Route: Royapettah 🚩</p>
                <p>Ph-no: 9698564218 📞</p>
                <p>Type: Fulltime 🕒</p>
                <p className="employee-details">
                  Joined at 20 Feb 2024 <a href="#">view details</a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Deliverymandetails;
