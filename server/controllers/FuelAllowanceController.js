const Deliverymen = require("../models/Deliverymen");
const Route = require("../models/Route");

const addFuelAllowance = async (req, res) => {
  const { driverId, amount } = req.body;

  if (!driverId || !routeId || amount === undefined) {
    return res.status(400).json({
      message: "driverId, routeId, and amount are required.",
    });
  }

  try {
    const deliveryman = await Deliverymen.findById(driverId);

    if (!deliveryman) {
      return res.status(404).json({ message: "Deliveryman not found." });
    }

    deliveryman.fuel_allowance.push({
      amount,
      route_id: routeId,
      date: Date.now(),
    });

    await deliveryman.save();

    return res.status(200).json({
      message: "Fuel allowance added successfully.",
      deliveryman,
    });
  } catch (error) {
    console.error("Error adding fuel allowance:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  addFuelAllowance,
};
