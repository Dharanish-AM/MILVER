import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import '../styles/customers.css';
import { FaUsers, FaStar, FaCheckCircle, FaFileExport, FaSearch, FaPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customersData, setCustomersData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventAdded, setIsEventAdded] = useState(false); // Track if a new customer is added
  const [customerForm, setCustomerForm] = useState({
    name: '',
    address: '',
    location: {
      type: 'Point',
      coordinates: ['80.2625205', '13.0473059']
    },
    phone: '',
    deliverytime: '10.00',
    route_id: '1',
    route_name: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    address: '',
    phone: '',
    route_name: '',
  });

  // Fetch customer data on mount and whenever a new customer is added
  useEffect(() => {
    const getCustomerData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/customer/getallcustomers`);
        setCustomersData(response.data);
      } catch (error) {
        console.error("Error fetching customer data: ", error);
      }
    };

    getCustomerData();
  }, [isEventAdded]); // Re-fetch when `isEventAdded` changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm({ ...customerForm, [name]: value });
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors); 
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/customer/addcustomer`, customerForm);
      setIsEventAdded(prevState => !prevState); // Toggle to trigger re-fetch
      toast.success("Customer added successfully!");

      setIsModalOpen(false);
      setCustomerForm({
        name: '',
        address: '',
        location: {
          type: 'Point',
          coordinates: ['80.2625205', '13.0473059']
        },
        phone: '',
        deliverytime: '10.00',
        route_id: '1',
        route_name: '',
      });
    } catch (error) {
      console.error("Error adding customer: ", error);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!customerForm.name) errors.name = 'Name is required';
    if (!customerForm.address) errors.address = 'Address is required';
    if (!customerForm.phone) errors.phone = 'Phone is required';
    if (!customerForm.route_name) errors.route_name = 'Route Name is required';
    return errors;
  };

  const setmodalclose = () => {
    setCustomerForm({
      name: '',
      address: '',
      location: {
        type: 'Point',
        coordinates: ['80.2625205', '13.0473059']
      },
      phone: '',
      deliverytime: '10.00',
      route_id: '1',
      route_name: '',
    });
    setIsModalOpen(false);
    setFormErrors({});
  };

  return (
    <section className="customers">
      <Header />
      <div className="main-content">
        <div className="add-customer-container-right">
          <div className="total-customers-box">
            <span>Total Customers: {customersData.length}</span>
          </div>
          <div className="add-customer-options">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <button className="export-btn">
              <FaFileExport className="export-icon" />
              Export
            </button>
            <button className="add-customer-btn" onClick={() => setIsModalOpen(true)}>
              <FaPlus className="add-customer-icon" />
              <span className="add-customer-text">Add Customer</span>
            </button>
          </div>
        </div>
        <div className="table-container">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Route Id</th>
                  <th>Route Name</th>
                  <th>Status</th>
                  <th>View More</th>
                </tr>
              </thead>
              <tbody>
  {customersData
    .filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.route_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((customer, index) => (
      <tr key={customer._id}>
        <td>{index + 1}</td>
        <td>{customer.customer_id}</td>
        <td>{customer.name}</td>
        <td>{customer.phone}</td>
        <td>{customer.address}</td>
        <td>{customer.route_id}</td>
        <td>{customer.route_name}</td>
        <td>{customer.status}</td>
        <td><button className="viewmore">View More</button></td>
      </tr>
    ))}
</tbody>

            </table>
          </div>
        </div>
      </div>

      {/* Popup modal for customer creation */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setmodalclose()}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setmodalclose()}>×</button>
            <h2>Add New Customer</h2>
            
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={customerForm.name}
              onChange={handleInputChange}
              className={formErrors.name ? 'input-error' : ''}
            />
            {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={customerForm.address}
              onChange={handleInputChange}
              className={formErrors.address ? 'input-error' : ''}
            />
            {formErrors.address && <span className="error-message">{formErrors.address}</span>}
            
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={customerForm.phone}
              onChange={handleInputChange}
              className={formErrors.phone ? 'input-error' : ''}
            />
            {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
            
            <input
              type="text"
              name="route_name"
              placeholder="Route Name"
              value={customerForm.route_name}
              onChange={handleInputChange}
              className={formErrors.route_name ? 'input-error' : ''}
            />
            {formErrors.route_name && <span className="error-message">{formErrors.route_name}</span>}

            <button className="modal-submit" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
      <ToastContainer />
    </section>
  );
};

export default Customers;
