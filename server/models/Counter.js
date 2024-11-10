const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  field: { type: String, required: true },
  count: { type: Number, default: 0 },
});
const Counter = mongoose.model("Counter", CounterSchema);
module.exports = Counter;
