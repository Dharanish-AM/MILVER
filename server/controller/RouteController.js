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

const getAllRoutes = async () => {
  try {
    console.log("Fetching all routes...");

    const routes = await Route.find();

    console.log(`Successfully fetched ${routes.length} routes.`);
    return routes;
  } catch (err) {
    console.error("Error fetching routes:", err.message);

    throw new Error("Failed to fetch routes from the database.");
  }
};


module.exports = {
  createRoute,
  getAllRoutes

};
