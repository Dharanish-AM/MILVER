const Route = require("../models/Route");

const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate("customers").populate("drivers");
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching routes", error });
  }
};

const getRouteById = async (req, res) => {
  try {
    const route = await Route.findOne(req.body.route_id)
      .populate("customers")
      .populate("drivers");
    if (!route) return res.status(404).json({ message: "Route not found" });
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: "Error fetching route", error });
  }
};

const scheduleStatusReset = () => {
  cron.schedule("0 0 0 * * 0", async () => {
    console.log(
      "Scheduled task: Calling shuffleDeliveryman to shuffle routes and assign deliverymen."
    );
    await shuffleDeliveryman();
  });
};

const shuffleDeliveryman = async () => {
  try {
    
    const availableDeliverymen = await Deliverymen.find({
      status: { $ne: "on_leave", $ne: "unavailable" },
    });

    if (availableDeliverymen.length === 0) {
      return console.log("No available deliverymen to assign");
    }

    
    for (let i = 0; i < availableDeliverymen.length; i++) {
      const driver = availableDeliverymen[i];

      
      const knownRoutes = await Route.find({ _id: { $in: driver.routes } });

      if (knownRoutes.length === 0) {
        return console.log(`Driver ${driver.name} has no known routes`);
      }

      
      const shuffledRoutes = knownRoutes.sort(() => Math.random() - 0.5);

      
      const assignedRoute = shuffledRoutes[0];  

      
      await Route.findByIdAndUpdate(assignedRoute._id, { driver: driver._id });

      
      await Deliverymen.findByIdAndUpdate(driver._id, { status: "assigned" });

      
      scheduleStatusReset(driver._id);

      console.log(`Route assigned to Driver ${driver.name} successfully!`);
    }

    console.log("Routes shuffled and deliverymen assigned successfully!");
  } catch (error) {
    console.error("Error in shuffleDeliveryman:", error);
  }
};


const createRoute = async (req, res) => {
  try {
    const { route_name, customers, drivers, distance, location } = req.body;

    const newRoute = new Route({
      route_name,
      customers,
      drivers,
      distance,
      location,
    });

    await newRoute.save();
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(400).json({ message: "Error creating route", error });
  }
};

const updateRoute = async (req, res) => {
  try {
    const route = await Route.findOne({ route_id: req.body.route_id });

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const { route_name, customers, drivers, distance, location } = req.body;

    if (route_name) route.route_name = route_name;
    if (customers) route.customers = customers;
    if (drivers) route.drivers = drivers;
    if (distance) route.distance = distance;
    if (location) {
      if (location.latitude) route.location.latitude = location.latitude;
      if (location.longitude) route.location.longitude = location.longitude;
    }

    await route.save();

    const updatedRoute = await route.populate("customers").populate("drivers");
    res.json(updatedRoute);
  } catch (error) {
    res.status(400).json({ message: "Error updating route", error });
  }
};

const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findOne({ route_id: req.body.route_id });

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    await route.delete();

    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting route", error });
  }
};

const removeDeliverymanFromRoute = async (req, res) => {
  try {
    const { deliveryman_id } = req.body;
    const route = await Route.findOne(req.params.id.route_id);

    if (!route) return res.status(404).json({ message: "Route not found" });

    if (route.drivers.includes(deliveryman_id)) {
      route.drivers.pull(deliveryman_id);
      await route.save();
      res.json(route);
    } else {
      res.status(400).json({ message: "Deliveryman not found in this route" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing deliveryman from route", error });
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  removeDeliverymanFromRoute,
  shuffleDeliveryman,
};
