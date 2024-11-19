const mongoose = require("mongoose");

const PetrolAllowanceSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  totalAllowance: {
    type: Number, // Total monthly allowance
    required: true,
  },
  dailyAllowance: {
    type: Number, // Calculated as totalAllowance / 30
    required: true,
  },
  dailyCollections: [
    {
      driverId: {
        // Driver who collected the amount
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      collectedAmount: {
        type: Number,
        required: true,
      },
      extraAmount: {
        type: Number,
        required: true,
      },
    },
  ],
  totalExtraAmount: {
    type: Number,
    default: 0, 
  },
});

module.exports = mongoose.model("PetrolAllowance", PetrolAllowanceSchema);
