const Deliverymen = require("../models/Deliverymen");
const Route = require("../models/Route");

const getAllDeliverymen = async (req, res) => {
  try {
    const deliverymen = await Deliverymen.find().populate(
      "delivery_history.customer"
    );
    res.json(deliverymen);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching deliverymen records", error });
  }
};

const getDeliverymanById = async (req, res) => {
  try {
    const deliveryman = await Deliverymen.findById(req.params.id).populate(
      "delivery_history.customer"
    );
    if (!deliveryman)
      return res.status(404).json({ message: "Deliveryman not found" });
    res.json(deliveryman);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching deliveryman record", error });
  }
};

const shuffleDeliveryman = () => {};

const createDeliveryman = async (req, res) => {
  const { name, phone, email, address, routes, category } = req.body;

  try {
    if (!Array.isArray(routes) || routes.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one route ID is required" });
    }

    const routeObjects = [];

    for (let route_id of routes) {
      if (!route_id) {
        return res
          .status(400)
          .json({ message: "Invalid route ID in the request body" });
      }

      const routeObject = await Route.findOne({ route_id });

      if (!routeObject) {
        return res
          .status(404)
          .json({ message: `Route with ID ${route_id} not found` });
      }

      routeObjects.push(routeObject);
    }

    const newDeliveryman = new Deliverymen({
      name,
      phone,
      email,
      address,
      category,
      routes: routeObjects.map((route) => route._id),
    });

    const savedDeliveryman = await newDeliveryman.save();

    if (!category == "backup_driver") {
      let assignedRoute = null;

      for (let route of routeObjects) {
        if (!route.driver) {
          assignedRoute = route;
          route.driver = savedDeliveryman._id;
          await route.save();
          break;
        }
      }

      if (!assignedRoute) {
        return res
          .status(400)
          .json({ message: "No available routes without a driver" });
      }

      savedDeliveryman.status = "assigned";
      await savedDeliveryman.save();

      res.status(201).json({
        message: "Deliveryman created and assigned to a route",
        deliveryman: savedDeliveryman,
        assignedRoute: assignedRoute.route_id,
      });
    } else {
      res.status(201).json({
        message: "Deliveryman created",
        deliveryman: savedDeliveryman,
      });
    }
  } catch (error) {
    console.error("Error details:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate driver_id or other unique constraint error",
        error: error.message,
      });
    }
    res.status(400).json({
      message: "Error creating deliveryman record",
      error: error.message,
    });
  }
};

const updateDeliveryman = async (req, res) => {
  try {
    const updatedDeliveryman = await Deliverymen.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("delivery_history.customer");

    if (!updatedDeliveryman)
      return res.status(404).json({ message: "Deliveryman not found" });
    res.json(updatedDeliveryman);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating deliveryman record", error });
  }
};

const deleteDeliveryman = async (req, res) => {
  try {
    const deletedDeliveryman = await Deliverymen.findByIdAndDelete(
      req.params.id
    );
    if (!deletedDeliveryman)
      return res.status(404).json({ message: "Deliveryman not found" });
    res.json({ message: "Deliveryman record deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting deliveryman record", error });
  }
};

const addDeliveryHistory = async (req, res) => {
  try {
    const { customer, delivered_at, status } = req.body;
    const deliveryman = await Deliverymen.findById(req.params.id);

    if (!deliveryman)
      return res.status(404).json({ message: "Deliveryman not found" });

    const deliveryHistoryEntry = {
      customer,
      delivered_at,
      status,
    };

    deliveryman.delivery_history.push(deliveryHistoryEntry);
    await deliveryman.save();

    res.status(201).json(deliveryman);
  } catch (error) {
    res.status(400).json({ message: "Error adding delivery history", error });
  }
};

const updateDeliveryHistory = async (req, res) => {
  try {
    const { customer, delivered_at, status } = req.body;
    const deliveryman = await Deliverymen.findById(req.params.id);

    if (!deliveryman)
      return res.status(404).json({ message: "Deliveryman not found" });

    const historyEntry = deliveryman.delivery_history.id(req.params.historyId);

    if (!historyEntry)
      return res.status(404).json({ message: "History entry not found" });

    historyEntry.customer = customer || historyEntry.customer;
    historyEntry.delivered_at = delivered_at || historyEntry.delivered_at;
    historyEntry.status = status || historyEntry.status;

    await deliveryman.save();
    res.json(deliveryman);
  } catch (error) {
    res.status(400).json({ message: "Error updating delivery history", error });
  }
};

const deleteDeliveryHistory = async (req, res) => {
  try {
    const deliveryman = await Deliverymen.findById(req.params.id);

    if (!deliveryman)
      return res.status(404).json({ message: "Deliveryman not found" });

    const historyEntry = deliveryman.delivery_history.id(req.params.historyId);

    if (!historyEntry)
      return res.status(404).json({ message: "History entry not found" });

    historyEntry.remove();
    await deliveryman.save();

    res.json(deliveryman);
  } catch (error) {
    res.status(500).json({ message: "Error deleting delivery history", error });
  }
};

module.exports = {
  getAllDeliverymen,
  getDeliverymanById,
  createDeliveryman,
  updateDeliveryman,
  deleteDeliveryman,
  addDeliveryHistory,
  updateDeliveryHistory,
  deleteDeliveryHistory,
};
