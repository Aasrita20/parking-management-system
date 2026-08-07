const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingLot',
      required: true
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingSlot',
      required: true
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number is required'],
      uppercase: true,
      trim: true
    },
    vehicleType: {
      type: String,
      enum: ['bike', 'car', 'ev', 'truck'],
      required: true
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now
    },
    estimatedDurationHours: {
      type: Number,
      required: true,
      default: 2
    },
    entryTime: {
      type: Date,
      default: null
    },
    exitTime: {
      type: Date,
      default: null
    },
    hourlyRate: {
      type: Number,
      required: true
    },
    estimatedFee: {
      type: Number,
      default: 0
    },
    finalFee: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['booked', 'active', 'completed', 'cancelled'],
      default: 'booked'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'cash', 'wallet'],
      default: 'card'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
