const Customer = require("../models/Customer");
const Route = require("../models/Route");
const createCustomer = async (req, res) => {
  try {
    const {
      name,
      address,
      location, // { type: "Point", coordinates: [longitude, latitude] }
      phone,
      estimatedtime,
      deliverytime,
    } = req.body;

    // Find nearby routes within a 10 km radius, sorted by proximity
    const nearbyRoutes = await Route.find({
      to_cords: {
        $near: {
          $geometry: location,
          $maxDistance: 10000, // 10 km in meters
        },
      },
    });

    if (nearbyRoutes.length === 0) {
      return res.status(404).json({ error: "No nearby routes found" });
    }

    // Sort the nearby routes by distance_km (ascending order)
    nearbyRoutes.sort((a, b) => a.distance_km - b.distance_km);

    // Assign the customer to the closest route
    const assignedRoute = nearbyRoutes[0];

    // Create a new customer and assign the route
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

    const customerDetails = await Customer.find({
      _id: { $in: assignedRoute.customers },
    });

    customerDetails.sort((a, b) => {
      const distanceA = calculateDistance(location.coordinates, a.location.coordinates);
      const distanceB = calculateDistance(location.coordinates, b.location.coordinates);
      return distanceA - distanceB;
    });

    assignedRoute.customers = customerDetails.map((cust) => cust._id);
    await assignedRoute.save();

    res.status(201).json({
      message: "Customer created and route optimized successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateDistance = (coords1, coords2) => {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const R = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
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
