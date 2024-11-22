const FuelAllowance = require("../models/FuelAllowance");
const Deliverymen = require("../models/Deliverymen");
const Route=require("../models/Route");
// const createFuelAllowance = async (req, res) => {
//   try {
//     const { driverId, routeId, allowanceAmount, extraAmount = 0 } = req.body;
//     const newAllowance = new FuelAllowance({
//       driver_id: driverId,
//       route_id: routeId,
//       fuel_allowance: allowanceAmount,
//       extra_amount: extraAmount, 
//       createdAt: new Date(),
//     });


//     const savedAllowance = await newAllowance.save();

//     if (extraAmount > 0) {
//       const driver = await Deliverymen.findById(driverId);
//       if (driver) {
//         driver.balance += extraAmount; 
//         await driver.save();
//       }
//     }

//     res.status(201).json(savedAllowance);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create fuel allowance", error });
//   }
// };

// const getAllFuelAllowances = async (req, res) => {
//   try {
//     const allowances = await FuelAllowance.find().populate("driver_id route_id");
//     res.status(200).json(allowances);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch fuel allowances", error });
//   }
// };

// const getFuelAllowanceById = async (req, res) => {
//   try {
//     const { allowanceId } = req.body;
//     const allowance = await FuelAllowance.findById(allowanceId).populate(
//       "driver_id route_id"
//     );
//     if (!allowance) {
//       return res.status(404).json({ message: "Fuel allowance not found" });
//     }
//     res.status(200).json(allowance);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch fuel allowance", error });
//   }
// };

// const updateFuelAllowance = async (req, res) => {
//   try {
//     const { allowanceId, allowanceAmount, extraAmount = 0 } = req.body;

//     const updatedAllowance = await FuelAllowance.findByIdAndUpdate(
//       allowanceId,
//       { fuel_allowance: allowanceAmount, extra_amount: extraAmount },
//       { new: true }
//     );

//     if (!updatedAllowance) {
//       return res.status(404).json({ message: "Fuel allowance not found" });
//     }

//     // If there's an extra amount, update the driver's balance
//     if (extraAmount > 0) {
//       const driver = await Deliverymen.findById(updatedAllowance.driver_id);
//       if (driver) {
//         driver.balance += extraAmount; // Add extra amount to driver's balance
//         await driver.save();
//       }
//     }

//     res.status(200).json(updatedAllowance);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update fuel allowance", error });
//   }
// };

// const deleteFuelAllowance = async (req, res) => {
//   try {
//     const { allowanceId } = req.body;

//     const deletedAllowance = await FuelAllowance.findByIdAndDelete(allowanceId);
//     if (!deletedAllowance) {
//       return res.status(404).json({ message: "Fuel allowance not found" });
//     }

//     res.status(200).json({ message: "Fuel allowance deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete fuel allowance", error });
//   }
// };

// module.exports = {
//   createFuelAllowance,
//   getAllFuelAllowances,
//   getFuelAllowanceById,
//   updateFuelAllowance,
//   deleteFuelAllowance,
// };


const updateDefaultAmountAndBalance = async (req, res) => {
  const { routeId, deliverymanId, totalcost, todaysamount } = req.body;
console.log(req.body)
  if (!routeId || !deliverymanId || totalcost === undefined || todaysamount === undefined) {
    return res.status(400).json({
      message: "routeId, deliverymanId, totalcost, and todaysamount are required.",
    });
  }

  try {
    const route = await Route.findById(routeId);
    const deliveryman = await Deliverymen.findById(deliverymanId);

    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }

    if (!deliveryman) {
      return res.status(404).json({ message: "Deliveryman not found." });
    }

    route.defaultAmount = totalcost;
    await route.save();
    let extraAmount = deliveryman.extraAmount || 0; 
    let balanceChange = 0; 

    if (todaysamount > totalcost) {
      balanceChange = todaysamount - totalcost;
    
      if (deliveryman.extraAmount > 0) {
        if (balanceChange >= deliveryman.extraAmount) {
          balanceChange -= deliveryman.extraAmount; 
          deliveryman.extraAmount = 0; 
        } else {
          deliveryman.extraAmount -= balanceChange;
          balanceChange = 0;
        }
      }
    
      deliveryman.balance += balanceChange;
    }
     else {
      const deficit = totalcost - todaysamount;

      if (deliveryman.balance >= deficit) {
        deliveryman.balance -= deficit;
      } else {
        const remainingDeficit = deficit - deliveryman.balance;

        deliveryman.balance = 0; 
        if (remainingDeficit > 0) {
          extraAmount += remainingDeficit;
        }
      }
    }

    deliveryman.extraAmount = extraAmount;
    await deliveryman.save();

    return res.status(200).json({
      message: "Default amount and deliveryman's balance updated successfully.",
      route,
      deliveryman,
    });
  } catch (error) {
    console.error("Error updating default amount and balance:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports={
  updateDefaultAmountAndBalance
}