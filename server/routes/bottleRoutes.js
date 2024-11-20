const express = require("express");
const {
  getAllBottles,
  getBottleById,
  createBottle,
  updateBottle,
  deleteBottle,
} = require("../controllers/bottleController");

const router = express.Router();

router.get("/", getAllBottles);
router.post("/getById", getBottleById); 
router.post("/", createBottle);
router.put("/update", updateBottle); 
router.delete("/delete", deleteBottle); 

module.exports = router;
