const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BottleSchema = new Schema({
  route_id: {
    type: Number,
    required: true,
  },
  bottle_details: [
    {
      customer_id: {
        type: Number,
        required: true,
      },
      bottles_delivery_details: [
        {
          date: {
            type: Date,
            default: Date.now,
          },
          status: {
            type: String,
            enum: ["completed", "pending", "failed"],
            default: "pending",
          },
          deliveryman_id: {
            type: Number,
            required: true,
          },
        },
      ],
      bottle_collection_details: [
        {
          date: {
            type: Date,
            default: Date.now,
          },
          count: {
            type: Number,
            required: true,
          },
          deliveryman_id: {
            type: Number,
            required: true,
          },
        },
      ],
      bottle_broken_details: [
        {
          date: {
            type: Date,
            default: Date.now,
          },
          count: {
            type: Number,
            required: true,
          },
          deliveryman_id: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
});

const BottleTransaction = mongoose.model("BottleTransaction", BottleSchema);

module.exports = BottleTransaction;
