const Deliveryman = require("../models/Deliveryman")
const Routes=require('../models/Route')
const Customer=require("../models/Customer")

const createDeliveryman = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      primaryroutes,
      externalroutes,
      status
    } = req.body;

    const Delivery = new Deliveryman({
      name,
      phone,
      email,
      address,
      primaryroutes,
      externalroutes,
      status
    });

    await Delivery.save();
    res.status(201).json({ message: "Deliveryman created successfully", Deliveryman });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deliverymanAllocation=async(req,res)=>{
  
}
module.exports = {

  createDeliveryman,deliverymanAllocation
};
