const Customer = require("../models/Customer");
const Route = require("../models/Route");

const addCustomerIdsToRoutes = async () => {
  try {
    for(var i=0;i<130;i++){
      const customer = await Customer.findBy(i
        {
          ""
        }
      );
    }
  } catch {
    console.log("Error");
  }
};

const createRoute = async (req, res) => {
  console.log("consoling the data to the enter in the routes : ", req.body);

  const formattedCustomers = req.body.customers.map((customer) => {
    const roundedCoordinates = customer.location.coordinates.map((coord) =>
      Number(coord.toFixed(6))
    );
    return {
      customer_id: customer.customer_id,
      location: {
        type: "Point",
        coordinates: roundedCoordinates,
      },
    };
  });

  const formattedCustomersdata = formattedCustomers;
  console.log("formated data after arranging : ", formattedCustomersdata);
  console.log(JSON.stringify(formattedCustomersdata, null, 2));
  const newRoute = new Route({
    route_id: req.body.route_id,
    from: req.body.from,
    to: req.body.to,
    distance_km: req.body.distance_km,
    customers: formattedCustomersdata,
  });
  try {
    console.log("Before saving he new routes : ", newRoute);
    await newRoute.save();
    return res.status(201).json(newRoute);
  } catch (error) {
    return res.status(400).json({ message: error.message });
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
  addCustomerIdsToRoutes,
};
