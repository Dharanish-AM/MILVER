const Bottle = require("../models/Bottle");


exports.createBottleEntry = async (req, res) => {
  try {
    const { route_id, total } = req.body;

    if (!route_id || total === undefined) {
      return res.status(400).json({ message: "Route ID and total bottles are required." });
    }

    const newBottle = new Bottle({
      route_id,
      bottle_details: [{ total, delivered: 0, damaged: 0, returned: 0, date: new Date() }],
    });

    await newBottle.save();
    return res.status(201).json({ message: "Bottle entry created successfully.", data: newBottle });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
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

  }
  catch (err) {

  }
}

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
