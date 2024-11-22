const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const DeliverymenSchema = new Schema({
  driver_id: {
    type: Number,
    unique: true,
    sparse: true,
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
  routes: [{ type: Schema.Types.ObjectId, ref: "Route", required: true }],
  category: { 
    type: String,
    enum: ["main_driver", "backup_driver"],
    require: true,
  },
  status: {
    type: String,
    enum: ["available", "unavailable", "on_leave", "assigned"],
    default: "available",
  },
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
  balance: {  
    type: Number,
    default: 0,
  },
  totalamount:{
    type:Number,
    default:0
  },
  extraAmount: {
    type: Number,
    default: 0,
  },
  
});

DeliverymenSchema.plugin(AutoIncrement, { inc_field: "driver_id" });

let Deliverymen;
try {
  Deliverymen = mongoose.model("Deliverymen");
} catch (error) {
  Deliverymen = mongoose.model("Deliverymen", DeliverymenSchema);
}

module.exports = Deliverymen;
