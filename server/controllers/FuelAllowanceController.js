const FuelAllowance = require("../models/FuelAllowance");

const createFuelAllowance = async (req, res) => {
  try {
    const { driverId, routeId, allowanceAmount } = req.body;

    const newAllowance = new FuelAllowance({
      driverId,
      routeId,
      allowanceAmount,
      createdAt: new Date(),
    });

    const savedAllowance = await newAllowance.save();
    res.status(201).json(savedAllowance);
  } catch (error) {
    res.status(500).json({ message: "Failed to create fuel allowance", error });
  }
};

const getAllFuelAllowances = async (req, res) => {
  try {
    const allowances = await FuelAllowance.find().populate("driverId routeId");
    res.status(200).json(allowances);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch fuel allowances", error });
  }
};

const getFuelAllowanceById = async (req, res) => {
  try {
    const { allowanceId } = req.body; // changed from req.params to req.body
    const allowance = await FuelAllowance.findById(allowanceId).populate(
      "driverId routeId"
    );
    if (!allowance) {
      return res.status(404).json({ message: "Fuel allowance not found" });
    }
    res.status(200).json(allowance);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch fuel allowance", error });
  }
};

const updateFuelAllowance = async (req, res) => {
  try {
    const { allowanceId, allowanceAmount } = req.body; 

    const updatedAllowance = await FuelAllowance.findByIdAndUpdate(
      allowanceId,
      { allowanceAmount },
      { new: true }
    );
    if (!updatedAllowance) {
      return res.status(404).json({ message: "Fuel allowance not found" });
    }

    res.status(200).json(updatedAllowance);
  } catch (error) {
    res.status(500).json({ message: "Failed to update fuel allowance", error });
  }
};

const deleteFuelAllowance = async (req, res) => {
  try {
    const { allowanceId } = req.body; // changed from req.params to req.body

    const deletedAllowance = await FuelAllowance.findByIdAndDelete(allowanceId);
    if (!deletedAllowance) {
      return res.status(404).json({ message: "Fuel allowance not found" });
    }

    res.status(200).json({ message: "Fuel allowance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete fuel allowance", error });
  }
};

module.exports = {
  createFuelAllowance,
  getAllFuelAllowances,
  getFuelAllowanceById,
  updateFuelAllowance,
  deleteFuelAllowance,
};
