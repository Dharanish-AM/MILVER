const express = require("express");
const customerController = require("../controller/customerController");
const router = express.Router();

router.post("/customers", customerController.createCustomer);

module.exports = router;
