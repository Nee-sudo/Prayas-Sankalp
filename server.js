const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const app = express();
const port = 4000;

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use the correct environment variable name
const jwtSecret = process.env.JWT_SECRET;

// Initialize Firebase Admin SDK
const serviceAccount = require('./public/key/serviceAccountKeyy.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://registeration-e2a50-default-rtdb.firebaseio.com" // Replace with your Firebase project URL
});

// Function to verify and decode the JWT token
const verifyTokenAndGetUserId = async (idToken) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken.uid;
    } catch (error) {
        console.error('Error verifying token:', error);
        throw error;
    }
};

// Function to retrieve user data based on userId
const getUserData = async (userId) => {
    try {
        const snapshot = await admin.database().ref(`users/${userId}`).once('value');
        return snapshot.val();
    } catch (error) {
        throw error;
    }
};

// Generate JWT token
const generateToken = (uid) => {
    return jwt.sign({ uid }, jwtSecret, { expiresIn: '1h' });
};

// Generic error-handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// Handle user registration
app.post('/register', async (req, res, next) => {
    try {
        const { email, password, username } = req.body;

        // Implement your registration logic here, create user account, etc.
        const userCredential = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: username,
        });

        // Add user data to the Firebase Realtime Database
        await admin.database().ref(`users/${userCredential.uid}`).set({
            username: username,
            email: email
        });

        const token = generateToken(userCredential.uid);

        res.status(200).json({ message: 'User registered successfully', token });
    } catch (error) {
        next(error);
    }
});

// Handle user login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Implement your login logic here, validate credentials, etc.
        const userCredential = await admin.auth().signInWithEmailAndPassword(email, password);

        const token = generateToken(userCredential.user.uid);

        res.status(200).json({ message: 'Signed in successfully', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(401).json({ message: 'Invalid login credentials' });
    }
});

// Retrieve user data
app.get('/user', async (req, res, next) => {
    const idToken = req.headers.authorization;

    try {
        // Verify token and retrieve user data
        const userId = await verifyTokenAndGetUserId(idToken);

        // Retrieve user data based on userId
        const userData = await getUserData(userId);

        // Set Content-Type header
        res.setHeader('Content-Type', 'application/json');

        // Send JSON response
        res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
});

// Serve static files (HTML, CSS, etc.)
// app.use(express.static('Prayas-Sankalp/user-profile'));
app.use(express.static('Prayas-Sankalp/Markplace_page A'));
app.use(express.static('Prayas-Sankalp/signup-page'));
app.use(express.static('Prayas-Sankalp/login-page'));
app.use(express.static('Prayas-Sankalp/register-page'));
app.use(express.static('Prayas-Sankalp/Home page'));
app.use(express.static('Prayas-Sankalp/user_profile'));
app.use(express.static('Prayas-Sankalp/Donate'));
app.use(express.static('Prayas-Sankalp/Collab Page'));
// app.use(express.static('public'));
// app.use(express.static('login-page'));
// app.use(express.static('Prayas-Sankalp'));
// app.use(express.static('signup-page'));
// app.use(express.static('user-profile'));
// app.use(express.static('test'));

// Endpoint for adding a product to the cart
app.post('/addToCart', async (req, res) => {
    const { name, price, description, quantity } = req.body;
  
    // Save the product details to MongoDB
    const product = new Product({
      name,
      price,
      description,
      quantity,
    });
  
    try {
      await product.save();
      res.status(201).send('Product added to cart successfully!');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
