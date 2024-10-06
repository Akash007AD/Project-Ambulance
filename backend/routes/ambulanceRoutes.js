// backend/routes/ambulanceRoutes.js
const express = require('express');
const { findNearbyAmbulances } = require('../controllers/ambulanceController');
const router = express.Router();

router.get('/find', findNearbyAmbulances);

module.exports = router;
