const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const routeSchema = new Schema({
  route_id: {
    type: Number,
    unique: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  distance_km: {
    type: Number,
    required: true,
  },
  customers: [
    {
      customer_id: {
        type: Number,
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
});

routeSchema.index({ customers: "2dsphere" });
const Route = mongoose.model("Route", routeSchema);
module.exports = Route;
