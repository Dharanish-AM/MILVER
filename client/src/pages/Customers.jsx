
// import React, { useEffect, useRef } from 'react';
// import mapboxgl from 'mapbox-gl';

// const Customers = () => {
//   const mapContainer = useRef(null);

//   useEffect(() => {
//     mapboxgl.accessToken = 'pk.eyJ1Ijoic2FiYXJpbTYzNjkiLCJhIjoiY20zYWc2ZzdnMG5kZjJrc2F3eXUyczhiaiJ9.KluQuo4u7AMijmoli9HZmg';

//     const map = new mapboxgl.Map({
//       container: mapContainer.current,                   
//       style: 'mapbox://styles/mapbox/streets-v11',      
//       center: [80.2653, 13.0604],                        
//       zoom: 13                                          
//     });

 
//     new mapboxgl.Marker()
//       .setLngLat([80.2653, 13.0604]) 
//       .addTo(map);                    

//     return () => map.remove(); 
//   }, []);

//   return (
//     <div>
//       <h1>Customers</h1>
//       <div
//         ref={mapContainer}
//         style={{
//           width: '50%',
//           height: '400px'  
//         }}
//       />
//     </div>
//   );
// };import React from 'react';import React from 'react';
import Header from "../components/Header";
import '../styles/Customers.css';
import { FaUsers, FaStar, FaCheckCircle, FaFileExport } from 'react-icons/fa';

const Customers = () => {
  const customerData = [
    {
      id: 1,
      customerId: 101,
      name: "John Doe",
      phone: "+1234567890",
      email: "john@example.com",
      location: "New York",
      route: "Route A",
      status: "Active",
      milk: "200L",
    },
    {
      id: 2,
      customerId: 102,
      name: "Jane Smith",
      phone: "+1987654321",
      email: "jane@example.com",
      location: "Los Angeles",
      route: "Route B",
      status: "Inactive",
      milk: "150L",
    },
    {
      id: 3,
      customerId: 103,
      name: "Michael Johnson",
      phone: "+1212121212",
      email: "michael@example.com",
      location: "Chicago",
      route: "Route C",
      status: "Active",
      milk: "180L",
    },
    {
      id: 4,
      customerId: 104,
      name: "Emily Brown",
      phone: "+1313131313",
      email: "emily@example.com",
      location: "Houston",
      route: "Route D",
      status: "Active",
      milk: "250L",
    },
    {
      id: 5,
      customerId: 105,
      name: "Chris Green",
      phone: "+1414141414",
      email: "chris@example.com",
      location: "Phoenix",
      route: "Route E",
      status: "Inactive",
      milk: "100L",
    },
    {
      id: 6,
      customerId: 106,
      name: "Sarah Wilson",
      phone: "+1515151515",
      email: "sarah@example.com",
      location: "Philadelphia",
      route: "Route F",
      status: "Active",
      milk: "220L",
    },
    {
      id: 7,
      customerId: 107,
      name: "David Lee",
      phone: "+1616161616",
      email: "david@example.com",
      location: "San Antonio",
      route: "Route G",
      status: "Active",
      milk: "190L",
    },
    {
      id: 8,
      customerId: 108,
      name: "Laura Martinez",
      phone: "+1717171717",
      email: "laura@example.com",
      location: "San Diego",
      route: "Route H",
      status: "Inactive",
      milk: "120L",
    },
    {
      id: 9,
      customerId: 109,
      name: "Robert White",
      phone: "+1818181818",
      email: "robert@example.com",
      location: "Dallas",
      route: "Route I",
      status: "Active",
      milk: "210L",
    },
    {
      id: 10,
      customerId: 110,
      name: "Jessica Harris",
      phone: "+1919191919",
      email: "jessica@example.com",
      location: "San Jose",
      route: "Route J",
      status: "Active",
      milk: "230L",
    },
    {
      id: 10,
      customerId: 110,
      name: "Jessica Harris",
      phone: "+1919191919",
      email: "jessica@example.com",
      location: "San Jose",
      route: "Route J",
      status: "Active",
      milk: "230L",
    },
  ];

  
  return (
    <section className="customers">
      <Header />
      <div className="main-content">
        <div className="top-boxes-container">
  <div className="top-boxes">
    <div className="card total-customers">
      <FaUsers className="icon" />
      <div className="text">
        <h2>120</h2>
        <p>Total Customers</p>
      </div>
    </div>
    <div className="card vip-customers">
      <FaStar className="icon" />
      <div className="text">
        <h2>50</h2>
        <p>VIP Customers</p>
      </div>
    </div>
    <div className="card active-subscriptions">
      <FaCheckCircle className="icon" />
      <div className="text">
        <h2>80</h2>
        <p>Active Subscriptions</p>
      </div>
    </div>
    <div className="export-box">
      <button className="export-btn">
        <FaFileExport className="export-icon" />
        Export
      </button>
    </div>
  </div>
</div>
<div className="table-container">
  <table>
    <thead>
      <tr>
        <th>S.No</th>
        <th>Customer ID</th>
        <th>Name</th>
        <th>Phone</th>
        <th>Email</th>
        <th>Location</th>
        <th>Route</th>
        <th>Status</th>
        <th>Milk (Mo)</th>
        <th>View More</th>
      </tr>
    </thead>
    <tbody>
      {customerData.map((customer, index) => (
        <tr key={customer.id}>
          <td>{index + 1}</td>
          <td>{customer.customerId}</td>
          <td>{customer.name}</td>
          <td>{customer.phone}</td>
          <td>{customer.email}</td>
          <td>{customer.location}</td>
          <td>{customer.route}</td>
          <td>{customer.status}</td>
          <td>{customer.milk}</td>
          <td>
            <button>View More</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>
    </section>
  );
};

export default Customers;
