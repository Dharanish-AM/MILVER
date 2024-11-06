const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

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
  from_cords: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  to_cords: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  distance_km: {
    type: Number,
  },
  customers: [],
});
routeSchema.index({ from_cords: "2dsphere" });
routeSchema.index({ to_cords: "2dsphere" });

routeSchema.plugin(AutoIncrement, { inc_field: "route_id" });

const Route = mongoose.model("Route", routeSchema);
module.exports = Route;