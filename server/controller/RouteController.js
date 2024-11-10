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


module.exports = {
  createRoute,

};
