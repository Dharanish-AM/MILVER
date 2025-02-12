const mongoose = require("mongoose");

const BottleSchema = new mongoose.Schema({
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
  },
  bottle_details: {
    type: [
      {
        total: {
          type: Number,
          default: 0,
          require: true,
        },
        delivered: {
          type: Number,
          min: 0,
          default: 0,
        },
        damaged: {
          type: Number,
          min: 0,
          default: 0,
        },
        returned: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Bottle", BottleSchema);
