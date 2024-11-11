const Customer = require("../models/Customer");
const Route = require("../models/Route");

const createRoute = async (req, res) => {
  try {
    const { to } = req.body;
    const route = new Route({
      to,
    });

    await route.save();
    res.status(201).json({ message: "Route created successfully", route });
  } catch (error) {
    res.status(500).json({ message: "Error creating route", error });
  }
};

const getAllRoutes = async (req, res) => {
  try {
    console.log("Fetching all routes...");
    const routes = await Route.find();

    const routesData = [];

    for (let eachRoute of routes) {
      const routeId = eachRoute.route_id;
      const customerData = [];

      if (Array.isArray(eachRoute.customers)) {
        for (let customerId of eachRoute.customers) {
          const customerDetails = await Customer.findOne({ customer_id: customerId });

          if (customerDetails) {
            customerData.push({
              customer_id: customerDetails.customer_id,
              coordinates: customerDetails.location.coordinates
            });
          }
        }
      }

      routesData.push({
        route_id: routeId,
        customers: customerData
      });
    }

    console.log(`Successfully fetched ${routes.length} routes.`);
    res.status(200).json({
      message: "Successfully fetched all routes data",
      data: routesData
    });

  } catch (err) {
    console.error("Error fetching routes:", err.message);
    res.status(500).json({
      message: "Failed to fetch routes from the database.",
      error: err.message
    });
  }
};

module.exports = {
  createRoute,
  getAllRoutes

};
