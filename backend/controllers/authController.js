const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Hospital = require('../models/Hospital');
const upload = require('../config/upload');  // Import multer configuration

// Utility function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Function to compare password
const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
// 1. User Signup
const signupUser = async (req, res) => {
    const { name, phoneNumber, password, location } = req.body;

    // Validate required fields
    if (!name || !phoneNumber || !password) {
        return res.status(400).json({ message: 'Name, phone number, and password are required' });
    }

    // Validate location coordinates if provided
    if (location && (!location.coordinates || location.coordinates.length !== 2)) {
        return res.status(400).json({ message: 'Invalid location data. Coordinates should be an array of [longitude, latitude].' });
    }

    try {
        const userExists = await User.findOne({ phoneNumber });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            phoneNumber,
            password: hashedPassword,
            location: location || { type: 'Point', coordinates: [0, 0] }, // Set default location if not provided
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            location: user.location,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(`Error during user signup: ${error.message}`, error.stack);
        res.status(500).json({ message: 'Server error during user signup' });
    }
};
//2. Login User
const loginUser = async (req, res) => {
    const { phoneNumber, password, location } = req.body;

    // Validate location coordinates if provided
    if (location && (!location.coordinates || location.coordinates.length !== 2)) {
        return res.status(400).json({ message: 'Invalid location data. Coordinates should be an array of [longitude, latitude].' });
    }

    try {
        const user = await User.findOne({ phoneNumber });
        if (user && (await bcrypt.compare(password, user.password))) {
            // Update user location if provided
            if (location) {
                user.location = location;
                await user.save();
            }

            res.json({
                _id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber,
                location: user.location,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(`Error during user login: ${error.message}`, error.stack);
        res.status(500).json({ message: 'Server error during user login' });
    }
};

// 3. Driver Signup
// 3. Driver Signup
const signupDriver = async (req, res) => {
    const { name, phoneNumber, password, vehicleNumber, drivingLicense, longitude, latitude } = req.body;
    const licenseImage = req.file; // Get the uploaded file

    // Log the incoming request body for debugging
    console.log('Request Body:', req.body);

    // Validate required fields
    if (!name || !phoneNumber || !password || !vehicleNumber || !drivingLicense) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if latitude and longitude are valid numbers
    if (isNaN(longitude) || isNaN(latitude)) {
        return res.status(400).json({ message: 'Invalid coordinates provided. Coordinates must be numbers.' });
    }

    try {
        const driverExists = await Driver.findOne({ phoneNumber });
        if (driverExists) {
            return res.status(400).json({ message: 'Driver already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new driver record in your database
        const newDriver = await Driver.create({
            name,
            phoneNumber,
            password: hashedPassword, // Use the hashed password
            vehicleNumber,
            drivingLicense,
            licenseImage: licenseImage ? licenseImage.path : null, // Use the file path if exists
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)], // Ensure coordinates are floats
            },
        });

        res.status(201).json({ 
            message: 'Driver registered successfully!',
            driver: {
                id: newDriver._id,
                name: newDriver.name,
                phoneNumber: newDriver.phoneNumber,
                vehicleNumber: newDriver.vehicleNumber,
                drivingLicense: newDriver.drivingLicense,
                location: newDriver.location,
            }
        });
    } catch (error) {
        console.error('Error during driver signup:', error);
        res.status(500).json({ message: 'An error occurred during signup.' });
    }
};


const loginDriver = async (req, res) => {
    try {
        const { phoneNumber, password, location } = req.body;

        // Validate required fields
        if (!phoneNumber || !password) {
            return res.status(400).json({ message: 'Phone number and password are required' });
        }

        // Find the driver by phone number
        const driver = await Driver.findOne({ phoneNumber });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Check password (use the appropriate method for comparing hashed passwords)
        const isMatch = await comparePassword(password, driver.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update driver's location if provided
        if (location && location.coordinates) {
            // Ensure location is structured properly
            driver.location = {
                type: 'Point', // Ensure type is 'Point'
                coordinates: [
                    parseFloat(location.coordinates[0]), // Longitude
                    parseFloat(location.coordinates[1])  // Latitude
                ],
            };
            await driver.save();
        }

        // Generate a token (assuming you have a function for this)
        const token = generateToken(driver._id);

        return res.status(200).json({
            message: 'Login successful',
            driver: {
                id: driver._id,
                name: driver.name,
                phoneNumber: driver.phoneNumber,
                vehicleNumber: driver.vehicleNumber,
                available: driver.available,
                location: driver.location, // Return the updated location
            },
            token,
        });
    } catch (error) {
        console.error('Error during driver login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getDriverDashboard = async (req, res) => {
    try {
        const driverId = req.user.id; // Assuming you have middleware that sets req.user with the authenticated driver's info

        // Fetch driver data from the database
        const driverData = await Driver.findById(driverId).select('-password'); // Exclude the password field

        if (!driverData) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Assuming you want to gather some statistics or data for the dashboard
        const dashboardData = {
            name: driverData.name,
            phoneNumber: driverData.phoneNumber,
            completedRides: driverData.completedRides || 0,
            currentLocation: driverData.currentLocation || 'Not available',
            // Add other relevant data you want to show in the dashboard
        };

        res.status(200).json({ message: 'Dashboard data retrieved successfully', data: dashboardData });
    } catch (error) {
        console.error('Error fetching driver dashboard:', error);
        res.status(500).json({ message: 'Server error fetching dashboard' });
    }
};

// 5. Hospital Signup

const signupHospital = async (req, res) => {
    const { name, registrationNumber, password, bedAvailability, longitude, latitude } = req.body;

    // Validate required fields
    if (!name || !registrationNumber || !password || bedAvailability === undefined || !longitude || !latitude) {
        return res.status(400).json({ message: 'All fields, including coordinates, are required' });
    }

    try {
        // Check if hospital already exists
        const hospitalExists = await Hospital.findOne({ registrationNumber });
        if (hospitalExists) {
            return res.status(400).json({ message: 'Hospital already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new hospital with geolocation
        const hospital = await Hospital.create({
            name,
            registrationNumber,
            password: hashedPassword,
            bedAvailability,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            }
        });

        res.status(201).json({
            _id: hospital._id,
            name: hospital.name,
            registrationNumber: hospital.registrationNumber,
            bedAvailability: hospital.bedAvailability,
            location: hospital.location,
            token: generateToken(hospital._id)
        });
    } catch (error) {
        console.error(`Error during hospital signup: ${error.message}`, error.stack);
        res.status(500).json({ message: 'Server error during hospital signup' });
    }
};


// 6. Hospital Login
const loginHospital = async (req, res) => {
    const { registrationNumber, password } = req.body;

    try {
        // Check if hospital exists
        const hospital = await Hospital.findOne({ registrationNumber });
        if (hospital && (await bcrypt.compare(password, hospital.password))) {
            res.json({
                _id: hospital._id,
                name: hospital.name,
                registrationNumber: hospital.registrationNumber,
                bedAvailability: hospital.bedAvailability,
                token: generateToken(hospital._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(`Error during hospital login: ${error.message}`, error.stack);
        res.status(500).json({ message: 'Server error during hospital login' });
    }
};
// 7. Get Driver Details
// In your driver controller
async function getDriverDetails(req, res) {
    const { phoneNumber } = req.params; // Extract phone number from request parameters

    // Log the phone number for debugging
    console.log("Phone Number:", phoneNumber);

    try {
        // Search for the driver using the provided phone number
        const driver = await Driver.findOne({ phoneNumber: phoneNumber });

        // If no driver is found, send a 404 response
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        // Send the driver details in the response
        res.status(200).json(driver);
    } catch (error) {
        console.error("Error fetching driver details:", error);
        // Send a 500 response in case of server error
        res.status(500).json({ message: "Server error" });
    }
}

  
module.exports = {
    signupUser,
    loginUser,
    signupDriver,
    loginDriver,
    signupHospital,
    loginHospital,
    getDriverDetails,
    getDriverDashboard
};
