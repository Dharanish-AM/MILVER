const axios = require("axios");
const Customer = require("../models/Customer");
const Route = require("../models/Route");
const dotenv = require("dotenv").config()

const DEFAULT_LOCATION = {
  name: "Royapettah",
  coordinates: [80.26375998957623, 13.054398115031136],
};

const ORS_BASE_URL = "https://api.openrouteservice.org/v2/directions/driving-car";
MAP_API_KEY = '5b3ce3597851110001cf624867ce2f9fc4c040b090d5248aaf23f288'

const getRoadDistance = async (startCoords, endCoords) => {
  try {
    const response = await axios.post(
      ORS_BASE_URL,
      {
        coordinates: [startCoords, endCoords],
        format: "json",
      },
      {
        headers: {
          "Authorization": MAP_API_KEY,
        },
      }
    );
    const distanceInMeters = response.data.routes[0].segments[0].distance;
    return distanceInMeters / 1000; // Return distance in kilometers
  } catch (error) {
    console.error("Error fetching road distance from OpenRouteService:", error);
    throw new Error("Failed to fetch road distance");
  }
};

const createCustomerAndOptimizeRoute = async (req, res) => {
  try {
    const { name, address, location, phone, deliverytime, route_id, route_name } = req.body;

    const customerLocation = location || DEFAULT_LOCATION;

    // Create a new customer
    const customer = new Customer({
      name,
      address,
      location: customerLocation,
      phone,
      route_id,
      deliverytime,
      route_name
    });

    await customer.save();

    console.log(`New customer added: ${customer.name}, ${customer.address}`);

    // Find the route associated with the route_id
    const route = await Route.findOne({ route_id });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    if (!route.customers) {
      route.customers = [];
    }

    // Add the customer to the route's customers array
    route.customers.push(customer.customer_id);
    await route.save();

    console.log(`Customer ${customer.name} added to route ${route_id}`);

    // Fetch all customers assigned to this route
    const customers = await Customer.find({ customer_id: { $in: route.customers } });

    if (customers.length <= 1) {
      return res.status(201).json({ message: "Customer created. No optimization needed.", customer });
    }

    let customerCoordinates = customers.map(cust => ({
      id: cust.customer_id,
      coordinates: cust.location.coordinates,
    }));

    console.log("Customer coordinates before sorting:", customerCoordinates);

    const sortedCustomers = [];
    let currentLocation = DEFAULT_LOCATION.coordinates;
    let totalDistance = 0;

    // Sort customers based on proximity
    while (customerCoordinates.length > 0) {
      const closestCustomer = customerCoordinates.reduce((closest, customer) => {
        const distance = haversine(currentLocation, customer.coordinates);
        if (!closest || distance < closest.distance) {
          return { ...customer, distance };
        }
        return closest;
      }, null);

      sortedCustomers.push(closestCustomer.id);

      // Fetch road distance from OpenRouteService
      const roadDistance = await getRoadDistance(currentLocation, closestCustomer.coordinates);
      totalDistance += roadDistance; // Add the road distance to the total distance

      currentLocation = closestCustomer.coordinates;

      // Remove the selected customer from the array
      customerCoordinates = customerCoordinates.filter(customer => customer.id !== closestCustomer.id);
    }

    console.log("Sorted customers:", sortedCustomers);
    console.log("Total road distance:", totalDistance); // Log the total road distance

    // Update route with the sorted customer order
    route.customers = sortedCustomers;

    // Get the last customer and update `to_cords` with their coordinates
    const lastCustomer = await Customer.findOne({ customer_id: sortedCustomers[sortedCustomers.length - 1] });
    if (lastCustomer) {
      route.to_cords = { type: "Point", coordinates: lastCustomer.location.coordinates };
    }

    route.distance_km = totalDistance; // Store the total road distance in the route schema

    await route.save();

    console.log(`Route ${route_id} updated with sorted customer order, last customer coordinates, and total road distance`);

    res.status(201).json({ message: "Customer created and route optimized", customer });
  } catch (error) {
    console.error("Error creating customer or optimizing route:", error);
    res.status(500).json({ message: "Error creating customer or optimizing route", error: error.message });
  }
};

const haversine = (coord1, coord2) => {
  const toRad = (deg) => deg * (Math.PI / 180);

  const lat1 = coord1[1];
  const lon1 = coord1[0];
  const lat2 = coord2[1];
  const lon2 = coord2[0];

  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

module.exports = { createCustomerAndOptimizeRoute };
