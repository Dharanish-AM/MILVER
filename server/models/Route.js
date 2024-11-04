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
  from_coordinates: {
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
  to_coordinates: {
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
  customers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
  ],
});

const Route = mongoose.model("Route", routeSchema);
module.exports = Route;
