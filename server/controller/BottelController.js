const BottleDelivery = require("../models/Bottle");

// Add a new daily report
exports.addDailyReport = async (req, res) => {
  try {
    const { deliverymanId, date, routeId, deliveries } = req.body;

    const report = await BottleDelivery.create({
      deliverymanId,
      routeId,
      date,
      deliveries,
    });

    res.status(201).json({
      success: true,
      message: "Daily report added successfully",
      data: report,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all reports (optional filters by deliverymanId and date)
exports.getReports = async (req, res) => {
  try {
    const { deliverymanId, date } = req.query;

    const filter = {};
    if (deliverymanId) filter.deliverymanId = deliverymanId;
    if (date) filter.date = new Date(date);

    const reports = await BottleDelivery.find(filter);

    if (!reports.length) {
      return res
        .status(404)
        .json({ success: false, message: "No reports found" });
    }

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get a single report by ID
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await BottleDelivery.findById(id);

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Update a full report
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveries, date } = req.body;

    const updatedReport = await BottleDelivery.findByIdAndUpdate(
      id,
      { deliveries, date },
      { new: true, runValidators: true }
    );

    if (!updatedReport) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: updatedReport,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReport = await BottleDelivery.findByIdAndDelete(id);

    if (!deletedReport) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
exports.addDeliveryEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      deliveredBottles,
      brokenBottles,
      emptyBottlesCollected,
      notReturnedBottles,
    } = req.body;

    const report = await BottleDelivery.findById(id);

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }
    report.deliveries.push({
      deliveredBottles,
      brokenBottles,
      emptyBottlesCollected,
      notReturnedBottles,
    });

    await report.save();

    res.status(200).json({
      success: true,
      message: "Delivery entry added successfully",
      data: report,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
exports.updateDeliveryEntry = async (req, res) => {
  try {
    const { id, index } = req.params;
    const {
      deliveredBottles,
      brokenBottles,
      emptyBottlesCollected,
      notReturnedBottles,
    } = req.body;

    const report = await BottleDelivery.findById(id);

    if (!report || !report.deliveries[index]) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery entry not found" });
    }
    report.deliveries[index] = {
      deliveredBottles,
      brokenBottles,
      emptyBottlesCollected,
      notReturnedBottles,
    };

    await report.save();

    res.status(200).json({
      success: true,
      message: "Delivery entry updated successfully",
      data: report,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.deleteDeliveryEntry = async (req, res) => {
  try {
    const { id, index } = req.params;

    const report = await BottleDelivery.findById(id);

    if (!report || !report.deliveries[index]) {
      return res
        .status(404)
        .json({ success: false, message: "Delivery entry not found" });
    }

    report.deliveries.splice(index, 1);

    await report.save();

    res.status(200).json({
      success: true,
      message: "Delivery entry deleted successfully",
      data: report,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
