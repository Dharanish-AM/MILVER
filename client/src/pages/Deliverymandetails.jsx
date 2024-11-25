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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from 'react-csv';  
import { jsPDF } from 'jspdf';  
import { useRef } from "react";


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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editForm, setEditForm] = useState({
  id:"",
  name: "",
  phone: "",
  address: "",
  primaryRouteName: "",
  status: "",
});
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

  const handleDelete = async () => {
    try {
      console.log("Attempting to delete deliveryman...");
      if (deleteConfirmation === selectedEmployee.name) {
        console.log("Selected employee ID:", selectedEmployee._id);
  
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/deliverymen/`, {
          data: { id: selectedEmployee._id }, 
        });
  
        console.log("Employee deleted:", selectedEmployee.name);
        toast.success(response.data.message || "Deliveryman deleted successfully");
  
        handleCloseDeleteConfirmation();
        setIsEventAdded((prev) => !prev); 
      } else {
        alert("Name does not match for deletion.");
      }
    } catch (error) {
      console.error("Error deleting deliveryman:", error.response?.data || error.message);
      toast.error("Failed to delete deliveryman record");
    }
  };
  
  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    routes: [], 
    category: "", 
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
        console.log(response.data)
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
  const handleAddEmployee = async () => {
    const errors = {};
    if (!customerForm.name) errors.name = "Name is required.";
    if (!customerForm.phone) errors.phone = "Phone number is required.";
    if (!customerForm.email) errors.email = "Email is required.";
    if (!customerForm.address) errors.address = "Address is required.";
    if (!customerForm.routes || customerForm.routes.length === 0)
      errors.routes = "At least one route must be selected.";
    if (!customerForm.category) errors.category = "Category is required.";
    
  
    setFormErrors(errors);
  
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors in the form.");
      return;
    }
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/deliverymen/`,
        customerForm
      );
      toast.success("Employee added successfully!");
      setIsAddEmployeeModalOpen(false);
      setIsEventAdded((prev) => !prev); 
    } catch (error) {
      console.error("Error adding employee:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Failed to add employee."
      );
    }
  };
  
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
  const csvLinkRef = useRef();
  const handleExportCSV = () => {
    console.log("Exporting as CSV...");
    toast.info("CSV Export Started!");

    const headers = [
      { label: "Name", key: "name" },
      { label: "Email", key: "email" },
      { label: "Phone", key: "phone" },
      { label: "Status", key: "status" },
    ];

    return (
      <CSVLink data={deliverymendata} headers={headers} filename={"employee_data.csv"}>
        <button>Download CSV</button>
      </CSVLink>
    );
  };
  const handleExportPDF = () => {
    console.log(deliverymendata, "Exporting data to PDF");
  
    toast.info("PDF Export Started!");
  
    const doc = new jsPDF();
  
    // Set font and title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Employee Data", 20, 20);
  
    // Set the starting position for employee data
    let yPosition = 30;
    const marginBottom = 20;
  
    deliverymendata.forEach((item) => {
      // Add a new page if the content overflows
      if (yPosition + 60 > doc.internal.pageSize.height - marginBottom) {
        doc.addPage();
        yPosition = 20;
      }
  
      // Employee name with bold style
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`Name: ${item.name}`, 20, yPosition);
      yPosition += 10;
  
      // Employee details in normal style
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
  
      doc.text(`Email: ${item.email}`, 20, yPosition);
      yPosition += 10;
  
      doc.text(`Phone: ${item.phone}`, 20, yPosition);
      yPosition += 10;
  
      doc.text(`Status: ${item.status}`, 20, yPosition);
      yPosition += 10;
  
      // Address with a bit more spacing
      doc.text(`Address: ${item.address}`, 20, yPosition);
      yPosition += 15; // Extra space after address
  
      // Category and routes
      doc.text(`Category: ${item.category}`, 20, yPosition);
      yPosition += 10;
  
      // If there are routes, list them
      if (item.routes && item.routes.length > 0) {
        doc.text("Routes: ", 20, yPosition);
        item.routes.forEach((route, idx) => {
          yPosition += 10;
          doc.text(`${idx + 1}. ${route}`, 30, yPosition);
        });
      }
      yPosition += 15; // Extra space after routes
  
      // If there are no delivery history or fuel allowance, print a message
      if (!item.delivery_history.length && !item.fuel_allowance.length) {
        doc.text("No delivery history or fuel allowance available.", 20, yPosition);
        yPosition += 10;
      }
  
      // Add some space between employees
      yPosition += 20;
    });
  
    console.log("Exporting PDF complete");
  
    // Save the PDF
    doc.save("employee_data.pdf");
  };
  
  
  
  const handleEdit = () => {
    if (selectedEmployee) {
      setEditForm({
        id:selectedEmployee._id,
        name: selectedEmployee.name,
        phone: selectedEmployee.phone,
        address: selectedEmployee.address,
        primaryRouteName: selectedEmployee.primaryRouteName,
        status: selectedEmployee.status,
      });

      setIsEditModalOpen(true);
    }
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };
  
  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/deliverymen/`,
        {
          id: editForm.id,
          name: editForm.name,
          phone: editForm.phone,
          address: editForm.address,
          primaryRouteName: editForm.primaryRouteName,
          status: editForm.status,
        }
      );
      toast.success("Deliveryman details updated successfully");
  
      setSelectedEmployee({
        ...selectedEmployee,
        ...editForm,
      });
  
      setIsEventAdded((prev) => !prev);
  
      setIsEditModalOpen(false);
      setShowModal(true); 
    } catch (error) {
      console.error("Error updating deliveryman:", error);
      toast.error("Failed to update deliveryman details");
    }
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
                    <strong>Type:</strong> {employee.category} ⏰
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
          <strong>Primary Route:</strong> {selectedEmployee.primaryRouteName}
        </p>
        <p>
          <strong>Status:</strong> {selectedEmployee.status}
        </p>
        <p>
          <strong>External Status:</strong> {selectedEmployee.external_status}
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
    onClick={() => setIsAddEmployeeModalOpen(false)}  // Closes the modal when clicking outside content
  >
    <div
      className="modal-content"
      onClick={(e) => e.stopPropagation()}  // Prevents the event from propagating to the overlay
    >
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
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={customerForm.name}
          onChange={(e) =>
            setCustomerForm({ ...customerForm, name: e.target.value })
          }
          className={`modal-input ${formErrors.name ? "input-error" : ""}`}
        />
        {formErrors.name && (
          <span className="error-message">{formErrors.name}</span>
        )}

        {/* Phone */}
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={customerForm.phone}
          onChange={(e) =>
            setCustomerForm({ ...customerForm, phone: e.target.value })
          }
          className={`modal-input ${formErrors.phone ? "input-error" : ""}`}
        />
        {formErrors.phone && (
          <span className="error-message">{formErrors.phone}</span>
        )}

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={customerForm.email}
          onChange={(e) =>
            setCustomerForm({ ...customerForm, email: e.target.value })
          }
          className={`modal-input ${formErrors.email ? "input-error" : ""}`}
        />
        {formErrors.email && (
          <span className="error-message">{formErrors.email}</span>
        )}

        {/* Address */}
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={customerForm.address}
          onChange={(e) =>
            setCustomerForm({ ...customerForm, address: e.target.value })
          }
          className={`modal-input ${formErrors.address ? "input-error" : ""}`}
        />
        {formErrors.address && (
          <span className="error-message">{formErrors.address}</span>
        )}

        {/* Routes */}
        <select
          name="routes"
          multiple
          value={customerForm.routes}
          onChange={(e) =>
            setCustomerForm({
              ...customerForm,
              routes: Array.from(
                e.target.selectedOptions,
                (option) => option.value
              ),
            })
          }
          className="modal-select"
        >
          <option value="1">Route 1</option>
          <option value="2">Route 2</option>
          <option value="3">Route 3</option>
        </select>

        {/* Category */}
        <select
          name="category"
          value={customerForm.category}
          onChange={(e) =>
            setCustomerForm({ ...customerForm, category: e.target.value })
          }
          className="modal-select"
        >
          <option value="">Select Category</option>
          <option value="main_driver">Driver</option>
          <option value="backup_driver">Backup Driver</option>
        </select>
      </div>
      <div className="modal-footer">
        <button className="submit-btn" onClick={handleAddEmployee}>
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



{isEditModalOpen && (
  <div className="custom-modal-overlay">
    <div className="custom-modal">
      <div className="custom-modal-header">
        <h2 className="custom-modal-title">Edit Employee Details</h2>
        <button
          className="custom-modal-close"
          onClick={() => setIsEditModalOpen(false)}
        >
          <MdClose />
        </button>
      </div>
      <div className="custom-modal-body">
        <form>
          <div className="custom-form-group">
            <label htmlFor="employeeName">Employee Name</label>
            <input
              id="employeeName"
              type="text"
              name="name"
              placeholder="Enter Employee Name"
              value={editForm.name}
              onChange={handleEditFormChange}
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="text"
              name="phone"
              placeholder="Enter Phone Number"
              value={editForm.phone}
              onChange={handleEditFormChange}
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              placeholder="Enter Address"
              value={editForm.address}
              onChange={handleEditFormChange}
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="primaryRouteName">Primary Route</label>
            <input
              id="primaryRouteName"
              type="text"
              name="primaryRouteName"
              placeholder="Enter Primary Route"
              value={editForm.primaryRouteName}
              onChange={handleEditFormChange}
            />
          </div>
          <div className="custom-form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={editForm.status}
              onChange={handleEditFormChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </form>
      </div>
      <div className="custom-modal-footer">
        <button
          className="custom-button custom-button-save"
          onClick={handleSaveEdit}
        >
          Save
        </button>
        <button
          className="custom-button custom-button-cancel"
          onClick={() => setIsEditModalOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


      <ToastContainer />


      </div>
    </section>
  );
}

export default Deliverymandetails;
