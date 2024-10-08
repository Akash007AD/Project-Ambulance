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
const upload = require('../config/upload'); // Import the upload middleware for handling file uploads

const router = express.Router();

// ---------------------- User Routes ----------------------
// User Signup
router.post('/user/signup', signupUser);

// User Login
router.post('/user/login', loginUser);

// ---------------------- Driver Routes ----------------------
// Driver Signup (with file upload for license image)
router.post('/driver/signup', upload.single('licenseImage'), signupDriver);

// Driver Login
router.post('/driver/login', loginDriver);

// ---------------------- Hospital Routes ----------------------
// Hospital Signup
router.post('/hospital/signup', signupHospital);

// Hospital Login
router.post('/hospital/login', loginHospital);

module.exports = router;
