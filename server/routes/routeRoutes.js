const express = require("express");
const router = express.Router();
const routeController = require("../controller/RouteController");

router.post("/", routeController.createRoute);
router.get("/getallroutes", routeController.getAllRoutes)


module.exports = router;
