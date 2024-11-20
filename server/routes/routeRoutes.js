const express = require("express");
const {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  SDT,
  assignDeliverymenManual
} = require("../controllers/RouteController");

const router = express.Router();

router.get("/", getAllRoutes);
router.get("/:id", getRouteById);
router.post("/", createRoute);
router.put("/:id", updateRoute);
router.delete("/:id", deleteRoute);

router.post("/assigndeliverymenmanual", assignDeliverymenManual);

module.exports = router;
