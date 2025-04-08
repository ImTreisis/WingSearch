const express = require('express');
const cors = require('cors');
const https = require('https');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // React dev server
    'https://wingsearch.vercel.app', // Main domain
    'https://wingsearch-1xgky20oe-treisis-projects.vercel.app' // Deployment domain
  ]
};
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  console.log('Database:', mongoose.connection.db.databaseName);
  console.log('Collections:', mongoose.connection.db.listCollections().toArray());
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.use(cors(corsOptions));
app.use(express.json());

// Import User model
const User = require('./models/User');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Signup attempt for email:', email);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log('Existing user check:', existingUser ? 'User found' : 'No user found');

    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create new user
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();
    console.log('New user created:', user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error details:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Flight search endpoint
app.get('/api/flights/search', async (req, res) => {
  const { 
    fromId, 
    toId, 
    departDate, 
    returnDate,
    stops,
    pageNo,
    adults, 
    children, 
    sort,
    cabinClass, 
    currency 
  } = req.query;

  console.log('Received search request with params:', {
    fromId,
    toId,
    departDate,
    returnDate,
    stops,
    pageNo,
    adults,
    children,
    sort,
    cabinClass,
    currency
  });

  const options = {
    method: 'GET',
    hostname: 'booking-com15.p.rapidapi.com',
    port: null,
    path: `/api/v1/flights/searchFlights?fromId=${fromId}&toId=${toId}&departDate=${departDate}${returnDate ? `&returnDate=${returnDate}` : ''}&stops=${stops}&pageNo=${pageNo}&adults=${adults}&children=${children}&sort=${sort}&cabinClass=${cabinClass}&currency_code=${currency}`,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
    }
  };

  console.log('Making request to RapidAPI with options:', options);

  const request = https.request(options, (response) => {
    const chunks = [];

    response.on('data', (chunk) => {
      chunks.push(chunk);
    });

    response.on('end', () => {
      const body = Buffer.concat(chunks);
      const data = JSON.parse(body.toString());
      console.log('Received response from RapidAPI:', data);
      res.json(data);
    });
  });

  request.on('error', (error) => {
    console.error('Error making request to RapidAPI:', error);
    res.status(500).json({ error: 'Failed to fetch flight data', details: error.message });
  });

  request.end();
});

// Plane tracker endpoint
app.get('/api/flights/track', async (req, res) => {
  const { flightNumber } = req.query;

  if (!flightNumber) {
    return res.status(400).json({ error: 'Flight number is required' });
  }

  const options = {
    method: 'GET',
    hostname: 'flight-radar1.p.rapidapi.com',
    port: null,
    path: `/flights/search?query=${flightNumber}&limit=25`,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'flight-radar1.p.rapidapi.com'
    }
  };

  const request = https.request(options, (response) => {
    const chunks = [];

    response.on('data', (chunk) => {
      chunks.push(chunk);
    });

    response.on('end', () => {
      const body = Buffer.concat(chunks);
      const data = JSON.parse(body.toString());
      res.json(data);
    });
  });

  request.on('error', (error) => {
    console.error('Error tracking flight:', error);
    res.status(500).json({ error: 'Failed to track flight', details: error.message });
  });

  request.end();
});

// Wishlist endpoints
app.get('/api/wishlist', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching wishlist for user:', req.user.userId);
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User wishlist:', user.wishlist);
    res.json(user.wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
});

app.post('/api/wishlist', authenticateToken, async (req, res) => {
  try {
    console.log('Adding to wishlist:', req.body);
    const { item } = req.body;
    if (!item) {
      console.log('Item is required');
      return res.status(400).json({ message: 'Item is required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const newItem = {
      item,
      createdAt: new Date()
    };

    user.wishlist.push(newItem);
    await user.save();
    
    console.log('Item added successfully:', newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
});

app.delete('/api/wishlist/:itemId', authenticateToken, async (req, res) => {
  try {
    console.log('Removing item from wishlist:', req.params.itemId);
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const itemIndex = user.wishlist.findIndex(item => item._id.toString() === req.params.itemId);
    if (itemIndex === -1) {
      console.log('Item not found');
      return res.status(404).json({ message: 'Item not found' });
    }

    user.wishlist.splice(itemIndex, 1);
    await user.save();
    
    console.log('Item removed successfully');
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 