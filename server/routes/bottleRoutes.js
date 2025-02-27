const express = require("express");
const router = express.Router();
const bottleController = require("../controllers/bottleController");

router.post("/create", bottleController.createBottleEntry);
router.put("/update", bottleController.updateBottleStatus);
router.get("/details/:route_id", bottleController.fetchBottleDetailsByRoute);
router.get('/get-all-bottles',bottleController.fetchAllBottles)


module.exports = router;
