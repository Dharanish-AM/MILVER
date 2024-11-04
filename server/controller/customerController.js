const Customer = require("../models/Customer");
const Route = require("../models/Route");
const createCustomer = async (req, res) => {
  try {
    const {
      name,
      address,
      location, 
      phone,
      estimatedtime,
      deliverytime,
    } = req.body;

    const nearbyRoutes = await Route.find({
      location: {
        $near: {
          $geometry: location,
          $maxDistance: 10000, 
        },
      },
    });

    if (nearbyRoutes.length === 0) {
      return res.status(404).json({ error: "No nearby routes found" });
    }

    nearbyRoutes.sort((a, b) => a.distance_km - b.distance_km);

    const assignedRoute = nearbyRoutes[0];

    const customer = new Customer({
      name,
      address,
      location,
      phone,
      route: assignedRoute.route_id,
      estimatedtime,
      deliverytime,
    });
    await customer.save();
    assignedRoute.customers.push(customer._id); 
    await assignedRoute.save();

    res
      .status(201)
      .json({ message: "Customer created and route optimized successfully", customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
