const Deliverymen = require("../models/Deliverymen");
const Route = require("../models/Route");

const addFuelAllowance = async (req, res) => {
  let { driverId, routeId, amount, routescost, alreadypaidamouttoday } = req.body;
  console.log(req.body);

  amount = Number(alreadypaidamouttoday) + Number(amount); // Ensure it's a number

  if (!driverId || !routeId || isNaN(amount)) {
    return res.status(400).json({
      message: "driverId, routeId, and amount are required.",
    });
  }

  try {
    const deliveryman = await Deliverymen.findById(driverId);
    const route = await Route.findById(routeId);

    if (!deliveryman) {
      return res.status(404).json({ message: "Deliveryman not found." });
    }

    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }

    if (!deliveryman.deliverymensdue) {
      deliveryman.deliverymensdue = 0;
    }

    if (amount > routescost) {
      console.log(amount);
      let balance = amount - routescost;
      deliveryman.deliverymensdue += balance;
    } else if (amount < routescost) {
      console.log("ss");
      let balance = routescost - amount;
      console.log("Balance to be adjusted:", balance);

      if (deliveryman.deliverymensdue > 0) {
        if (balance >= deliveryman.deliverymensdue) {
          balance -= deliveryman.deliverymensdue;
          deliveryman.deliverymensdue = 0;
        } else {
          deliveryman.deliverymensdue -= balance;
          balance = 0;
        }
      }
    }

    route.todaysAmount = amount;

    const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format
    const existingEntryIndex = route.delivery_history.findIndex(
      (entry) =>
        entry.driver.toString() === driverId.toString() &&
        entry.assigned_at.toISOString().split("T")[0] === today
    );

    if (existingEntryIndex !== -1) {
      route.delivery_history[existingEntryIndex].fuelamount = amount;
    } else {
      route.delivery_history.push({
        driver: driverId,
        assigned_at: new Date(),
        fuelamount: amount,
      });
    }

    await route.save();
    await deliveryman.save();

    console.log("Fuel allowance added successfully.");
    return res.status(200).json({
      status: 200,
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
