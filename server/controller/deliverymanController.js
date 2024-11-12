const axios = require('axios');
const Deliveryman = require("../models/Deliveryman");
const Route = require('../models/Route');
const Customer = require("../models/Customer");

const dotenv = require("dotenv").config()

const royapettahCoordinates = [80.26375998957623, 13.054398115031136];


const createDeliveryman = async (req, res) => {
  try {
    const { name, phone, email, address, primaryroutes, externalroutes } = req.body;
    let external_status = externalroutes ? "available" : "unavailable";

    // Check if the primary route is already assigned to another deliveryman
    const existingRoute = await Route.findOne({ route_id: primaryroutes });
    if (existingRoute && existingRoute.delivery_man_id) {
      return res.status(400).json({ message: `Route ${primaryroutes} is already assigned to another deliveryman.` });
    }

    // Create the deliveryman document
    const deliveryman = new Deliveryman({
      name,
      phone,
      email,
      address,
      primaryroutes,
      externalroutes,
      external_status
    });
    await deliveryman.save();

    // Find the route using the primaryroute provided
    const route = await Route.findOne({ route_id: primaryroutes });
    if (route) {
      // Assign the deliveryman_id to the route's delivery_man_id
      route.delivery_man_id = deliveryman.deliveryman_id;
      await route.save();

      console.log(`Route ${primaryroutes} updated with deliveryman_id: ${deliveryman.deliveryman_id}`);
    } else {
      console.log(`Route with route_id ${primaryroutes} not found`);
    }

    res.status(201).json({ message: "Deliveryman created successfully", deliveryman });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const reassignDeliveryman = async (req, res) => {
  try {
    const { deliveryman_id, new_primaryroute, old_primaryroute } = req.body;

    // Check if all necessary parameters are provided
    if (!deliveryman_id || !new_primaryroute || !old_primaryroute) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    // Find the deliveryman by deliveryman_id
    const deliveryman = await Deliveryman.findOne({ deliveryman_id });
    if (!deliveryman) {
      return res.status(404).json({ message: "Deliveryman not found." });
    }

    // Find the old route and update its delivery_man_id to null
    const oldRoute = await Route.findOne({ route_id: old_primaryroute });
    if (oldRoute) {
      oldRoute.delivery_man_id = null;
      await oldRoute.save();
      console.log(`Route ${old_primaryroute} removed from deliveryman ${deliveryman_id}`);
    } else {
      console.log(`Old Route with route_id ${old_primaryroute} not found.`);
    }

    // Find the new route and update its delivery_man_id
    const newRoute = await Route.findOne({ route_id: new_primaryroute });
    if (!newRoute) {
      return res.status(404).json({ message: "New Route not found." });
    }

    // Update the primaryroutes of the deliveryman to include the new primary route
    deliveryman.primaryroutes = [new_primaryroute]; // Assuming only one primary route
    await deliveryman.save();

    // Assign the new route's delivery_man_id to the deliveryman's ID
    newRoute.delivery_man_id = deliveryman.deliveryman_id;
    await newRoute.save();

    console.log(`Route ${new_primaryroute} updated with deliveryman_id: ${deliveryman.deliveryman_id}`);

    res.status(200).json({ message: "Deliveryman reassigned successfully.", deliveryman });
  } catch (error) {
    console.error("Error reassigning deliveryman:", error.message);
    res.status(500).json({ message: "Error reassigning deliveryman.", error: error.message });
  }
};


const allocateDeliveryman = async (req, res) => {
  try {
    const { route_id } = req.body;

    // Find the route by route_id
    const route = await Route.findOne({ route_id });
    if (!route || route.customers.length === 0) {
      return res.status(404).json({ message: "No customers found for the specified route" });
    }

    const customerIds = route.customers;
    const customers = await Customer.find({ customer_id: { $in: customerIds } });
    const customerCoordinates = customers.map((customer) => customer.location.coordinates);

    // Check for available deliverymen for the route
    const availableDeliverymen = await Deliveryman.find({ externalroutes: route_id, status: "available" });
    if (availableDeliverymen.length === 0) {
      return findNearestDeliveryman(route, customerCoordinates, res);
    }

    let minDistanceDriver = null;
    let minDistance = Infinity;
    let minRouteDetails = null;

    // Loop through available deliverymen to find the one with the shortest route
    for (let deliveryman of availableDeliverymen) {
      const knownRoute = await Route.findOne({ route_id: { $in: deliveryman.primaryroutes } });
      const knownCustomerIds = knownRoute ? knownRoute.customers : [];
      const knownCustomers = await Customer.find({ customer_id: { $in: knownCustomerIds } });
      const knownCustomerCoordinates = knownCustomers.map((customer) => customer.location.coordinates);

      const allCustomerCoordinates = [...customerCoordinates, ...knownCustomerCoordinates];
      const sortedCoordinates = allCustomerCoordinates.map((coordinates) => {
        const distance = haversineDistance(royapettahCoordinates, coordinates);
        return { coordinate: coordinates, distance };
      }).sort((a, b) => a.distance - b.distance);

      const totalDistanceAndTime = await getTotalDistanceAndTime(sortedCoordinates);

      // Update the minimum distance deliveryman
      if (totalDistanceAndTime.totalDistance < minDistance) {
        minDistance = totalDistanceAndTime.totalDistance;
        minDistanceDriver = deliveryman;
        minRouteDetails = totalDistanceAndTime;
      }
    }

    if (minDistanceDriver) {
      res.status(200).json({
        message: "Found the deliveryman with the shortest route",
        deliveryman: minDistanceDriver,
        routeDetails: minRouteDetails,
      });
    } else {
      res.status(404).json({ message: "No deliveryman found with a suitable route" });
    }
  } catch (error) {
    console.error("Error during deliveryman allocation:", error.message);
    res.status(500).json({ message: "An error occurred during allocation", error: error.message });
  }
};


const findNearestDeliveryman = async (route, customerCoordinates, res) => {
  try {
    const availableDeliverymen = await Deliveryman.find({ status: "available" });
    if (!availableDeliverymen || availableDeliverymen.length === 0) {
      return res.status(404).json({ message: "No available deliverymen found" });
    }

    let minDistanceDriver = null;
    let minDistance = Infinity;
    let minRouteDetails = null;

    for (let driver of availableDeliverymen) {
      let allCustomerCoordinates = [];

      for (let externalRouteId of driver.externalroutes) {
        const externalRoute = await Route.findOne({ route_id: externalRouteId });
        if (externalRoute) {
          const externalCustomerIds = externalRoute.customers;
          const externalCustomers = await Customer.find({ customer_id: { $in: externalCustomerIds } });
          const externalCustomerCoordinates = externalCustomers.map((customer) => customer.location.coordinates);
          allCustomerCoordinates = [...allCustomerCoordinates, ...externalCustomerCoordinates];
        }
      }

      const combinedCoordinates = [...customerCoordinates, ...allCustomerCoordinates];
      const sortedCoordinates = combinedCoordinates.map((coordinates) => {
        const distance = haversineDistance(royapettahCoordinates, coordinates);
        return { coordinate: coordinates, distance };
      }).sort((a, b) => a.distance - b.distance);

      console.log(sortedCoordinates)

      const totalDistanceAndTime = await getTotalDistanceAndTime(sortedCoordinates);

      if (totalDistanceAndTime.totalDistance < minDistance) {
        minDistance = totalDistanceAndTime.totalDistance;
        minDistanceDriver = driver;
        minRouteDetails = totalDistanceAndTime;
      }
    }

    if (minDistanceDriver) {
      res.status(200).json({
        message: "Nearest available deliveryman found",
        deliveryman: minDistanceDriver,
        routeDetails: minRouteDetails,
      });
    } else {
      res.status(404).json({ message: "No nearby deliveryman found" });
    }
  } catch (error) {
    console.error("Error finding nearest deliveryman:", error);
    res.status(500).json({ message: "Error finding nearest deliveryman" });
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

    for (let i = 0; i < sortedCoordinates.length - 1; i++) {
      const start = sortedCoordinates[i].coordinate;
      const end = sortedCoordinates[i + 1].coordinate;


      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        { coordinates: [start, end] },
        {
          headers: {
            Authorization: process.env.MAP_API_KEY,
          },
        }
      );


      if (response.data.routes && response.data.routes.length > 0) {

        const route = response.data.routes[0].segments[0];
        totalDistance += route.distance;
        totalDuration += route.duration;
      } else {
        throw new Error('No routes found in response');
      }
    }

    return {
      totalDistance: totalDistance / 1000,
      totalDuration: totalDuration / 60,
    };
  } catch (error) {
    console.error('Error getting route details from OpenRouteService:', error);
    throw new Error('Error fetching route details');
  }
};


module.exports = { createDeliveryman, allocateDeliveryman };
