const express = require("express");
const {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  SDT,
  assignDeliverymenManual,
  fuelreport
} = require("../controllers/RouteController");

const router = express.Router();

router.get("/", getAllRoutes);
router.get("/getroute", getRouteById); 
router.post("/", createRoute);
  
router.put("/", updateRoute); 
router.delete("/", deleteRoute);
router.post("/assigndeliverymenmanual", assignDeliverymenManual);
router.get("/report",fuelreport);
module.exports = router;
