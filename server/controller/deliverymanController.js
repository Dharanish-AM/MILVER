const axios = require('axios');
const Deliveryman = require("../models/Deliveryman");
const Routes = require('../models/Route');
const Customer = require("../models/Customer");

const API_KEY = '5b3ce3597851110001cf624867ce2f9fc4c040b090d5248aaf23f288';

const createDeliveryman = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      primaryroutes,
      externalroutes,
      status
    } = req.body;

    const Delivery = new Deliveryman({
      name,
      phone,
      email,
      address,
      primaryroutes,
      externalroutes,
      status
    });

    await Delivery.save();
    res.status(201).json({ message: "Deliveryman created successfully", Deliveryman });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const allocateDeliveryman = async (req, res) => {
  try {
    const royapettahCoordinates = [80.26375998957623, 13.054398115031136];
    const { route_id } = req.body;

    const absentDeliverymen = await Deliveryman.find({ primaryroutes: route_id, status: "on_leave" });

    if (!absentDeliverymen || absentDeliverymen.length === 0) {
      return res.status(404).json({
        message: "No absent deliveryman found for the specified route",
      });
    }

    const route = await Routes.findOne({ route_id });
    if (!route || route.customers.length === 0) {
      return res.status(404).json({
        message: "No customers found for the specified route",
      });
    }

    const absentCustomerIds = route.customers;
    const absentCustomers = await Customer.find({ customer_id: { $in: absentCustomerIds } });
    const absentCustomerCoordinates = absentCustomers.map((customer) => customer.location.coordinates);

    const availableDeliverymen = await Deliveryman.find({ externalroutes: route_id, status: "available" });
    if (!availableDeliverymen || availableDeliverymen.length === 0) {
      return res.status(404).json({
        message: "No available deliverymen with knowledge of the absent deliveryman's route",
      });
    }

    const availableDeliveryman = availableDeliverymen[0];
    const knownRoute = await Routes.findOne({ route_id: { $in: availableDeliveryman.primaryroutes } });
    const knownCustomerIds = knownRoute ? knownRoute.customers : [];

    const knownCustomers = await Customer.find({ customer_id: { $in: knownCustomerIds } });
    const knownCustomerCoordinates = knownCustomers.map((customer) => customer.location.coordinates);

    const allCustomerCoordinates = [...absentCustomerCoordinates, ...knownCustomerCoordinates];

    const sortedCoordinates = allCustomerCoordinates.map((coordinates) => {
      const distance = haversineDistance(royapettahCoordinates, coordinates);
      return { coordinate: coordinates, distance };
    }).sort((a, b) => a.distance - b.distance);

    // Now, calculate road distances and times for the sorted coordinates using OpenRouteService
    const totalDistanceAndTime = await getTotalDistanceAndTime(sortedCoordinates);

    res.status(200).json({
      message: "Coordinates sorted and distances calculated successfully",
      sortedCoordinates,
      totalDistanceAndTime
    });

  } catch (error) {
    console.error("Error during deliveryman allocation:", error.message);
    res.status(500).json({
      message: "An error occurred during allocation",
      error: error.message,
    });
  }
};

const haversineDistance = (coord1, coord2) => {
  const R = 6371;
  const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
  const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getTotalDistanceAndTime = async (sortedCoordinates) => {
  try {
    let totalDistance = 0;
    let totalDuration = 0;

    // Iterate through the sorted coordinates and calculate the road distances
    for (let i = 0; i < sortedCoordinates.length - 1; i++) {
      const start = sortedCoordinates[i].coordinate;
      const end = sortedCoordinates[i + 1].coordinate;

      // Send a request to OpenRouteService for each pair of coordinates
      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        {
          coordinates: [start, end]
        },
        {
          headers: {
            Authorization: API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      const route = response.data.routes[0];
      if (route) {
        totalDistance += route.summary.distance; // In meters
        totalDuration += route.summary.duration; // In seconds
      }
    }

    // Convert total distance to kilometers and duration to minutes
    return {
      totalDistance: totalDistance / 1000, // Convert meters to kilometers
      totalDuration: (totalDuration / 60).toFixed(2) // Convert seconds to minutes
    };

  } catch (error) {
    console.error('Error fetching route data from OpenRouteService:', error.message);
    throw new Error('Failed to fetch route data');
  }
};

module.exports = {
  createDeliveryman,
  allocateDeliveryman
};
