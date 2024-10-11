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
const signupDriver = (req, res) => {
    upload.single('licenseImage')(req, res, async (err) => {  // Use the correct file field name here
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { name, phoneNumber, password, vehicleNumber, drivingLicense } = req.body;
        const location = req.body.location ? JSON.parse(req.body.location) : { type: 'Point', coordinates: [0, 0] };

        try {
            const driverExists = await Driver.findOne({ phoneNumber });
            if (driverExists) {
                return res.status(400).json({ message: 'Driver already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newDriver = new Driver({
                name,
                phoneNumber,
                password: hashedPassword,
                vehicleNumber,
                drivingLicense,
                licenseImage: req.file ? req.file.path : null,  // Store uploaded file path
                location,
            });

            await newDriver.save();

            res.status(201).json({
                _id: newDriver._id,
                name: newDriver.name,
                phoneNumber: newDriver.phoneNumber,
                vehicleNumber: newDriver.vehicleNumber,
                drivingLicense: newDriver.drivingLicense,
                licenseImage: newDriver.licenseImage,
                location: newDriver.location,
                token: generateToken(newDriver._id),
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error during driver signup' });
            console.error(`Error during driver signup: ${error.message}`);
        }
    });
};


// 4. Driver Login
const loginDriver = async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        // Check if the driver exists
        const driver = await Driver.findOne({ phoneNumber });

        if (!driver) {
            return res.status(401).json({ message: 'Invalid phone number or password' });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, driver.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid phone number or password' });
        }

        // If successful, return the driver's details along with the token
        res.json({
            _id: driver._id,
            name: driver.name,
            phoneNumber: driver.phoneNumber,
            vehicleNumber: driver.vehicleNumber,
            drivingLicense: driver.drivingLicense,
            token: generateToken(driver._id),
        });
    } catch (error) {
        console.error(`Error during driver login: ${error.message}`);
        res.status(500).json({ message: 'Server error during driver login' });
    }
};

// 5. Hospital Signup
const signupHospital = async (req, res) => {
    const { name, registrationNumber, password, bedAvailability } = req.body;

    try {
        // Check if hospital already exists
        const hospitalExists = await Hospital.findOne({ registrationNumber });
        if (hospitalExists) {
            return res.status(400).json({ message: 'Hospital already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new hospital
        const hospital = await Hospital.create({
            name,
            registrationNumber,
            password: hashedPassword,
            bedAvailability,
        });

        res.status(201).json({
            _id: hospital._id,
            name: hospital.name,
            registrationNumber: hospital.registrationNumber,
            bedAvailability: hospital.bedAvailability,
            token: generateToken(hospital._id),
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

module.exports = {
    signupUser,
    loginUser,
    signupDriver,
    loginDriver,
    signupHospital,
    loginHospital,
};
