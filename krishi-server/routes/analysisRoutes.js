const express = require('express');
const multer = require('multer');
const {
  analyzeCropImage,
} = require('../controllers/analysisController');

const router = express.Router();

// Multer setup for image uploads
const upload = multer({ dest: 'uploads/' });

// Route: POST /api/analysis
router.post('/', upload.single('image'), analyzeCropImage);

module.exports = router;
