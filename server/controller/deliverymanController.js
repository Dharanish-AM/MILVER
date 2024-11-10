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


module.exports = {
  createDeliveryman,
};
