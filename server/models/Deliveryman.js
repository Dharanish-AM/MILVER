const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const DeliverymanSchema = new Schema({
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
  primaryroutes: {
    type: Number,
    required: true,
  },
  externalroutes: {
    type: [Number],
    required: false,
  },
  external_status: {
    type: String,
    enum: ["available", "unavailable", "on_leave"],
    default: "unavailable",
  },
  status: {
    type: String,
    enum: ["available", "unavailable", "on_leave"],
    default: "available",
  },
  // delivery_history: [
  //   {
  //     customer: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Customer",
  //     },
  //     delivered_at: {
  //       type: Date,
  //       required: true,
  //     },
  //     status: {
  //       type: String,
  //       enum: ["delivered", "failed", "returned"],
  //       default: "delivered",
  //     },
  //   },
  // ],
});

DeliverymanSchema.plugin(AutoIncrement, { inc_field: "deliveryman_id" });
DeliverymanSchema.index({ location: "2dsphere" });

const Deliveryman = mongoose.model("deliverymen", DeliverymanSchema);

module.exports = Deliveryman;

