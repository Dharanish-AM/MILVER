const mongoose = require("mongoose");

const FuelAllowanceSchema = new mongoose.Schema({
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deliverymen",
    required: true,
  },
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  fuel_allowance: {
    type: Number,
    required: true,
  },
  extra_amount: { 
    type: Number,
    default: 0,
  },
  distance: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    enum: ["Paid", "Not Paid"],
    default: "Not Paid",
  },
  payment_mode: {
    type: String,
    enum: ["Cash", "Fleet Card"],
  },
});

module.exports = mongoose.model("FuelAllowance", FuelAllowanceSchema);
