const Customer = require("../models/Customer");
const Route = require("../models/Route");
const { route } = require("../routes/customerRoutes");

const createCustomer = async (req, res) => {
  try {
    const { name, address, location, phone, estimatedtime, deliverytime } =
      req.body;
    console.log("body of the customer : ", req.body);
    const newdata = new Customer({
      name,
      address,
      location,
      phone,
      estimatedtime,
      deliverytime,
    });
    console.log("new customer data  : ", newdata);
    await newdata.save();
    const newroute = await Route.find({});

    if (!newroute) {
      return res.status(404).json({ message: "No available route found." });
    }
    console.log("new route : ", newroute);
    if (newroute[0]) {
      console.log("data validated ....");
      newroute[0].customers.push(newdata.customer_id);
      console.log("data died ////");
      await newroute[0].save();
    }
    res.status(201).json({
      message: "Customer created and added to route successfully",
      customer: newdata,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate("route");
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate("route");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res
      .status(500)
      .json(
        "There was an error in passing in the data from the database : ",
        error
      );
  }
};

const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("route");

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res
      .status(200)
      .json({ message: "Customer updated successfully", updatedCustomer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
