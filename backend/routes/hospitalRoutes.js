// backend/routes/hospitalRoutes.js
const express = require('express');
const { updateBedAvailability } = require('../controllers/hospitalController');
const router = express.Router();

router.put('/bed-availability/:id', updateBedAvailability);

module.exports = router;
