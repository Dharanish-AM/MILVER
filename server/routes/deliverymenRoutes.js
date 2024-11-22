const express = require("express");
const {
  getAllDeliverymen,
  getDeliverymanById,
  createDeliveryman,
  updateDeliveryman,
  deleteDeliveryman,
} = require("../controllers/deliverymenController");

const router = express.Router();


router.get("/", getAllDeliverymen);

router.get("/", getDeliverymanById); // Adjusted route to reflect changes
router.post("/", createDeliveryman);
router.put("/", updateDeliveryman); // Adjusted route to reflect changes
router.delete("/", deleteDeliveryman); // Adjusted route to reflect changes

module.exports = router;

