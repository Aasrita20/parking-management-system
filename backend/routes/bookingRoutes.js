const express = require('express');
const router = express.Router();
const {
  createBooking,
  cancelBooking,
  checkInVehicle,
  checkOutVehicle,
  getFeePreview,
  getUserBookings,
  getAllBookings,
  getDashboardStats
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/:id/fee-preview', protect, getFeePreview);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/check-in', protect, checkInVehicle);
router.put('/:id/check-out', protect, checkOutVehicle);

// Admin routes
router.get('/', protect, adminOnly, getAllBookings);

module.exports = router;
