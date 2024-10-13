const express = require('express');
const { 
    findNearbyAvailableAmbulances, 
    bookAmbulance, 
    updateAmbulanceAvailability ,
    findNearestHospitals
} = require('../controllers/ambulanceController');
const router = express.Router();

// Route to find nearby available ambulances based on user's location
router.get('/find', findNearbyAvailableAmbulances);

// Route to book an ambulance by driver ID
router.post('/book', bookAmbulance);

// Route to update ambulance availability status
router.put('/update/:driverId', updateAmbulanceAvailability);

router.get('/find/hospitals',findNearestHospitals)

module.exports = router;
