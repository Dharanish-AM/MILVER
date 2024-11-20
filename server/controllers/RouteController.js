const Route = require("../models/Route");
const Deliverymen = require("../models/Deliverymen");

const getAllRoutes = async (req, res) => {
  console.log("Fetching all routes...");
  try {
    const routes = await Route.find().populate("customers").populate("driver");

    res.json(routes);
  } catch (error) {
    console.error("Error fetching routes:", error);
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

const SDT = async (req, res) => {
  console.log("req");
  console.log("used");
  try {
    const availableDeliverymen = await Deliverymen.find({
      status: { $ne: "on_leave", $ne: "unavailable" },
      category: "main_driver",
    }).populate("routes"); // Ensure the 'routes' field is properly populated in the schema

    console.log(availableDeliverymen);

    if (availableDeliverymen.length === 0) {
      return res
        .status(400)
        .json({ message: "No available deliverymen to assign" });
    }

    const shuffledAssignments = [];
    const assignedRoutes = new Set();

    for (let i = 0; i < availableDeliverymen.length; i++) {
      const driver = availableDeliverymen[i];

      if (!driver.routes || driver.routes.length === 0) {
        console.log(`Driver ${driver.name} has no routes`);
        continue; // Skip if the driver has no routes
      }

      const shuffledRoutes = driver.routes.sort(() => Math.random() - 0.5);

      let currentRoute = await Route.findOne({ driver: driver._id });

      let nextRouteIndex = 0;
      if (currentRoute) {
        const currentRouteIndex = shuffledRoutes.findIndex(
          (route) => route._id.toString() === currentRoute._id.toString()
        );
        nextRouteIndex = (currentRouteIndex + 1) % shuffledRoutes.length;
      }

      let nextRoute = shuffledRoutes[nextRouteIndex];

      while (assignedRoutes.has(nextRoute._id.toString())) {
        nextRouteIndex = (nextRouteIndex + 1) % shuffledRoutes.length;
        nextRoute = shuffledRoutes[nextRouteIndex];
      }

      if (nextRoute) {
        shuffledAssignments.push({
          driver: driver._id,
          route: nextRoute._id,
        });

        assignedRoutes.add(nextRoute._id.toString());
        console.log(
          `Driver ${driver.name} will be assigned to route ${nextRoute._id}`
        );
      }
    }

    const allRoutes = await Route.find(); // Fetch all routes
    const unassignedRoutes = allRoutes.filter(
      (route) => !assignedRoutes.has(route._id.toString())
    );

    if (unassignedRoutes.length > 0) {
      return res.status(400).json({
        message: "Not all routes have been assigned a driver.",
        unassignedRoutes,
      });
    }

    return res.status(200).json({
      message:
        "Routes shuffled successfully. Awaiting client confirmation to update.",
      shuffledAssignments,
    });
  } catch (error) {
    console.error("Error in shuffleDeliveryman:", error);
    return res
      .status(500)
      .json({ message: "Error in shuffleDeliveryman", error: error.message });
  }
 
};

const confirmAndSaveAssignments = async (req, res) => {
  try {
    const { shuffledAssignments } = req.body;

    for (const assignment of shuffledAssignments) {
      await Route.findByIdAndUpdate(assignment.route, {
        driver: assignment.driver,
      });
      await Deliverymen.findByIdAndUpdate(assignment.driver, {
        status: "assigned",
      });
    }

    res.status(200).json({
      message: "Deliverymen successfully assigned to routes.",
    });
  } catch (error) {
    console.error("Error in confirmAndSaveAssignments:", error);
    res.status(500).json({
      message: "Error in confirming assignments",
      error: error.message,
    });
  }
};

const assignDeliverymenManual = async (req, res) => {
  try {
    const { driver_objid, route_objid } = req.body;

    const route = await Route.findById(route_objid);
    const driver = await Deliverymen.findById(driver_objid);

    if (!route || !driver) {
      return res.status(404).json({ message: "Route or driver not found" });
    }

    route.driver = driver._id;

    driver.status = "assigned";
    await driver.save();

    route.delivery_history.push({
      driver: driver._id,
      assigned_at: Date.now(),
    });

    await route.save();

    res.json(route);
  } catch (error) {
    res.status(500).json({ message: "Error assigning driver", error });
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
  SDT,
  assignDeliverymenManual,
  confirmAndSaveAssignments,
};
