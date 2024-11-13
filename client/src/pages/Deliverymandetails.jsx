import React, { useState } from 'react';
import Header from "../components/Header";
import deliveryman from '../assets/deliveryman.jpg';
import "../styles/deliverymandetails.css";
import { FaUsers, FaStar, FaCheckCircle, FaFileExport, FaSearch, FaPlus } from 'react-icons/fa';

const employees = [
  {
    name: 'James',
    route: 'Royapettah',
    phone: '9698564218',
    type: 'Fulltime',
    joinDate: '20 Feb 2024',
    status: 'Active',
    address: '123 Royapettah St, Chennai',
    email: 'james@company.com',
    emergencyContact: '9112345678',
    profilePicture:deliveryman,
    dob: '1990-06-15',
    salary: '₹50000',
    roleDescription: 'Delivery Executive handling Royapettah routes',
  },
  {
    name: 'Alex',
    route: 'T Nagar',
    phone: '9876543210',
    type: 'Parttime',
    joinDate: '15 Jan 2024',
    status: 'Inactive',
    address: '456 T Nagar, Chennai',
    email: 'alex@company.com',
    emergencyContact: '9119876543',
    profilePicture: 'https://via.placeholder.com/150',
    dob: '1992-07-20',
    salary: '₹30000',
    roleDescription: 'Part-time delivery executive handling T Nagar routes',
  },
  {
    name: 'James',
    route: 'Royapettah',
    phone: '9698564218',
    type: 'Fulltime',
    joinDate: '20 Feb 2024',
    status: 'Active',
    address: '123 Royapettah St, Chennai',
    email: 'james@company.com',
    emergencyContact: '9112345678',
    profilePicture: 'https://via.placeholder.com/150',
    dob: '1990-06-15',
    salary: '₹50000',
    roleDescription: 'Delivery Executive handling Royapettah routes',
  },
  {
    name: 'James',
    route: 'Royapettah',
    phone: '9698564218',
    type: 'Fulltime',
    joinDate: '20 Feb 2024',
    status: 'Active',
    address: '123 Royapettah St, Chennai',
    email: 'james@company.com',
    emergencyContact: '9112345678',
    profilePicture: 'https://via.placeholder.com/150',
    dob: '1990-06-15',
    salary: '₹50000',
    roleDescription: 'Delivery Executive handling Royapettah routes',
  },
  {
    name: 'James',
    route: 'Nungambakkam',
    phone: '9698564218',
    type: 'Fulltime',
    joinDate: '20 Feb 2024',
    status: 'Active',
    address: '789 Nungambakkam Rd, Chennai',
    email: 'james@company.com',
    emergencyContact: '9112345678',
    profilePicture: 'https://via.placeholder.com/150',
    dob: '1990-06-15',
    salary: '₹50000',
    roleDescription: 'Delivery Executive handling Nungambakkam routes',
  },
  {
    name: 'James',
    route: 'Royapettah',
    phone: '9698564218',
    type: 'Fulltime',
    joinDate: '20 Feb 2024',
    status: 'Active',
    address: '123 Royapettah St, Chennai',
    email: 'james@company.com',
    emergencyContact: '9112345678',
    profilePicture: 'https://via.placeholder.com/150',
    dob: '1990-06-15',
    salary: '₹50000',
    roleDescription: 'Delivery Executive handling Royapettah routes',
  },
  {
    name: 'Alex',
    route: 'Kodambakkam',
    phone: '9876543210',
    type: 'Parttime',
    joinDate: '15 Jan 2024',
    status: 'Inactive',
    address: '101 Kodambakkam, Chennai',
    email: 'alex@company.com',
    emergencyContact: '9119876543',
    profilePicture: 'https://via.placeholder.com/150',
    dob: '1992-07-20',
    salary: '₹30000',
    roleDescription: 'Part-time delivery executive handling Kodambakkam routes',
  },
  {
    name: 'Alex',
    route: '1000 lights',
    phone: '9876543210',
    type: 'Parttime',
    joinDate: '15 Jan 2024',
    status: 'Inactive',
    address: '102 1000 Lights, Chennai',
    email: 'alex@company.com',
    emergencyContact: '9119876543',
    profilePicture: 'https://via.placeholder.com/150',
    dob: '1992-07-20',
    salary: '₹30000',
    roleDescription: 'Part-time delivery executive handling 1000 Lights routes',
  },
  {
    name: 'Alex',
    route: 'Mandaveli',
    phone: '9876543210',
    type: 'Parttime',
    joinDate: '15 Jan 2024',
    status: 'Inactive',
    address: '103 Mandaveli, Chennai',
    email: 'alex@company.com',
    emergencyContact: '9119876543',
    profilePicture: 'https://via.placeholder.com/150',
    dob: '1992-07-20',
    salary: '₹30000',
    roleDescription: 'Part-time delivery executive handling Mandaveli routes',
  },
  {
    name: 'Alex',
    route: 'Santhome',
    phone: '9876543210',
    type: 'Parttime',
    joinDate: '15 Jan 2024',
    status: 'Inactive',
    address: '104 Santhome, Chennai',
    email: 'alex@company.com',
    emergencyContact: '9119876543',
    profilePicture: 'https://via.placeholder.com/150',
    dob: '1992-07-20',
    salary: '₹30000',
    roleDescription: 'Part-time delivery executive handling Santhome routes',
  },
  {
    name: 'Alex',
    route: 'Kodambakkam',
    phone: '9876543210',
    type: 'Parttime', 
    joinDate: '15 Jan 2024',
    status: 'Inactive',
    address: '105 Kodambakkam, Chennai',
    email: 'alex@company.com',
    emergencyContact: '9119876543',
    profilePicture: 'https://via.placeholder.com/150',
    dob: '1992-07-20',
    salary: '₹30000',
    roleDescription: 'Part-time delivery executive handling Kodambakkam routes',
  },
  {
    name: 'Alex',
    route: 'Kodambakkam',
    phone: '9876543210',
    type: 'Parttime',
    joinDate: '15 Jan 2024',
    status: 'Inactive',
    address: '106 Kodambakkam, Chennai',
    email: 'alex@company.com',
    emergencyContact: '9119876543',
    profilePicture: 'https://via.placeholder.com/150',
    dob: '1992-07-20',
    salary: '₹30000',
    roleDescription: 'Part-time delivery executive handling Kodambakkam routes',
  },
];


