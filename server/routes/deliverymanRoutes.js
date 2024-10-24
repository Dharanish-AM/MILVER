const express = require("express");
const deliverymanController = require("../controller/deliverymanController")

const router = express.Router();

router.post("/deliverymen", deliverymanController.createDeliveryman);
router.get("/deliverymen", deliverymanController.getAllDeliverymen);
router.get("/deliverymen/:id", deliverymanController.getDeliverymanById);
router.put("/deliverymen/:id", deliverymanController.updateDeliveryman);
router.delete("/deliverymen/:id", deliverymanController.deleteDeliveryman);

module.exports = router;
