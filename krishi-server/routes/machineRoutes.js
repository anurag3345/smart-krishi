const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');

// Create a new machine listing (now expects base64 image in request body)
router.post('/', machineController.createMachine);

// Get all machines (without full image data)
router.get('/', machineController.getAllMachines);

// Get machine image by ID
router.get('/:id/image', machineController.getMachineImage);

module.exports = router;