const express = require('express');
const {
    signupUser,
    loginUser,
    signupDriver,
    loginDriver,
    signupHospital,
    loginHospital,
    getDriverDetails,
    getDriverDashboard // Import the new controller function
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
// Example route definition
router.post('/driver/login',loginDriver);
router.get('/driver/dashboard/:id',getDriverDashboard);

// Get Driver Details
router.get('/driver/:phoneNumber', getDriverDetails);

// ---------------------- Hospital Routes ----------------------
// Hospital Signup
router.post('/hospital/signup', signupHospital);

// Hospital Login
router.post('/hospital/login', loginHospital);

module.exports = router;