function Deliverymandetails() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Status');
  const [routeFilter, setRouteFilter] = useState('Routes');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleRouteChange = (e) => {
    setRouteFilter(e.target.value);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          employee.route.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'Status' ? true : employee.status === statusFilter;
    const matchesRoute = routeFilter === 'Routes' ? true : employee.route === routeFilter;

    return matchesSearch && matchesStatus && matchesRoute;
  });

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const handleExportCSV = () => {
    console.log("Exporting as CSV...");
  };

  const handleExportPDF = () => {
    console.log("Exporting as PDF...");
  };

  return (
    <section className="deliverymandetails">
      <Header />
      <div className="main-content">
        <div className="header-section">
          <h1>Employees</h1>
          <div className="header-buttons">
            <div className="export-btn-container">
              <button
                className="export-btn"
                onMouseEnter={() => setShowExportOptions(true)}
                onMouseLeave={() => setShowExportOptions(false)}
              >
                <FaFileExport className="export-icon" />
                Export
                {showExportOptions && (
                  <div className="export-dropdown">
                    <button onClick={handleExportCSV}>Export as CSV</button>
                    <button onClick={handleExportPDF}>Export as PDF</button>
                  </div>
                )}
              </button>
            </div>
            <button className="add-customer-btn" onClick={() => setShowModal(true)}>
              <FaPlus className="add-customer-icon" />
              <span className="add-customer-text">Add Customer</span>
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <select value={statusFilter} onChange={handleStatusChange}>
            <option>Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <select value={routeFilter} onChange={handleRouteChange}>
            <option>Routes</option>
            <option>T Nagar</option>
            <option>Nungambakkam</option>
            <option>1000 lights</option>
            <option>Mandaveli</option>
            <option>Santhome</option>
            <option>Kodambakkam</option>
            <option>Royapettah </option>
          </select>

        </div>

        <div className="employee-list">
          {filteredEmployees.map((employee, index) => (
            <div key={index} className="employee-card">
              <div className={`employee-status ${employee.status === "Active" ? "active" : "inactive"}`}>
                {employee.status}
              </div>
              <div className="employee-info">
                <img
                  src={employee.profilePicture || deliveryman}
                  alt="Employee"
                  className="employee-avatar"
                />
                <h3>{employee.name}</h3>
                <div className="employee-details">
                  <p><strong>Route:</strong> {employee.route} 🛤️</p>
                  <p><strong>Ph-no:</strong> {employee.phone} 📱</p>
                  <p><strong>Type:</strong> {employee.type} ⏰</p>
                </div>
                <p className="employee-joined">
                  Joined at {employee.joinDate}{" "}
                  <a href="#" onClick={() => handleViewDetails(employee)}>view details</a>
                </p>
              </div>
            </div>
          ))}
        </div>

        {showModal && selectedEmployee && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{selectedEmployee.name}</h3>
              <p><strong>Route:</strong> {selectedEmployee.route}</p>
              <p><strong>Email:</strong> {selectedEmployee.email}</p>
              <p><strong>Salary:</strong> {selectedEmployee.salary}</p>
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Deliverymandetails;
