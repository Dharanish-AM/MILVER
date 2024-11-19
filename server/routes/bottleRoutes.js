const express = require("express");
const router = express.Router();
const bottleController = require("../controller/bottleController");

// Create a new bottle transaction
router.post("/transactions", bottleController.createBottleTransaction);

// Get all bottle transactions
router.get("/transactions", bottleController.getAllBottleTransactions);

// Get a bottle transaction by route_id
router.get("/transactions/:route_id", bottleController.getBottleTransactionByRouteId);

// Update bottle transaction details (delivery, collection, or broken)
router.put("/transactions/details", bottleController.updateBottleTransactionDetails);

// Delete a bottle transaction by route_id
router.delete("/transactions/:route_id", bottleController.deleteBottleTransaction);

module.exports = router;
