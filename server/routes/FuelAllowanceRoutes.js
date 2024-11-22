const express = require("express");
const router = express.Router();
const FuelAllowanceController = require("../controllers/FuelAllowanceController");


router.post("/update",FuelAllowanceController.addFuelAllowance);
module.exports = router;

