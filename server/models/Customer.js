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
    type: Number,
  },
  estimatedtime: {
    type: Date,
    required: true,
  },
  deliverytime: {
    type: Date,
  },
});

// Enable auto-increment for customer_id
CustomerSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

CustomerSchema.index({ location: "2dsphere" });

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
