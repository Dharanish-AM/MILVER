const Bottle = require("../models/Bottle");

const getAllBottles = async (req, res) => {
  try {
    const bottles = await Bottle.find().populate("delivery_id route_id");
    res.json(bottles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bottle records", error });
  }
};

const getBottleById = async (req, res) => {
  try {
    const { bottleId } = req.body;
    const bottle = await Bottle.findById(bottleId).populate(
      "delivery_id route_id"
    );
    if (!bottle)
      return res.status(404).json({ message: "Bottle record not found" });
    res.json(bottle);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bottle record", error });
  }
};

const createBottle = async (req, res) => {
  try {
    const { delivery_id, route_id, date, deliveries } = req.body;
    const newBottle = new Bottle({
      delivery_id,
      route_id,
      date,
      deliveries,
    });
    await newBottle.save();
    res.status(201).json(newBottle);
  } catch (error) {
    res.status(400).json({ message: "Error creating bottle record", error });
  }
};

const updateBottle = async (req, res) => {
  try {
    const { bottleId, ...updateData } = req.body;
    const updatedBottle = await Bottle.findByIdAndUpdate(bottleId, updateData, {
      new: true,
    }).populate("delivery_id route_id");

    if (!updatedBottle)
      return res.status(404).json({ message: "Bottle record not found" });
    res.json(updatedBottle);
  } catch (error) {
    res.status(400).json({ message: "Error updating bottle record", error });
  }
};

const deleteBottle = async (req, res) => {
  try {
    const { bottleId } = req.body;
    const deletedBottle = await Bottle.findByIdAndDelete(bottleId);
    if (!deletedBottle)
      return res.status(404).json({ message: "Bottle record not found" });
    res.json({ message: "Bottle record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bottle record", error });
  }
};

module.exports = {
  getAllBottles,
  getBottleById,
  createBottle,
  updateBottle,
  deleteBottle,
};
