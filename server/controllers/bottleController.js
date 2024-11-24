const Bottle = require("../models/Bottle");

// Create a new Bottle
const createBottle = async (req, res) => {
  try {
    const { bottledetails } = req.body;

    const newBottle = new Bottle({
      bottledetails,
    });

    const savedBottle = await newBottle.save();
    res.status(201).json(savedBottle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Bottles
const getAllBottles = async (req, res) => {
  try {
    const bottles = await Bottle.find();
    res.status(200).json(bottles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Bottle by ID from body
const getBottleById = async (req, res) => {
  try {
    const { id } = req.body;

    const bottle = await Bottle.findById(id);

    if (!bottle) {
      return res.status(404).json({ message: "Bottle not found" });
    }

    res.status(200).json(bottle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a single entry to bottledetails from body
const addBottleDetail = async (req, res) => {
  try {
    const { id, detail } = req.body;

    const updatedBottle = await Bottle.findByIdAndUpdate(
      id,
      { $push: { bottledetails: detail } },
      { new: true }
    );

    if (!updatedBottle) {
      return res.status(404).json({ message: "Bottle not found" });
    }

    res.status(200).json(updatedBottle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Bottle's bottledetails from body
const updateBottleDetails = async (req, res) => {
  try {
    const { id, bottledetails } = req.body;

    const updatedBottle = await Bottle.findByIdAndUpdate(
      id,
      { bottledetails },
      { new: true }
    );

    if (!updatedBottle) {
      return res.status(404).json({ message: "Bottle not found" });
    }

    res.status(200).json(updatedBottle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Bottle by ID from body
const deleteBottle = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedBottle = await Bottle.findByIdAndDelete(id);

    if (!deletedBottle) {
      return res.status(404).json({ message: "Bottle not found" });
    }

    res.status(200).json({ message: "Bottle deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a single entry from bottledetails using body
const deleteBottleDetail = async (req, res) => {
  try {
    const { id, detailId } = req.body;

    const updatedBottle = await Bottle.findByIdAndUpdate(
      id,
      { $pull: { bottledetails: { _id: detailId } } },
      { new: true }
    );

    if (!updatedBottle) {
      return res.status(404).json({ message: "Bottle or detail not found" });
    }

    res.status(200).json(updatedBottle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBottle,
  getAllBottles,
  getBottleById,
  addBottleDetail,
  updateBottleDetails,
  deleteBottle,
  deleteBottleDetail,
};
