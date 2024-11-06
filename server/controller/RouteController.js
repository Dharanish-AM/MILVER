const Customer = require("../models/Customer");
const Route = require("../models/Route");
const createRoute = async (req, res) => {
  const { from, to, from_cords, to_cords } = req.body;
  console.log("Creating the route:", req.body);

  const calculateDistance = (coords1, coords2) => {
    const [lon1, lat1] = coords1; 
    const [lon2, lat2] = coords2; 
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371;
    
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distance_km = calculateDistance(
    from_cords.coordinates,
    to_cords.coordinates
  );

  const newRoute = new Route({
    from,
    to,
    from_cords: {
      type: "Point",
      coordinates:parseFloat( from_cords.coordinates),
    },
    to_cords: {
      type: "Point",
      coordinates: parseFloat(to_cords.coordinates),
    },
    distance_km: parseInt(distance_km),
    customers: [],
  });

  try {
    console.log("Before saving the new route:", newRoute);
    await newRoute.save();
    return res.status(201).json(newRoute);
  } catch (error) {
    console.error("Error saving route:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    return res.status(200).json(routes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a route by ID
const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: "Route not found" });
    return res.status(200).json(route);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a route by ID
const updateRoute = async (req, res) => {
  try {
    const updatedRoute = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRoute)
      return res.status(404).json({ message: "Route not found" });
    return res.status(200).json(updatedRoute);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Delete a route by ID
const deleteRoute = async (req, res) => {
  try {
    const deletedRoute = await Route.findByIdAndDelete(req.params.id);
    if (!deletedRoute)
      return res.status(404).json({ message: "Route not found" });
    return res.status(204).json(); // No content to send back
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
};
