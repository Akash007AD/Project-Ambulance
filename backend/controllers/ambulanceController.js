const Driver = require('../models/Driver');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Hospital=require('../models/Hospital')
// Ensure 2dsphere index on location field for geospatial queries
Driver.schema.index({ location: '2dsphere' });

// Find nearby ambulances based on location and radius
const findNearbyAvailableAmbulances = async (req, res) => {
    const { lat, lng, radius = 2 } = req.query;  // Default radius is 2 km

    try {
        // Check if latitude and longitude are provided
        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and Longitude are required.' });
        }

        // Convert lat/lng to numbers
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        // Convert radius to radians for $centerSphere
        const radiusInRadians = radius / 6378.1;  // Radius of Earth in kilometers (6378.1 km)

        // Find drivers within the specified radius who are available
        const drivers = await Driver.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], radiusInRadians]
                }
            },
            available: true  // Only find available ambulances
        }).select('name phoneNumber'); // Select only name and phoneNumber fields

        // If no drivers found
        if (drivers.length === 0) {
            return res.status(404).json({ message: 'No available ambulances found in the area' });
        }

        // Respond with the list of available drivers
        res.status(200).json(drivers);
    } catch (error) {
        console.error(`Error finding ambulances: ${error.message}`);
        res.status(500).json({ message: 'Error finding ambulances' });
    }
};


// Book an ambulance by driver ID
const bookAmbulance = async (req, res) => {
    const { userId, driverId } = req.body;

    try {
        // Find the driver by ID
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Ambulance not found.' });
        }

        // Check if the ambulance is available
        if (!driver.available) {
            return res.status(400).json({ message: 'Ambulance is already booked.' });
        }

        // Find the user who is booking
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Create a new booking
        const booking = new Booking({
            user: userId,
            driver: driverId,
            location: {
                type: 'Point',
                coordinates: user.location.coordinates, // Assuming user's location is stored
            },
            status: 'booked',
        });

        await booking.save();

        // Mark the driver as unavailable
        driver.available = false;
        await driver.save();

        res.json({ message: 'Ambulance booked successfully!', booking });
    } catch (error) {
        console.error(`Error booking ambulance: ${error.message}`);
        res.status(500).json({ error: 'Error booking ambulance' });
    }
};

// Update ambulance availability
const updateAmbulanceAvailability = async (req, res) => {
    const { driverId } = req.params;  // Extract driver ID from the request params
    const { available } = req.body;   // Extract availability status from the request body

    try {
        // Find the driver by ID and update the availability status
        const driver = await Driver.findById(driverId);

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Update availability status
        driver.available = available;
        await driver.save();

        res.status(200).json({
            message: `Driver availability updated to ${available}`,
            driver: {
                id: driver._id,
                name: driver.name,
                available: driver.available
            }
        });
    } catch (error) {
        console.error(`Error updating ambulance availability: ${error.message}`);
        res.status(500).json({ message: 'Error updating ambulance availability' });
    }
};

const findNearestHospitals = async (req, res) => {
    const { longitude, latitude } = req.body;

    if (!longitude || !latitude) {
        return res.status(400).json({ message: 'Coordinates are required' });
    }

    try {
        // Find hospitals within a certain radius (e.g., 10km)
        const nearestHospitals = await Hospital.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: 10000 // Distance in meters (10km)
                }
            }
        }).limit(5); // Limit to 5 hospitals

        res.status(200).json(nearestHospitals);
    } catch (error) {
        console.error('Error finding nearest hospitals:', error);
        res.status(500).json({ message: 'Server error while finding hospitals' });
    }
};

module.exports = { findNearbyAvailableAmbulances, bookAmbulance, updateAmbulanceAvailability ,findNearestHospitals};
