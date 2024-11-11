const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const db = require("./config/db");

const Customer = require("./routes/customerRoutes");
const Driver = require("./routes/deliverymanRoutes");
const Route = require("./routes/routeRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

db();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/customer", Customer);
app.use("/api/deliverymen", Driver);
app.use("/api/route", Route);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

