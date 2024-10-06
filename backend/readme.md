# Efficient Ambulance Services - Backend

This is the backend service for the Efficient Ambulance Services project. It is built using Node.js, Express, and MongoDB. The backend handles user, driver, and hospital authentication, ambulance management, and real-time data processing for ambulance services.

## Features

- **User Authentication:** Signup and login functionality for users, drivers, and hospitals.
- **Ambulance Booking:** Users can request and book available ambulances in real-time based on location.
- **Driver Availability:** Drivers can set their availability status, allowing them to be booked.
- **Hospital Integration:** Hospitals can display real-time bed availability, helping users choose the nearest hospital.
- **Google Maps Integration:** Provides route optimization for drivers and real-time tracking of ambulances.
- **JWT Authentication:** Secure access to protected routes using JSON Web Tokens (JWT).
- **Location Services:** Use location-based services (like Google Maps API) for finding nearby ambulances and hospitals.

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Web framework for creating the server and handling API routes.
- **MongoDB**: NoSQL database for storing user, driver, and hospital data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
- **JWT (JSON Web Tokens)**: Used for user authentication.
- **Bcrypt.js**: Library for hashing passwords.
- **Google Maps API**: Used for location services and real-time tracking.
- **Cloudinary (Optional)**: For uploading and managing driver license images.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v12.x or later)
- [MongoDB](https://www.mongodb.com/) (local or MongoDB Atlas)
- [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) (for route tracking)
- [Cloudinary Account](https://cloudinary.com/) (if you plan to store images)

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/Efficient-Ambulance-Services.git
    cd Efficient-Ambulance-Services/backend
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

    Create a `.env` file in the root of the `backend` directory and add the following variables (replace the placeholders with your own values):

    ```plaintext
    # Port for running the server
    PORT=5000

    # MongoDB connection string
    MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

    # JWT Secret for token generation
    JWT_SECRET=your_secret_key_for_jwt_token

    # Google Maps API Key
    GOOGLE_MAPS_API_KEY=your_google_maps_api_key

    # Cloudinary credentials (optional, if using Cloudinary for image storage)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4. **Run the server**:

    ```bash
    npm start
    ```

    The server will start on `http://localhost:5000`.

### API Endpoints

Here is a brief overview of the available routes and their functionalities:

#### **User Routes:**
- **`POST /api/auth/signup`**: Signup a new user.
- **`POST /api/auth/login`**: Login a user.

#### **Driver Routes:**
- **`POST /api/auth/driver/signup`**: Signup a new driver.
- **`POST /api/auth/driver/login`**: Login a driver.
- **`PUT /api/driver/:id/availability`**: Update driver availability status (available/not available).

#### **Hospital Routes:**
- **`POST /api/auth/hospital/signup`**: Signup a new hospital.
- **`POST /api/auth/hospital/login`**: Login a hospital.
- **`PUT /api/hospital/:id/bed-availability`**: Update hospital bed availability.

#### **Ambulance Booking Routes:**
- **`GET /api/ambulance/nearby`**: Get nearby available ambulances based on user’s location.
- **`POST /api/ambulance/book`**: Book an available ambulance.
- **`GET /api/ambulance/:id/track`**: Real-time tracking of an ambulance.

### Folder Structure

```plaintext
backend/
├── config/
│   └── db.js              # MongoDB connection setup
├── controllers/
│   ├── authController.js   # Handles signup and login for users, drivers, and hospitals
│   ├── ambulanceController.js  # Ambulance booking and tracking logic
│   ├── hospitalController.js   # Handles hospital bed availability
├── middleware/
│   └── authMiddleware.js   # JWT middleware for route protection
├── models/
│   ├── User.js             # User model
│   ├── Driver.js           # Driver model
│   ├── Hospital.js         # Hospital model
├── routes/
│   ├── authRoutes.js       # Authentication routes for user, driver, and hospital
│   ├── ambulanceRoutes.js   # Routes related to ambulance booking and tracking
│   ├── hospitalRoutes.js    # Routes for hospital bed management
├── .env                    # Environment variables (keep this secure)
├── server.js               # Main server file
