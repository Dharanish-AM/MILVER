const Bottle = require("../models/Bottle");
const Route=require("../models/Route")
const Deliverymen=require("../models/Deliverymen")
exports.createBottleEntry = async (req, res) => {
  try {
    const { driver_objid, route_objid, totalBottles } = req.body;
    
    console.log(req.body);
    
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

    let existingBottle = await Bottle.findOne({ route_id: route._id });

    if (existingBottle) {
      // Append new bottle entry to the existing document
      existingBottle.bottle_details.push({
        deliverymanid: driver._id, // ✅ Added deliverymanid (driver_objid)
        total: totalBottles,
        delivered: 0,
        damaged: 0,
        returned: 0,
        date: new Date(),
      });

      await existingBottle.save();
    } else {
      existingBottle = new Bottle({
        route_id: route._id,
        bottle_details: [
          {
            deliverymanid: driver._id, // ✅ Added deliverymanid (driver_objid)
            total: totalBottles,
            delivered: 0,
            damaged: 0,
            returned: 0,
            date: new Date(),
          },
        ],
      });

      await existingBottle.save();
    }

    res.json({
      message: "Driver assigned and bottle entry updated successfully",
      route,
      bottleEntry: existingBottle,
    });
  } catch (error) {
    console.error("Error assigning driver:", error);
    res.status(500).json({ message: "Error assigning driver", error: error.message });
  }
};



exports.updateBottleStatus = async (req, res) => {
  try {
    const { bottleId, delivered, damaged, returned } = req.body;

    if (!bottleId) {
      return res.status(400).json({ message: "Bottle ID is required." });
    }

    const bottle = await Bottle.findById(bottleId);
    if (!bottle) {
      return res.status(404).json({ message: "Bottle entry not found." });
    }


    bottle.bottle_details.push({
      total: bottle.bottle_details[bottle.bottle_details.length - 1]?.total || 0,
      delivered: delivered || 0,
      damaged: damaged || 0,
      returned: returned || 0,
      date: new Date(),
    });

    await bottle.save();
    return res.status(200).json({ message: "Bottle status updated successfully.", data: bottle });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.fetchAllBottles = async (req, res) => {
  try {
    const bottles = await Bottle.find().populate("route_id");

    return res.status(200).json({
      message: "Bottles fetched successfully.",
      data: bottles,
    });
  } catch (error) {
    console.error("Error fetching bottles:", error);

    return res.status(500).json({
      message: "Server error while fetching bottles.",
      error: error.message,
    });
  }
};


exports.fetchBottleDetailsByRoute = async (req, res) => {
  try {
    const { route_id } = req.params;

    if (!route_id) {
      return res.status(400).json({ message: "route_id is required" });
    }

    const bottles = await Bottle.find({ route_id }).populate("route_id");

    if (!bottles.length) {
      return res.status(404).json({ message: "No bottle records found for this route" });
    }

    res.status(200).json({ message: "Bottle details fetched successfully", bottles });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
