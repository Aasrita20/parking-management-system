const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const ParkingLot = require('../models/ParkingLot');
const ParkingSlot = require('../models/ParkingSlot');
const Booking = require('../models/Booking');

dotenv.config({ path: '../.env' });
if (!process.env.MONGODB_URI) {
  dotenv.config(); // fallback to current dir
}

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://23b01a45a9_db_user:Aasri%40123@cluster0.71ntzqf.mongodb.net/parking_management?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await ParkingLot.deleteMany();
    await ParkingSlot.deleteMany();
    await Booking.deleteMany();

    console.log('Cleared existing data.');

    // 1. Create Admin Account
    const adminEmail = process.env.ADMIN_EMAIL || 'aasrita.t2006@gmail.com';
    const admin = await User.create({
      name: 'Aasrita (Admin)',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      phone: '+1 800-555-PARK',
      defaultVehicleNumber: 'ADM-001',
      defaultVehicleType: 'car'
    });

    // 2. Create User Account
    const user = await User.create({
      name: 'Demo Driver',
      email: 'user@parking.com',
      password: 'user123',
      role: 'user',
      phone: '+1 555-019-2834',
      defaultVehicleNumber: 'KA-05-EV-9999',
      defaultVehicleType: 'ev'
    });

    console.log(`Created accounts:\n - Admin: ${admin.email}\n - User: ${user.email}`);

    // 3. Create Sample Parking Lots
    const lot1 = await ParkingLot.create({
      name: 'Metro Grand Central Plaza',
      location: '100 Financial Boulevard, Downtown',
      city: 'Metropolis',
      floors: 3,
      totalSlots: 24,
      hourlyRates: { bike: 20, car: 50, ev: 60, truck: 120 },
      imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1000',
      description: 'Multi-floor covered smart parking facility with automated entry barrier gates, fast EV superchargers, and 24/7 CCTV security.'
    });

    const lot2 = await ParkingLot.create({
      name: 'Silicon Hub Tech Park',
      location: '45 Innovation Way, Tech District',
      city: 'Metropolis',
      floors: 2,
      totalSlots: 16,
      hourlyRates: { bike: 15, car: 40, ev: 50, truck: 100 },
      imageUrl: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=1000',
      description: 'High-speed automated parking deck situated right next to major IT tech hubs and shopping centers.'
    });

    const lots = [lot1, lot2];

    // 4. Generate Slots for each Lot
    for (const lot of lots) {
      const slotsPerFloor = Math.ceil(lot.totalSlots / lot.floors);
      let slotsBatch = [];

      for (let f = 1; f <= lot.floors; f++) {
        const floorLetter = String.fromCharCode(64 + f); // A, B, C...
        for (let s = 1; s <= slotsPerFloor; s++) {
          if (slotsBatch.length >= lot.totalSlots) break;

          const slotNumber = `${floorLetter}-${100 + s}`;
          let type = 'car';
          if (s % 4 === 0) type = 'ev';
          else if (s % 3 === 0) type = 'bike';
          else if (s === 1 && f === lot.floors) type = 'truck';

          // Randomize status for rich demo visual feel
          let status = 'available';
          if (s === 2 && f === 1) status = 'occupied';
          else if (s === 3 && f === 1) status = 'reserved';
          else if (s === 6 && f === 2) status = 'maintenance';

          slotsBatch.push({
            slotNumber,
            lot: lot._id,
            floor: f,
            type,
            status
          });
        }
      }

      await ParkingSlot.insertMany(slotsBatch);
    }

    console.log('Seeded sample Parking Lots and Parking Slots successfully!');

    // 5. Create a sample active booking for user
    const sampleSlot = await ParkingSlot.findOne({ lot: lot1._id, status: 'reserved' });
    if (sampleSlot) {
      const booking = await Booking.create({
        user: user._id,
        lot: lot1._id,
        slot: sampleSlot._id,
        vehicleNumber: user.defaultVehicleNumber,
        vehicleType: 'ev',
        startTime: new Date(),
        estimatedDurationHours: 3,
        hourlyRate: lot1.hourlyRates.ev,
        estimatedFee: 180,
        paymentStatus: 'paid',
        status: 'booked'
      });

      sampleSlot.currentBooking = booking._id;
      await sampleSlot.save();
    }

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Error with Seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
