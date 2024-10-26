const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  customer_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
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
  phone: {
    type: String,
    required: true,
  },
  route: {
    //type: mongoose.Schema.Types.ObjectId,
    type: Number,
    //ref: "Route",
  },
  estimatedtime: {
    type: Date,
    required: true,
  },
  deliverytime: {
    type: Date,
  },
});

CustomerSchema.index({ location: "2dsphere" });

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
