const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const Route = require("../models/Route");

const createCustomer = async (req, res) => {
  try {
    const { name, address, location, phone, deliverytime, route_id } = req.body;

    const customer = new Customer({
      name,
      address,
      location,
      phone,
      deliverytime,
      route_id
    });

    await customer.save();
    //sort
    const route = await Route.findById(route_id);
    res.status(201).json({ message: "Customer created successfully", customer });
  } catch (error) {
    res.status(500).json({ message: "Error creating customer", error });
  }
};

module.exports = { createCustomer };
