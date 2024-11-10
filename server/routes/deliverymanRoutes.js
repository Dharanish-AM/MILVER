const express = require("express");
const deliverymanController = require("../controller/deliverymanController")

const router = express.Router();

router.post("/deliverymen", deliverymanController.createDeliveryman);

module.exports = router;
