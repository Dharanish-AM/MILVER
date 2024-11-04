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
    type: {
      type: String,
      enum: "Point",
      require: true,
    },
    coordinates: {
      type: [Number],
      require: true,
    },
  },
  to_cords: {
    type: {
      type: String,
      enum: "Point",
      require: true,
    },
    coordinates: {
      type: [Number],
      require: true,
    },
  },
  distance_km: {
    type: Number,
  },
  customers: {
    type: [Number],
    default: null,
  },
});

// Enable auto-increment for route_id
routeSchema.plugin(AutoIncrement, { inc_field: "route_id" });

const Route = mongoose.model("Route", routeSchema);
module.exports = Route;
