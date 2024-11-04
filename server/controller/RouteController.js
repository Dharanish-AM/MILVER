const Customer = require("../models/Customer");
const Route = require("../models/Route");

const createRoute = async (req, res) => {
  const { route_id } = req.body;
  console.log("creating the routes : ", req.body);

  try {
    const route = await Route.findOne({route_id: route_id });
    if (!route) {
      route = new Route({
        route_id,
        from,
        to,
        distance_km,
        from_coordinates,
        to_coordinates,
        customers: [],
      });
      await route.save();
    }
    route.customers = [];
    const customers = await Customer.find({ route: route_id });
    const customerIds = customers.map((customer) => customer._id);
    route.customers.push(...customerIds);
    await route.save();
    return res.status(200).json({
      message: "Customer IDs added to route successfully",
      route,
      customers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
// const createRoute

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
  createRoute,
};
