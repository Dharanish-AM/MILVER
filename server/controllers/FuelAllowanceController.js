const Deliverymen = require("../models/Deliverymen");
const Route = require("../models/Route");

const addFuelAllowance = async (req, res) => {
  const { driverId, routeId, amount,routescost} = req.body;
console.log(req.body)
console.log(parseInt(amount))
  if (!driverId || !routeId || amount === undefined) {
    return res.status(400).json({
      message: "driverId, routeId, and amount are required.",
    });
  }

  try {
    const deliveryman = await Deliverymen.findById(driverId);
const route=await Route.findById(routeId);
    if (!deliveryman) {
      return res.status(404).json({ message: "Deliveryman not found." });
    }

    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; // Extract YYYY-MM-DD

    let todayEntry = deliveryman.fuel_allowance.find(
      (entry) => entry.date.toISOString().split("T")[0] === todayString
    );

    if (!todayEntry) {
      todayEntry = { date: today,records:[] };
      todayEntry.records.push({
        amount,
        route_id: routeId,
        time: new Date(),
      });

      deliveryman.fuel_allowance.push(todayEntry);
    }

    todayEntry.records.push({
      amount,
      route_id: routeId,
      time: new Date(),
    });
    console.log(deliveryman.deliverymensdue)
    if(amount>routescost){
      let balance=amount-routescost;
      deliveryman.deliverymensdue+=balance;
    }
    else if(amount<routescost){
      let balance=(routescost-route.todaysAmount)-amount;
      if(balance<=deliveryman.deliverymensdue){
      deliveryman.deliverymensdue-=balance;
      }
      else{
        deliveryman.deliverymensdue=0;
        let balance1=balance-deliveryman.deliverymensdue;
        deliveryman.ourdue+=balance1;
      }
    }
    route.todaysAmount = Number(route.todaysAmount) + Number(amount);
    route.save();
    await deliveryman.save();
console.log("successfully")
    return res.status(200).json({
      status:200,
      message: "Fuel allowance added successfully.",
      deliveryman,
    });
  } catch (error) {
    console.error("Error adding fuel allowance:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  addFuelAllowance,
};