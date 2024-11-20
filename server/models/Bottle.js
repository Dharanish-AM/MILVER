const mongoose = require("mongoose");

const BottleSchema = new mongoose.Schema({
  delivery_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deliverymen",
    required: true,
  },
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  deliveries: [
    {
      deliveredBottles: {
        oneLitre: { type: Number, required: true },
        halfLitre: { type: Number, required: true },
      },
      brokenBottles: {
        oneLitre: { type: Number, required: true },
        halfLitre: { type: Number, required: true },
      },
      emptyBottlesCollected: {
        oneLitre: { type: Number, required: true },
        halfLitre: { type: Number, required: true },
      },
      notReturnedBottles: {
        oneLitre: { type: Number, required: true },
        halfLitre: { type: Number, required: true },
      },
    },
  ],
});

module.exports = mongoose.model("Bottle", BottleSchema);
