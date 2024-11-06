const Customer = require("../models/Customer");
const Route = require("../models/Route");
const Counter = require("../models/Counter");
const createCustomer = async (req, res) => {
  try {
    const { name, address, location, phone, estimatedtime, deliverytime } =
      req.body;

    console.log("Body of the customer: ", req.body);
    if (
      !location ||
      !location.coordinates ||
      location.coordinates.length !== 2
    ) {
      throw new Error("Invalid location data provided");
    }
    const locationData = {
      type: "Point",
      coordinates: location.coordinates, 
    };
    let counter = await Counter.findOne({ field: "customer_id" });
    if (!counter) {
      counter = new Counter({ field: "customer_id", count: 0 });
    }
    counter.count += 1;
    await counter.save();
    const newdata = new Customer({
      customer_id: counter.count,
      name,
      address,
      location: locationData, 
      phone,
      estimatedtime,
      deliverytime,
    });

    console.log("New customer data created: ", newdata);
    const routes = await Route.find({});
    if (!routes || routes.length === 0) {
      return res.status(404).json({ message: "No available route found." });
    }
    let shortestRoute = null;
    let shortestDistance = Infinity;

    const calculateDistance = (coords1, coords2) => {
      const toRadians = (degrees) => (degrees * Math.PI) / 180;
      const [lon1, lat1] = coords1;
      const [lon2, lat2] = coords2;

      const R = 6371; 
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; 
    };

    routes.forEach((route) => {
      if (
        !route.location ||
        !route.location.coordinates ||
        route.location.coordinates.length !== 2
      ) {
        console.log("Invalid route location:", route);
        return;
      }

      const distance = calculateDistance(
        location.coordinates,
        route.location.coordinates
      );
      if (distance < shortestDistance) {
        shortestDistance = distance;
        shortestRoute = route;
      }
    });

    if (shortestRoute) {
      console.log("Shortest route found: ", shortestRoute);
      shortestRoute.customers.push(newdata.customer_id);
      await shortestRoute.save();
    }

    await newdata.save();
    res.status(201).json({
      message: "Customer created and added to the shortest route successfully",
      customer: newdata,
      route: shortestRoute,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
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
    console.log("error occoured : ", error);
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
