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
router.get("/:id", getDeliverymanById);
router.post("/", createDeliveryman);
router.put("/:id", updateDeliveryman);
router.delete("/:id", deleteDeliveryman);

module.exports = router;
