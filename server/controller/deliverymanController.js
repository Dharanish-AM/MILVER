const Deliveryman = require("../models/Deliveryman");

const createDeliveryman = async (req, res) => {
  try {
    const {
      Deliveryman_id,
      name,
      phone,
      email,
      address,
      location,
      primaryroutes,
      externalroutes,
      status,
      assigned_customers,
      delivery_history,
    } = req.body;

    const Deliveryman = new Deliveryman({
      Deliveryman_id,
      name,
      phone,
      email,
      address,
      location,
      primaryroutes,
      externalroutes,
      status,
      assigned_customers,
      delivery_history,
    });

    await Deliveryman.save();
    res.status(201).json({ message: "Deliveryman created successfully", Deliveryman });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllDeliverymen = async (req, res) => {
  try {
    const deliverymen = await Deliveryman.find(); // No populate, just raw data
    res.status(200).json(deliverymen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDeliverymanById = async (req, res) => {
  try {
    const Deliveryman = await Deliveryman.findById(req.params.id); // No populate
    if (!Deliveryman) {
      return res.status(404).json({ message: "Deliveryman not found" });
    }
    res.status(200).json(Deliveryman);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDeliveryman = async (req, res) => {
  try {
    const updatedDeliveryman = await Deliveryman.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDeliveryman) {
      return res.status(404).json({ message: "Deliveryman not found" });
    }

    res.status(200).json({
      message: "Deliveryman updated successfully",
      updatedDeliveryman,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDeliveryman = async (req, res) => {
  try {
    const deletedDeliveryman = await Deliveryman.findByIdAndDelete(req.params.id);

    if (!deletedDeliveryman) {
      return res.status(404).json({ message: "Deliveryman not found" });
    }

    res.status(200).json({ message: "Deliveryman deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDeliveryman,
  getAllDeliverymen,
  getDeliverymanById,
  updateDeliveryman,
  deleteDeliveryman,
};
