const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
  route_id: {
    type: Number,
    required: true,
  },
  route_name: {
    type: String,
    required: true,
  },
  from_location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  to_location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  distance: {
    type: Number,
    required: true,
  },
  delivery_person: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  customers: [
    {
      customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
      },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },
  ],
  temp_drivers: [
    {
      driver_id: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  ],
});

routeSchema.index({ from_location: "2dsphere" });
routeSchema.index({ to_location: "2dsphere" });
routeSchema.index({ "customers.location": "2dsphere" });
const Route = mongoose.model("Route", routeSchema);
module.exports = Route;