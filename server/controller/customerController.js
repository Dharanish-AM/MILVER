const Customer = require("../models/Customer");
const Route = require("../models/Route");

const haversine = (coord1, coord2) => {
  const toRad = (deg) => deg * (Math.PI / 180);

  const lat1 = coord1[1];
  const lon1 = coord1[0];
  const lat2 = coord2[1];
  const lon2 = coord2[0];

  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const DEFAULT_LOCATION = {
  name: "Royapettah",
  coordinates: [80.26375998957623, 13.054398115031136],
};

const createCustomerAndOptimizeRoute = async (req, res) => {
  try {
    const { name, address, location, phone, deliverytime, route_id, customer_id } = req.body;

    const customerLocation = location || DEFAULT_LOCATION;

    const customer = new Customer({
      name,
      address,
      location: customerLocation,
      phone,
      deliverytime,
      customer_id,
    });
    await customer.save();

    console.log(`New customer added: ${customer.name}, ${customer.address}`);

    const route = await Route.findOne({ route_id });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    if (!route.customers) {
      route.customers = [];
    }

    route.customers.push(customer.customer_id);
    await route.save();

    console.log(`Customer ${customer.name} added to route ${route_id}`);

    const customers = await Customer.find({ customer_id: { $in: route.customers } });

    if (customers.length <= 1) {
      return res.status(201).json({ message: "Customer created. No optimization needed.", customer });
    }

    let customerCoordinates = customers.map(cust => ({
      id: cust.customer_id,
      coordinates: cust.location.coordinates,
    }));

    console.log("Customer coordinates before sorting:", customerCoordinates);

    const sortedCustomers = [];
    let currentLocation = DEFAULT_LOCATION.coordinates;

    while (customerCoordinates.length > 0) {
      const closestCustomer = customerCoordinates.reduce((closest, customer) => {
        const distance = haversine(currentLocation, customer.coordinates);
        if (!closest || distance < closest.distance) {
          return { ...customer, distance };
        }
        return closest;
      }, null);

      sortedCustomers.push(closestCustomer.id);

      currentLocation = closestCustomer.coordinates;

      customerCoordinates = customerCoordinates.filter(customer => customer.id !== closestCustomer.id);
    }

    console.log("Sorted customers:", sortedCustomers);

    route.customers = sortedCustomers;

    const lastCustomer = await Customer.findOne({ customer_id: sortedCustomers[sortedCustomers.length - 1] });
    if (lastCustomer) {
      route.to_cords = { type: "Point", coordinates: lastCustomer.location.coordinates };
    }

    await route.save();

    console.log(`Route ${route_id} updated with sorted customer order and last customer coordinates`);

    res.status(201).json({ message: "Customer created and route optimized", customer });
  } catch (error) {
    console.error("Error creating customer or optimizing route:", error);
    res.status(500).json({ message: "Error creating customer or optimizing route", error: error.message });
  }
};

module.exports = { createCustomerAndOptimizeRoute };
