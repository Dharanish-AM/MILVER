const express = require("express");
const {
  createBottle,
  getAllBottles,
  getBottleById,
  addBottleDetail,
  updateBottleDetails,
  deleteBottle,
  deleteBottleDetail,
} = require("../controllers/BottleController");

const router = express.Router();

router.post("/", createBottle);

router.get("/", getAllBottles);

router.post("/getById", getBottleById);

router.put("/addDetail", addBottleDetail);

router.put("/updateDetails", updateBottleDetails);

router.delete("/", deleteBottle);

router.delete("/deleteDetail", deleteBottleDetail);

module.exports = router;
