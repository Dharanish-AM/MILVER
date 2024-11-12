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
    default: "Royapettah"
  },
  to: {
    type: String,
    required: true,
  },
  from_cords: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [80.26375998957623, 13.054398115031136]
    }
  },
  to_cords: {
    type: {
      type: String,
      enum: ["Point"],
      required: false,
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: false,
      default: [80.26375998957623, 13.054398115031136]
    }
  },
  distance_km: {
    type: Number,
    default: 0
  },
  customers: {
    type: [Number],
    default: []
  },
  delivery_man_id: {
    type: Number,
    default: 0
  }
});

routeSchema.index({ from_cords: "2dsphere" });
routeSchema.index({ to_cords: "2dsphere" });

routeSchema.plugin(AutoIncrement, { inc_field: "route_id" });

module.exports = mongoose.model("Route", routeSchema);
