const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema(
  {
    slotNumber: {
      type: String,
      required: [true, 'Slot number is required (e.g. A-101)'],
      trim: true
    },
    lot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingLot',
      required: true
    },
    floor: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      enum: ['bike', 'car', 'ev', 'truck'],
      default: 'car'
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'occupied', 'maintenance'],
      default: 'available'
    },
    currentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Composite index to ensure slotNumber is unique per Lot
parkingSlotSchema.index({ lot: 1, slotNumber: 1 }, { unique: true });

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);
