const express = require("express");
const router = express.Router();
const FuelAllowanceController = require("../controllers/FuelAllowanceController");

router.post("/", FuelAllowanceController.createFuelAllowance);

router.get("/", FuelAllowanceController.getAllFuelAllowances);

router.post("/getById", FuelAllowanceController.getFuelAllowanceById);

router.put("/update", FuelAllowanceController.updateFuelAllowance);

router.delete("/delete", FuelAllowanceController.deleteFuelAllowance); // changed to DELETE

module.exports = router;

