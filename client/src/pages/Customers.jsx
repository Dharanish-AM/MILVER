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
  const [isEventAdded, setIsEventAdded] = useState(false); 
  const [customerForm, setCustomerForm] = useState({
    name: '',
    address: '',
    latitude: '13.0473059', // Separate latitude field
    longitude: '80.2625205', // Separate longitude field
    location: {
      type: 'Point',
      coordinates: ['80.2625205', '13.0473059'], 
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

 
  useEffect(() => {
    const getCustomerData = async () => {
      try {
        console.log("consoled");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/customer/`);
        setCustomersData(response.data);
        console.log(customersData)
      } catch (error) {
        console.error("Error fetching customer data: ", error);
      }
    };

    getCustomerData();
  }, [isEventAdded]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm({ ...customerForm, [name]: value });
  };
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleExportCSV = () => {
    toast.info("Exporting as CSV...");
    // Add your CSV export logic here
  };
  
  const handleExportPDF = () => {
    toast.info("Exporting as PDF...");
    // Add your PDF export logic here
  };
  
  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
  
    const coordinates = await getCoordinates(customerForm.address);
    if (coordinates) {
      setCustomerForm((prevState) => ({
        ...prevState,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        location: {
          type: 'Point',
          coordinates: [coordinates.longitude, coordinates.latitude], // GeoJSON format
        },
      }));
    } else {
      toast.error("Failed to fetch coordinates for the address.");
      return;
    }
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/customer/`, {
        ...customerForm,
        location: {
          type: 'Point',
          coordinates: [customerForm.longitude, customerForm.latitude],
        },
      });
      console.log("Customer added:", response.data);
  
      toast.success("Customer added successfully!");
      setIsModalOpen(false);
      setCustomerForm({
        name: '',
        address: '',
        latitude: '13.0473059',
        longitude: '80.2625205',
        location: {
          type: 'Point',
          coordinates: ['80.2625205', '13.0473059'],
        },
        phone: '',
        deliverytime: '10.00',
        route_id: '2',
        route_name: '',
      });
    } catch (error) {
      console.error("Error adding customer: ", error);
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || 'An unknown error occurred.'}`);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };
  
  const getCoordinates = async (address) => {
    const accessToken = 'pk.eyJ1Ijoic2FiYXJpbTYzNjkiLCJhIjoiY20zYWc2ZzdnMG5kZjJrc2F3eXUyczhiaiJ9.KluQuo4u7AMijmoli9HZmg';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].geometry.coordinates;
        return { latitude, longitude };
      } else {
        toast.error('No coordinates found for the specified address.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      toast.error('Error fetching coordinates.');
      return null;
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
