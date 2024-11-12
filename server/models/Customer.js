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
  route_id: {
    type: Number,
    default: null,
  },
  route_name: {
    type: String,
    require: true
  },
  deliverytime: {
    type: String,
    required: true,
  },
  history: {
    type: [
      {
        deliveryman_id: {
          type: Number,
          required: true,
        },
        delivery_status: {
          type: String,
          enum: ["delivered", "failed", "returned"],
          default: "delivered",
        },
        delivery_datetime: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: []
  },

});

// Apply the auto-increment plugin to the `customer_id` field
CustomerSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

// Index for location
CustomerSchema.index({ location: "2dsphere" });

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
