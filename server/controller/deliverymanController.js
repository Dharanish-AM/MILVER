const Deliveryman = require("../models/Deliveryman")
const Routes = require('../models/Route')
const Customer = require("../models/Customer")

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

const allocateDeliveryman = async (req, res) => {
  try {
    const royapettahCoordinates = [80.26375998957623, 13.054398115031136];
    const { route_id } = req.body;

    const absentDeliverymen = await Deliveryman.find({ primaryroutes: route_id, status: "on_leave" });

    if (!absentDeliverymen || absentDeliverymen.length === 0) {
      return res.status(404).json({
        message: "No absent deliveryman found for the specified route",
      });
    }

    const route = await Routes.findOne({ route_id });
    if (!route || route.customers.length === 0) {
      return res.status(404).json({
        message: "No customers found for the specified route",
      });
    }

    const absentCustomerIds = route.customers;
    const absentCustomers = await Customer.find({ customer_id: { $in: absentCustomerIds } });
    const absentCustomerCoordinates = absentCustomers.map((customer) => customer.location.coordinates);

    const availableDeliverymen = await Deliveryman.find({ externalroutes: route_id, status: "available" });
    if (!availableDeliverymen || availableDeliverymen.length === 0) {
      return res.status(404).json({
        message: "No available deliverymen with knowledge of the absent deliveryman's route",
      });
    }

    const availableDeliveryman = availableDeliverymen[0];
    const knownRoute = await Routes.findOne({ route_id: { $in: availableDeliveryman.primaryroutes } });
    const knownCustomerIds = knownRoute ? knownRoute.customers : [];

    const knownCustomers = await Customer.find({ customer_id: { $in: knownCustomerIds } });
    const knownCustomerCoordinates = knownCustomers.map((customer) => customer.location.coordinates);

    const allCustomerCoordinates = [...absentCustomerCoordinates, ...knownCustomerCoordinates];

    const sortedCoordinates = allCustomerCoordinates.map((coordinates) => {
      const distance = haversineDistance(royapettahCoordinates, coordinates);
      return { coordinate: coordinates, distance };
    }).sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      message: "Coordinates sorted successfully",
      sortedCoordinates,
    });

  } catch (error) {
    console.error("Error during deliveryman allocation:", error.message);
    res.status(500).json({
      message: "An error occurred during allocation",
      error: error.message,
    });
  }
};

const haversineDistance = (coord1, coord2) => {
  const R = 6371;
  const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
  const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};



module.exports = {

  createDeliveryman, allocateDeliveryman
};
