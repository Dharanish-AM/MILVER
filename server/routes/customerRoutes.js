const express = require("express");
const customerController = require("../controller/customerController");
const router = express.Router();

router.post("/", customerController.createCustomerAndOptimizeRoute);

module.exports = router;
