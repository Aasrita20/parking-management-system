const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to Database & Auto-seed if empty
connectDB().then(async (conn) => {
  if (conn) {
    try {
      const User = require('./models/User');
      const count = await User.countDocuments();
      if (count === 0) {
        console.log('Database empty on startup. Auto-populating initial parking lots and accounts...');
        const seedData = require('./utils/seeder');
        await seedData();
      }
    } catch (err) {
      console.error('Auto-seed check failed:', err.message);
    }
  }
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Parking Management System API',
    status: 'Server Operational',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      lots: '/api/lots',
      slots: '/api/slots',
      bookings: '/api/bookings'
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/lots', require('./routes/lotRoutes'));
app.use('/api/slots', require('./routes/slotRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});

// Central Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Parking Management Backend Server running on port ${PORT}`);
});
