const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Parking lot name is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location address is required'],
      trim: true
    },
    city: {
      type: String,
      default: 'Metropolis',
      trim: true
    },
    floors: {
      type: Number,
      default: 3,
      min: 1
    },
    totalSlots: {
      type: Number,
      required: [true, 'Total slots count is required'],
      min: 1
    },
    availableSlotsCount: {
      type: Number,
      default: 0
    },
    hourlyRates: {
      bike: { type: Number, default: 20 },
      car: { type: Number, default: 50 },
      ev: { type: Number, default: 60 },
      truck: { type: Number, default: 100 }
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1000'
    },
    description: {
      type: String,
      default: 'Secure indoor multi-level parking facility with 24/7 surveillance and EV charging spots.'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ParkingLot', parkingLotSchema);
