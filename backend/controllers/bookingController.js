const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');
const ParkingLot = require('../models/ParkingLot');
const User = require('../models/User');
const { calculateParkingFee } = require('../utils/feeCalculator');

// @desc    Create a new slot booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { slotId, vehicleNumber, vehicleType, estimatedDurationHours, paymentMethod } = req.body;

    if (!slotId || !vehicleNumber || !vehicleType) {
      return res.status(400).json({ message: 'Slot ID, vehicle number, and vehicle type are required' });
    }

    const slot = await ParkingSlot.findById(slotId).populate('lot');
    if (!slot) {
      return res.status(404).json({ message: 'Parking Slot not found' });
    }

    if (slot.status !== 'available') {
      return res.status(400).json({ message: `Slot ${slot.slotNumber} is currently not available (${slot.status})` });
    }

    const lot = slot.lot;
    const hourlyRate = lot.hourlyRates[vehicleType] || lot.hourlyRates.car || 50;
    const duration = Number(estimatedDurationHours) || 2;
    const estimatedFee = duration * hourlyRate;

    const booking = await Booking.create({
      user: req.user._id,
      lot: lot._id,
      slot: slot._id,
      vehicleNumber: vehicleNumber.toUpperCase(),
      vehicleType,
      startTime: new Date(),
      estimatedDurationHours: duration,
      hourlyRate,
      estimatedFee,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid', // Simulated instant checkout/booking payment
      status: 'booked'
    });

    // Update slot status to reserved and link booking
    slot.status = 'reserved';
    slot.currentBooking = booking._id;
    await slot.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('lot', 'name location city hourlyRates')
      .populate('slot', 'slotNumber floor type')
      .populate('user', 'name email phone');

    res.status(201).json(populatedBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization: User can cancel their own booking, Admin can cancel any
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ message: `Booking is already ${booking.status}` });
    }

    if (booking.status === 'active') {
      return res.status(400).json({ message: 'Vehicle is currently checked in. Please check out instead.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Release slot
    const slot = await ParkingSlot.findById(booking.slot);
    if (slot) {
      slot.status = 'available';
      slot.currentBooking = null;
      await slot.save();
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Vehicle Entry (Check-In)
// @route   PUT /api/bookings/:id/check-in
// @access  Private (Admin or Booking owner)
const checkInVehicle = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'booked') {
      return res.status(400).json({ message: `Cannot check in. Booking status is '${booking.status}'` });
    }

    const now = new Date();
    booking.entryTime = now;
    booking.status = 'active';
    await booking.save();

    // Update slot status to occupied
    const slot = await ParkingSlot.findById(booking.slot);
    if (slot) {
      slot.status = 'occupied';
      await slot.save();
    }

    const updatedBooking = await Booking.findById(booking._id)
      .populate('lot', 'name location city')
      .populate('slot', 'slotNumber floor type')
      .populate('user', 'name email phone');

    res.json({ message: 'Vehicle checked in successfully', booking: updatedBooking });
  } catch (error) {
    next(error);
  }
};

// @desc    Vehicle Exit (Check-Out) with Automatic Fee Calculation
// @route   PUT /api/bookings/:id/check-out
// @access  Private (Admin or Booking owner)
const checkOutVehicle = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'active' && booking.status !== 'booked') {
      return res.status(400).json({ message: `Cannot check out. Booking status is '${booking.status}'` });
    }

    const exitTime = new Date();
    const startTime = booking.entryTime || booking.startTime || booking.createdAt;

    // Calculate final fee using feeCalculator utility
    const { durationMinutes, durationHours, fee } = calculateParkingFee(
      startTime,
      exitTime,
      booking.hourlyRate
    );

    booking.exitTime = exitTime;
    booking.finalFee = fee;
    booking.status = 'completed';
    booking.paymentStatus = 'paid';
    await booking.save();

    // Release slot
    const slot = await ParkingSlot.findById(booking.slot);
    if (slot) {
      slot.status = 'available';
      slot.currentBooking = null;
      await slot.save();
    }

    const updatedBooking = await Booking.findById(booking._id)
      .populate('lot', 'name location city')
      .populate('slot', 'slotNumber floor type')
      .populate('user', 'name email phone');

    res.json({
      message: 'Vehicle checked out successfully',
      calculation: {
        entryTime: startTime,
        exitTime,
        durationMinutes,
        durationHours,
        hourlyRate: booking.hourlyRate,
        totalFee: fee
      },
      booking: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate fee preview before exit
// @route   GET /api/bookings/:id/fee-preview
// @access  Private
const getFeePreview = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const exitTime = new Date();
    const startTime = booking.entryTime || booking.startTime || booking.createdAt;

    const calculation = calculateParkingFee(startTime, exitTime, booking.hourlyRate);

    res.json({
      bookingId: booking._id,
      vehicleNumber: booking.vehicleNumber,
      startTime,
      exitTime,
      ...calculation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getUserBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('lot', 'name location city hourlyRates imageUrl')
      .populate('slot', 'slotNumber floor type')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, lotId, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (lotId) query.lot = lotId;
    if (search) query.vehicleNumber = { $regex: search, $options: 'i' };

    const bookings = await Booking.find(query)
      .populate('lot', 'name location city')
      .populate('slot', 'slotNumber floor type')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Dashboard Statistics (Admin & User stats)
// @route   GET /api/bookings/dashboard-stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';

    if (isAdmin) {
      const totalLots = await ParkingLot.countDocuments({ isActive: true });
      const totalSlots = await ParkingSlot.countDocuments({});
      const availableSlots = await ParkingSlot.countDocuments({ status: 'available' });
      const occupiedSlots = await ParkingSlot.countDocuments({ status: 'occupied' });
      const reservedSlots = await ParkingSlot.countDocuments({ status: 'reserved' });

      const totalBookings = await Booking.countDocuments({});
      const activeBookings = await Booking.countDocuments({ status: { $in: ['booked', 'active'] } });

      // Revenue aggregate
      const revenueData = await Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $cond: [{ $gt: ['$finalFee', 0] }, '$finalFee', '$estimatedFee']
              }
            }
          }
        }
      ]);

      const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
      const occupancyRate = totalSlots > 0 ? Math.round(((occupiedSlots + reservedSlots) / totalSlots) * 100) : 0;

      const recentBookings = await Booking.find({})
        .populate('user', 'name email')
        .populate('lot', 'name')
        .populate('slot', 'slotNumber')
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        totalLots,
        totalSlots,
        availableSlots,
        occupiedSlots,
        reservedSlots,
        occupancyRate,
        totalBookings,
        activeBookings,
        totalRevenue,
        recentBookings
      });
    } else {
      // User statistics
      const myBookingsCount = await Booking.countDocuments({ user: req.user._id });
      const activeBookings = await Booking.find({
        user: req.user._id,
        status: { $in: ['booked', 'active'] }
      })
        .populate('lot', 'name location city')
        .populate('slot', 'slotNumber floor type')
        .sort({ createdAt: -1 });

      const completedBookingsCount = await Booking.countDocuments({
        user: req.user._id,
        status: 'completed'
      });

      const userSpentData = await Booking.aggregate([
        { $match: { user: req.user._id, paymentStatus: 'paid' } },
        {
          $group: {
            _id: null,
            totalSpent: {
              $sum: {
                $cond: [{ $gt: ['$finalFee', 0] }, '$finalFee', '$estimatedFee']
              }
            }
          }
        }
      ]);

      const totalSpent = userSpentData.length > 0 ? userSpentData[0].totalSpent : 0;

      res.json({
        myBookingsCount,
        activeBookings,
        completedBookingsCount,
        totalSpent
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  cancelBooking,
  checkInVehicle,
  checkOutVehicle,
  getFeePreview,
  getUserBookings,
  getAllBookings,
  getDashboardStats
};
