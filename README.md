Here's the `README.md` file for your backend, including test case JSONs to test each API:

---

# Efficient Ambulance Service Backend

This is the backend for the **Efficient Ambulance Service for Emergency Response** system. The system allows users to book ambulances, drivers to log in, and administrators to manage services. The backend is built using Node.js, Express, and MongoDB.

## Features

- **Ambulance Booking**: Allows users to book ambulances by providing pickup and drop locations.
- **Driver Management**: Allows ambulance drivers to sign up, log in, and update information.
- **User Management**: Allows users to sign up and log in to the system.
- **Retrieve Latest Ambulance Pickup Info**: Provides information on the latest ambulance booking.

## Technologies

- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **JWT (JSON Web Token)**
- **Bcrypt** for password encryption
- **CORS** for handling cross-origin requests

## API Endpoints

### 1. **Ambulance Booking**

- **POST /api/book-ambulance**

  This endpoint allows users to book an ambulance by providing name, phone, pickup location, and drop location.

  **Request Body:**
  ```json
  {
    "name": "John Doe",
    "phone": "1234567890",
    "pickupLocation": "123 Main St",
    "dropLocation": "456 Elm St"
  }
  ```

  **Response:**
  ```json
  {
    "success": true,
    "message": "Ambulance booked successfully"
  }
  ```

- **GET /api/ambulance/pickup-info**

  This endpoint retrieves the most recent ambulance booking's pickup location and phone number.

  **Response:**
  ```json
  {
    "success": true,
    "pickupLocation": "123 Main St",
    "phoneNumber": "1234567890"
  }
  ```

### 2. **User Management**

- **POST /api/user-signup**

  Allows a user to sign up with their name, address, phone number, hospital, medical condition, and password.

  **Request Body:**
  ```json
  {
    "name": "John Doe",
    "address": "123 Main St",
    "phoneNumber": "1234567890",
    "hospital": "City Hospital",
    "condition": "Heart Attack",
    "password": "password123"
  }
  ```

  **Response:**
  ```json
  {
    "success": true,
    "message": "Signup successful!",
    "data": {
      "userId": "64b7ed4f5e431b001f249b7d"
    }
  }
  ```

- **POST /api/user-login**

  Allows a user to log in with their phone number and password.

  **Request Body:**
  ```json
  {
    "phoneNumber": "1234567890",
    "password": "password123"
  }
  ```

  **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful!",
    "data": {
      "token": "your-jwt-token",
      "userId": "64b7ed4f5e431b001f249b7d",
      "name": "John Doe"
    }
  }
  ```

### 3. **Driver Management**

- **POST /api/driver-signup**

  Allows an ambulance driver to sign up with their details, including name, ambulance number, hospital name, phone number, and password.

  **Request Body:**
  ```json
  {
    "name": "John Smith",
    "ambulanceNumber": "A123",
    "hospitalName": "City Hospital",
    "phoneNumber": "0987654321",
    "carDetails": "Toyota Hiace",
    "password": "driverpass"
  }
  ```

  **Response:**
  ```json
  {
    "success": true,
    "message": "Signup successful!"
  }
  ```

- **POST /api/driver-login**

  Allows a driver to log in with their phone number and password.

  **Request Body:**
  ```json
  {
    "phoneNumber": "0987654321",
    "password": "driverpass"
  }
  ```

  **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful!",
    "data": {
      "token": "your-jwt-token",
      "driverId": "64b7ed4f5e431b001f249c1e",
      "name": "John Smith"
    }
  }
  ```

- **GET /api/driver-random**

  Retrieve a random driver by the hospital name.

  **Request Parameters:**
  ```json
  {
    "hospitalName": "City Hospital"
  }
  ```

  **Response:**
  ```json
  {
    "success": true,
    "driver": {
      "name": "John Smith",
      "ambulanceNumber": "A123",
      "phoneNumber": "0987654321"
    }
  }
  ```

## Running the Application

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory with the following content:**
   ```env
   MONGO_URI=your-mongo-db-uri
   JWT_SECRET=your-jwt-secret
   ```

4. **Run the application:**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:5000`.

## Testing the APIs

You can test the APIs using tools like **Postman** or **curl**. Here are the test case JSONs for the mentioned APIs.

### Test Cases

1. **Ambulance Booking:**
   - **POST /api/book-ambulance**
     ```json
     {
       "name": "John Doe",
       "phone": "1234567890",
       "pickupLocation": "123 Main St",
       "dropLocation": "456 Elm St"
     }
     ```

2. **Get Latest Ambulance Pickup Info:**
   - **GET /api/ambulance/pickup-info**

3. **User Signup:**
   - **POST /api/user-signup**
     ```json
     {
       "name": "John Doe",
       "address": "123 Main St",
       "phoneNumber": "1234567890",
       "hospital": "City Hospital",
       "condition": "Heart Attack",
       "password": "password123"
     }
     ```

4. **User Login:**
   - **POST /api/user-login**
     ```json
     {
       "phoneNumber": "1234567890",
       "password": "password123"
     }
     ```

5. **Driver Signup:**
   - **POST /api/driver-signup**
     ```json
     {
       "name": "John Smith",
       "ambulanceNumber": "A123",
       "hospitalName": "City Hospital",
       "phoneNumber": "0987654321",
       "carDetails": "Toyota Hiace",
       "password": "driverpass"
     }
     ```

6. **Driver Login:**
   - **POST /api/driver-login**
     ```json
     {
       "phoneNumber": "0987654321",
       "password": "driverpass"
     }
     ```

7. **Get Random Driver by Hospital:**
   - **GET /api/driver-random?hospitalName=City+Hospital**

