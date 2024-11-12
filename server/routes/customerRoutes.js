const express = require("express");
const customerController = require("../controller/customerController");
const router = express.Router();

router.post("/addcustomer", customerController.createCustomerAndOptimizeRoute);
router.get("/getallcustomers",customerController.getAllCustomers);

module.exports = router;
