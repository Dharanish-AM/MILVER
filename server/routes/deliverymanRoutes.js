const express = require("express");
const deliverymanController = require("../controller/deliverymanController")

const router = express.Router();

router.post("/createdeliverymen", deliverymanController.createDeliveryman);
router.post("/deletedeliverymen", deliverymanController.deleteDeliveryman);
router.post("/editdeliverymen", deliverymanController.editDeliveryman);
router.get("/getalldeliverymen",deliverymanController.getalldeliverymen);
router.post('/absent', deliverymanController.allocateDeliveryman)

module.exports = router;
 