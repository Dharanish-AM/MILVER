const express = require('express');
const router = express.Router();
const bottleDeliveryController = require('../controller/BottelController');

// Routes for Bottle Delivery

// CRUD Operations for Reports
router.post('/reports', bottleDeliveryController.addDailyReport); // Add a new report
router.get('/reports', bottleDeliveryController.getReports); // Get all reports (with optional filters)
router.get('/reports/:id', bottleDeliveryController.getReportById); // Get a single report by ID
router.put('/reports/:id', bottleDeliveryController.updateReport); // Update a full report by ID
router.delete('/reports/:id', bottleDeliveryController.deleteReport); // Delete a report by ID

// Operations for Delivery Entries in a Report
router.post('/reports/:id/deliveries', bottleDeliveryController.addDeliveryEntry); // Add a new delivery entry to a report
router.put('/reports/:id/deliveries/:index', bottleDeliveryController.updateDeliveryEntry); // Update a delivery entry in a report by index
router.delete('/reports/:id/deliveries/:index', bottleDeliveryController.deleteDeliveryEntry); // Delete a delivery entry from a report by index

module.exports = router;
