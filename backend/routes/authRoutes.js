// backend/routes/authRoutes.js
const express = require('express');
const {
    signupUser,
    loginUser,
    signupDriver,
    loginDriver,
    signupHospital,
    loginHospital,
} = require('../controllers/authController');

const router = express.Router();

// Routes for User
router.post('/signup', signupUser);
router.post('/login', loginUser);

// Routes for Driver
router.post('/driver/signup', signupDriver);
router.post('/driver/login', loginDriver);

// Routes for Hospital
router.post('/hospital/signup', signupHospital);
router.post('/hospital/login', loginHospital);

module.exports = router;
