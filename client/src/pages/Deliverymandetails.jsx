import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import deliveryman from "../assets/deliveryman.jpg";
import "../styles/deliverymandetails.css";
import {
  FaUsers,
  FaStar,
  FaCheckCircle,
  FaFileExport,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import axios from "axios";
import { MdClose } from "react-icons/md";
function Deliverymandetails() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [routeFilter, setRouteFilter] = useState("Routes");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deliverymendata, setdelivermendata] = useState([]);
  const [isEventAdded, setIsEventAdded] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const handleShowDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setDeleteConfirmation("");
  };

  const handleDeleteConfirmationChange = (e) => {
    setDeleteConfirmation(e.target.value);
  };

  const handleDelete = () => {
    if (deleteConfirmation === selectedEmployee.name) {
      console.log("Employee deleted:", selectedEmployee.name);
      handleCloseDeleteConfirmation();
    } else {
      alert("Name does not match for deletion.");
    }
  };

  const [customerForm, setCustomerForm] = useState({
    name: "",
    address: "",
    location: {
      type: "Point",
      coordinates: ["80.2625205", "13.0473059"],
    },
    phone: "",
    deliverytime: "10.00",
    route_id: "1",
    route_name: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    address: "",
    phone: "",
    route_name: "",
  });
  useEffect(() => {
    let isMounted = true;
    const getDeliverymenData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/deliverymen/`
        );
        if (isMounted) {
          setdelivermendata(response.data);
        }
      } catch (error) {
        console.error("Error fetching deliverymen data: ", error);
      }
    };

    getDeliverymenData();

    return () => {
      isMounted = false;
    };
  }, [isEventAdded]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleRouteChange = (e) => {
    setRouteFilter(e.target.value);
  };

  const filteredEmployees = deliverymendata.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.primaryRouteName &&
        employee.primaryRouteName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "Status" || employee.status === statusFilter;

    const matchesRoute =
      routeFilter === "Routes" ||
      (employee.primaryroutes &&
        employee.primaryroutes.toString() === routeFilter);

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
  const handleEdit = () => {
    console.log("editing");
  };

  return (
    <section className="deliverymandetails">
      <Header />
      <div className="main-content">
        <div className="header-section">
          <h1 class="gradient-text">Employees</h1>

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
            <button
              className="add-customer-btn"
              onClick={() => setIsAddEmployeeModalOpen(true)}
            >
              <FaPlus className="add-customer-icon" />
              <span className="add-customer-text">Add Employee</span>
            </button>
          </div>
        </div>
        <div className="filter-bar">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Employees..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="dropdown-container">
            <select
              className="status-dropdown"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option>Status</option>
              <option>available</option>
              <option>Not available</option>
            </select>
            <select
              className="route-dropdown"
              value={routeFilter}
              onChange={handleRouteChange}
            >
              <option>Routes</option>
              <option>T Nagar</option>
              <option>Nungambakkam</option>
              <option>1000 lights</option>
              <option>Mandaveli</option>
              <option>Santhome</option>
              <option>Kodambakkam</option>
              <option>Royapettah</option>
            </select>
          </div>
        </div>

        <div className="employee-list">
          {filteredEmployees.map((employee, index) => (
            <div key={index} className="employee-card">
              <div
                className={`employee-status ${
                  employee.status === "Active" ? "active" : "inactive"
                }`}
              >
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
                  <p>
                    <strong>Route:</strong>
                    {employee.primaryRouteName} 🛤️
                  </p>
                  <p>
                    <strong>Ph-no:</strong> {employee.phone} 📱
                  </p>
                  <p>
                    <strong>Type:</strong> {employee.type} ⏰
                  </p>
                </div>
                <p className="employee-joined">
                  Joined at {employee.joinDate}{" "}
                  <a href="#" onClick={() => handleViewDetails(employee)}>
                    view details
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>

        {showModal && selectedEmployee && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{selectedEmployee.name}</h3>
                <button className="close-btn" onClick={handleCloseModal}>
                  <MdClose />
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Phone:</strong> {selectedEmployee.phone}
                </p>
                <p>
                  <strong>Email:</strong> {selectedEmployee.email}
                </p>
                <p>
                  <strong>Address:</strong> {selectedEmployee.address}
                </p>
                <p>
                  <strong>Primary Route:</strong>{" "}
                  {selectedEmployee.primaryRouteName}
                </p>
                <p>
                  <strong>Status:</strong> {selectedEmployee.status}
                </p>
                <p>
                  <strong>External Status:</strong>{" "}
                  {selectedEmployee.external_status}
                </p>
              </div>
              <div className="modal-footer">
                <button className="edit-btn" onClick={handleEdit}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={handleShowDeleteConfirmation}
                >
                  Delete
                </button>
                <button className="close-btn" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {showDeleteConfirmation && selectedEmployee && (
          <div className="modal-overlay">
            <div className="delete-confirmation-modal">
              <div className="delete-confirmation-header">
                <h3>Are you sure you want to delete this employee?</h3>
              </div>
              <div className="delete-confirmation-body">
                <p>
                  To confirm, type the name{" "}
                  <strong>{selectedEmployee.name}</strong> below:
                </p>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={handleDeleteConfirmationChange}
                  placeholder="Enter name to confirm"
                  className="confirmation-input"
                />
              </div>
              <div className="delete-confirmation-footer">
                <button
                  className="cancel-btn"
                  onClick={handleCloseDeleteConfirmation}
                >
                  Cancel
                </button>
                <button
                  className="confirm-btn"
                  onClick={handleDelete}
                  disabled={deleteConfirmation !== selectedEmployee.name}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {isAddEmployeeModalOpen && (
          <div
            className="modal-overlay"
            onClick={() => setIsAddEmployeeModalOpen(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add Employee</h2>
                <button
                  className="close-btn"
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                >
                  <MdClose />
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  name="name"
                  placeholder="Employee Name"
                  value={customerForm.name}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, name: e.target.value })
                  }
                  className={formErrors.name ? "input-error" : ""}
                />
                {formErrors.name && (
                  <span className="error-message">{formErrors.name}</span>
                )}

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={customerForm.phone}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, phone: e.target.value })
                  }
                  className={formErrors.phone ? "input-error" : ""}
                />
                {formErrors.phone && (
                  <span className="error-message">{formErrors.phone}</span>
                )}

                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={customerForm.address}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      address: e.target.value,
                    })
                  }
                  className={formErrors.address ? "input-error" : ""}
                />
                {formErrors.address && (
                  <span className="error-message">{formErrors.address}</span>
                )}

                <input
                  type="text"
                  name="route_name"
                  placeholder="Route Name"
                  value={customerForm.route_name}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      route_name: e.target.value,
                    })
                  }
                  className={formErrors.route_name ? "input-error" : ""}
                />
                {formErrors.route_name && (
                  <span className="error-message">{formErrors.route_name}</span>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="submit-btn"
                  onClick={() => {
                    console.log("Employee added:", customerForm);
                    setIsAddEmployeeModalOpen(false);
                  }}
                >
                  Add Employee
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Deliverymandetails;
