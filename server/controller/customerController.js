const axios = require("axios");
const dotenv = require("dotenv").config();
const Customer = require("../models/Customer");
const Route = require("../models/Route");

const DEFAULT_LOCATION = {
  name: "Royapettah",
  coordinates: [80.26375998957623, 13.054398115031136],
};

const ORS_BASE_URL =
  "https://api.openrouteservice.org/v2/directions/driving-car";
const MAP_API_KEY = "5b3ce3597851110001cf624867ce2f9fc4c040b090d5248aaf23f288";

// Fetches road distance between two coordinates using OpenRouteService
const getRoadDistance = async (startCoords, endCoords) => {
  try {
    const response = await axios.post(
      ORS_BASE_URL,
      { coordinates: [startCoords, endCoords], format: "json" },
      { headers: { Authorization: MAP_API_KEY } }
    );
    const distanceInMeters = response.data.routes[0].segments[0].distance;
    return distanceInMeters / 1000; // Return distance in kilometers
  } catch (error) {
    console.error("Error fetching road distance:", error.message);
    throw new Error("Failed to fetch road distance");
  }
};

// Calculates haversine distance for initial proximity sorting
const haversine = (coord1, coord2) => {
  const toRad = (deg) => deg * (Math.PI / 180);
  const R = 6371; // Radius of Earth in km

  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Creates a customer, adds to route, and optimizes the route by proximity
const createCustomerAndOptimizeRoute = async (req, res) => {
  try {
    const {
      name,
      address,
      location,
      phone,
      deliverytime,
      route_id,
      route_name,
    } = req.body;
    const customerLocation = location || DEFAULT_LOCATION;

    // Create and save new customer
    const customer = new Customer({
      name,
      address,
      location: customerLocation,
      phone,
      route_id,
      deliverytime,
      route_name,
    });
    await customer.save();
    console.log(`New customer added: ${customer.name}, ${customer.address}`);

    // Find and update route with new customer
    const route = await Route.findOne({ route_id });
    if (!route) return res.status(404).json({ message: "Route not found" });
    route.customers = route.customers || [];
    route.customers.push(customer.customer_id);
    await route.save();

    // Fetch all customers in the route
    const customers = await Customer.find({
      customer_id: { $in: route.customers },
    });
    if (customers.length <= 1) {
      return res.status(201).json({
        message: "Customer created. No optimization needed.",
        customer,
      });
    }

    // Sort customers by proximity using haversine, then refine using road distance
    let customerCoordinates = customers.map((cust) => ({
      id: cust.customer_id,
      coordinates: cust.location.coordinates,
    }));

    let sortedCustomers = [];
    let currentLocation = DEFAULT_LOCATION.coordinates;
    let totalDistance = 0;

    // Sort customers based on closest proximity
    while (customerCoordinates.length > 0) {
      const closestCustomer = customerCoordinates.reduce(
        (closest, customer) => {
          const distance = haversine(currentLocation, customer.coordinates);
          return !closest || distance < closest.distance
            ? { ...customer, distance }
            : closest;
        },
        null
      );

      sortedCustomers.push(closestCustomer.id);
      const roadDistance = await getRoadDistance(
        currentLocation,
        closestCustomer.coordinates
      );
      totalDistance += roadDistance;
      currentLocation = closestCustomer.coordinates;
      customerCoordinates = customerCoordinates.filter(
        (cust) => cust.id !== closestCustomer.id
      );
    }

    // Update route with sorted customers and total distance
    route.customers = sortedCustomers;
    const lastCustomer = await Customer.findOne({
      customer_id: sortedCustomers.at(-1),
    });
    if (lastCustomer)
      route.to_cords = {
        type: "Point",
        coordinates: lastCustomer.location.coordinates,
      };
    route.distance_km = totalDistance;
    await route.save();

    console.log(
      `Route ${route_id} updated with optimized order and total distance`
    );
    res
      .status(201)
      .json({ message: "Customer created and route optimized", customer });
  } catch (error) {
    console.error("Error in createCustomerAndOptimizeRoute:", error.message);
    res.status(500).json({
      message: "Error creating customer or optimizing route",
      error: error.message,
    });
  }
};

const deleteCustomerWithOptimization = async (req, res) => {
  try {
    const { customer_id } = req.body;

    // Find the customer to delete
    const customer = await Customer.findOne({ customer_id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Get the route_id from the customer's details
    const route_id = customer.route_id;

    // Delete the customer from the Customer schema
    await Customer.deleteOne({ customer_id });
    console.log(`Customer deleted: ${customer.name}, ${customer.address}`);

    // Find the route and remove the customer from its customer array
    const route = await Route.findOne({ route_id });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Remove customer ID from route's customer array
    route.customers = route.customers.filter((id) => id !== customer_id);

    // Fetch updated list of customers in the route
    const customers = await Customer.find({
      customer_id: { $in: route.customers },
    });

    // If there are no customers left, reset the route distance and save
    if (customers.length === 0) {
      route.distance_km = 0;
      route.to_cords = null;
      await route.save();
      return res
        .status(200)
        .json({
          message: "Customer deleted and route reset due to no customers",
        });
    }

    // Re-optimize the customer order based on updated list
    let customerCoordinates = customers.map((cust) => ({
      id: cust.customer_id,
      coordinates: cust.location.coordinates,
    }));

    let sortedCustomers = [];
    let currentLocation = DEFAULT_LOCATION.coordinates;
    let totalDistance = 0;

    // Sort customers by proximity and calculate total distance
    while (customerCoordinates.length > 0) {
      const closestCustomer = customerCoordinates.reduce(
        (closest, customer) => {
          const distance = haversine(currentLocation, customer.coordinates);
          return !closest || distance < closest.distance
            ? { ...customer, distance }
            : closest;
        },
        null
      );

      sortedCustomers.push(closestCustomer.id);
      const roadDistance = await getRoadDistance(
        currentLocation,
        closestCustomer.coordinates
      );
      totalDistance += roadDistance;
      currentLocation = closestCustomer.coordinates;
      customerCoordinates = customerCoordinates.filter(
        (cust) => cust.id !== closestCustomer.id
      );
    }

    // Update the route with new optimized customer sequence and total distance
    route.customers = sortedCustomers;
    const lastCustomer = await Customer.findOne({
      customer_id: sortedCustomers.at(-1),
    });
    if (lastCustomer) {
      route.to_cords = {
        type: "Point",
        coordinates: lastCustomer.location.coordinates,
      };
    }
    route.distance_km = totalDistance;
    await route.save();

    console.log(
      `Route ${route_id} updated with new customer sequence after deletion`
    );
    res
      .status(200)
      .json({ message: "Customer deleted and route re-optimized" });
  } catch (error) {
    console.error("Error in deleteCustomerWithOptimization:", error.message);
    res.status(500).json({
      message: "Error deleting customer or optimizing route",
      error: error.message,
    });
  }
};

const editCustomer = async (req, res) => {
  try {
    const { customer_id, name, address, location, phone, deliverytime } = req.body;

    // Find the customer to edit
    const customer = await Customer.findOne({ customer_id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if the location is being updated
    const locationChanged = location && (location.coordinates[0] !== customer.location.coordinates[0] ||
      location.coordinates[1] !== customer.location.coordinates[1]);

    // Update the customer's details
    customer.name = name || customer.name;
    customer.address = address || customer.address;
    customer.location = location || customer.location;
    customer.phone = phone || customer.phone;
    customer.deliverytime = deliverytime || customer.deliverytime;
    await customer.save();

    console.log(`Customer updated: ${customer.name}, ${customer.address}`);

    // If location has not changed, no re-optimization is needed
    if (!locationChanged) {
      return res.status(200).json({ message: "Customer updated successfully", customer });
    }

    // Re-optimize the route if location has changed
    const route = await Route.findOne({ route_id: customer.route_id });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Fetch updated list of customers in the route
    const customers = await Customer.find({ customer_id: { $in: route.customers } });
    if (customers.length === 0) {
      route.distance_km = 0;
      route.to_cords = null;
      await route.save();
      return res.status(200).json({ message: "Customer updated and route reset due to no customers" });
    }

    // Re-optimize the customer order based on updated location
    let customerCoordinates = customers.map((cust) => ({
      id: cust.customer_id,
      coordinates: cust.location.coordinates,
    }));

    let sortedCustomers = [];
    let currentLocation = DEFAULT_LOCATION.coordinates;
    let totalDistance = 0;

    // Sort customers by proximity and calculate total distance
    while (customerCoordinates.length > 0) {
      const closestCustomer = customerCoordinates.reduce(
        (closest, customer) => {
          const distance = haversine(currentLocation, customer.coordinates);
          return !closest || distance < closest.distance
            ? { ...customer, distance }
            : closest;
        },
        null
      );

      sortedCustomers.push(closestCustomer.id);
      const roadDistance = await getRoadDistance(currentLocation, closestCustomer.coordinates);
      totalDistance += roadDistance;
      currentLocation = closestCustomer.coordinates;
      customerCoordinates = customerCoordinates.filter((cust) => cust.id !== closestCustomer.id);
    }

    // Update the route with new optimized customer sequence and total distance
    route.customers = sortedCustomers;
    const lastCustomer = await Customer.findOne({ customer_id: sortedCustomers.at(-1) });
    if (lastCustomer) {
      route.to_cords = { type: "Point", coordinates: lastCustomer.location.coordinates };
    }
    route.distance_km = totalDistance;
    await route.save();

    console.log(`Route ${route.route_id} updated with optimized order after customer edit`);
    res.status(200).json({ message: "Customer updated and route re-optimized", customer });
  } catch (error) {
    console.error("Error in editCustomer:", error.message);
    res.status(500).json({
      message: "Error updating customer or optimizing route",
      error: error.message,
    });
  }
};


// Retrieve all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error retrieving customers:", error.message);
    res
      .status(500)
      .json({ message: "Error retrieving customers", error: error.message });
  }
};

module.exports = {
  createCustomerAndOptimizeRoute,
  getAllCustomers,
  deleteCustomerWithOptimization,
  editCustomer
};
