const BottleTransaction = require("../models/Bottle");

// Create a new bottle transaction
exports.createBottleTransaction = async (req, res) => {
    try {
        const { route_id, bottle_details } = req.body;

        const newBottleTransaction = new BottleTransaction({
            route_id,
            bottle_details,
        });

        await newBottleTransaction.save();
        res.status(201).json({
            message: "Bottle transaction created successfully", 
            data: newBottleTransaction,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating bottle transaction" });
    }
};

// Get all bottle transactions
exports.getAllBottleTransactions = async (req, res) => {
    try {
        const transactions = await BottleTransaction.find();
        res.status(200).json({
            message: "Bottle transactions fetched successfully",
            data: transactions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching bottle transactions" });
    }
};

// Get a specific bottle transaction by route_id
exports.getBottleTransactionByRouteId = async (req, res) => {
    try {
        const { route_id } = req.params;

        const transaction = await BottleTransaction.findOne({ route_id });

        if (!transaction) {
            return res.status(404).json({ message: "Bottle transaction not found" });
        }

        res.status(200).json({
            message: "Bottle transaction fetched successfully",
            data: transaction,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching bottle transaction" });
    }
};

// Update bottle details (delivery, collection, or broken details)
exports.updateBottleTransactionDetails = async (req, res) => {
    try {
        const { route_id, customer_id, bottle_type, details } = req.body;

        const transaction = await BottleTransaction.findOne({ route_id });

        if (!transaction) {
            return res.status(404).json({ message: "Bottle transaction not found" });
        }

        const customer = transaction.bottle_details.find((bottle) =>
            bottle.customer.some((cust) => cust.customer_id === customer_id)
        );

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Add or update the details based on bottle type (delivery, collection, or broken)
        const bottleDetails = customer[bottle_type + "_details"];

        if (bottleDetails) {
            bottleDetails.push(details);
        } else {
            return res.status(400).json({ message: `Invalid bottle type: ${bottle_type}` });
        }

        await transaction.save();
        res.status(200).json({
            message: "Bottle transaction details updated successfully",
            data: transaction,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating bottle transaction details" });
    }
};

// Delete a bottle transaction by route_id
exports.deleteBottleTransaction = async (req, res) => {
    try {
        const { route_id } = req.params;

        const transaction = await BottleTransaction.findOneAndDelete({ route_id });

        if (!transaction) {
            return res.status(404).json({ message: "Bottle transaction not found" });
        }

        res.status(200).json({
            message: "Bottle transaction deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting bottle transaction" });
    }
};
