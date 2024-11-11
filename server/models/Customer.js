const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const CustomerSchema = new Schema({
  customer_id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
  phone: {
    type: String,
    required: true
  },
  route_id: {
    type: Number,
    default: null
  },
  deliverytime: {
    type: String,
    required: true
  },
});

// Apply the auto-increment plugin to the `customer_id` field
CustomerSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

// Index for location
CustomerSchema.index({ location: "2dsphere" });

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
