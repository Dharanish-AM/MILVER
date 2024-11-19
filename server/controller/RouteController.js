const Customer = require("../models/Customer");
const Deliveryman = require("../models/Deliveryman");
const Route = require("../models/Route");

const createRoute = async (req, res) => {
  try {
    const { to } = req.body;
    const route = new Route({
      to
    });

    await route.save();
    res.status(201).json({ message: "Route created successfully", route });
  } catch (error) {
    res.status(500).json({ message: "Error creating route", error });
  }
};

const getAllRoutes = async (req, res) => {
  try {
    console.log("Fetching all routes...");
    const routes = await Route.find();

    // Resolve driver and customer data for each route
    const routesData = await Promise.all(
      routes.map(async (eachRoute) => {
        const routeId = eachRoute.route_id;
        const to = eachRoute.to
        let driverData = null;

        // Fetch driver details if delivery_man is assigned
        if (eachRoute.delivery_man_id) {
          const deliveryMan = await Deliveryman.findOne({ deliveryman_id: eachRoute.delivery_man_id });
          if (deliveryMan) {
            driverData = {
              delivery_man_id: deliveryMan.deliveryman_id,
              name: deliveryMan.name,
              phone: deliveryMan.phone,
              email: deliveryMan.email,
              address: deliveryMan.address,
              primaryroutes: deliveryMan.primaryroutes,
              externalroutes: deliveryMan.externalroutes,
              external_status: deliveryMan.external_status,
              status: deliveryMan.status,
              location: deliveryMan.location?.coordinates || [], // Location in [longitude, latitude]
              to:to,
            };
          }
        }

        // Fetch customers associated with the route
        const customers = Array.isArray(eachRoute.customers) ? eachRoute.customers : [];
        const customerPromises = customers.map(async (customerId) => {
          const customerDetails = await Customer.findOne({ customer_id: customerId });
          return customerDetails
            ? {
              customer_id: customerDetails.customer_id,
              name: customerDetails.name,
              coordinates: customerDetails.location.coordinates,
              address: customerDetails.address,
              phone: customerDetails.phone,
            }
            : null;
        });

        // Resolve customer data and filter out null values
        const resolvedCustomers = await Promise.all(customerPromises);
        const filteredCustomers = resolvedCustomers.filter(Boolean);

        // Extract just the coordinates of each customer for the coordinates array
        const customerCoordinatesArray = filteredCustomers.map((customer) => customer.coordinates);


        return {
          route_id: routeId,
          driver: driverData,
          customers: filteredCustomers,
        };
      })
    );

    console.log(`Successfully fetched ${routesData.length} routes.`);
    res.status(200).json({
      message: "Successfully fetched all routes data",
      data: routesData,
    });
  } catch (err) {
    console.error("Error fetching routes:", err.message);
    res.status(500).json({
      message: "Failed to fetch routes from the database.",
      error: err.message,
    });
  } 
};


module.exports = {
  createRoute,
  getAllRoutes,
};
