const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const DeliverymanSchema = new Schema(
  {
    deliveryman_id: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
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
    primaryroutes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
      },
    ],
    externalroutes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
        required: false,
      },
    ],
    status: {
      type: String,
      enum: ["available", "unavailable", "on_leave"],
      default: "available",
    },
    assigned_customers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
      },
    ],
    delivery_history: [
      {
        customer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer",
        },
        delivered_at: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ["delivered", "failed", "returned"],
          default: "delivered",
        },
      },
    ],
  },
  { timestamps: true }
);

// Enable auto-increment for deliveryman_id
DeliverymanSchema.plugin(AutoIncrement, { inc_field: "deliveryman_id" });

DeliverymanSchema.index({ location: "2dsphere" });

const Deliveryman = mongoose.model("Deliveryman", DeliverymanSchema);
module.exports = Deliveryman;
