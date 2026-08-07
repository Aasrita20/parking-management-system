const ParkingLot = require('../models/ParkingLot');
const ParkingSlot = require('../models/ParkingSlot');

// @desc    Get all parking lots
// @route   GET /api/lots
// @access  Public
const getLots = async (req, res, next) => {
  try {
    const { city, search } = req.query;
    let query = { isActive: true };

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const lots = await ParkingLot.find(query).sort({ createdAt: -1 });

    // Compute live available slots for each lot dynamically
    const lotsWithAvailability = await Promise.all(
      lots.map(async (lot) => {
        const availableCount = await ParkingSlot.countDocuments({
          lot: lot._id,
          status: 'available'
        });
        const totalSlotsCount = await ParkingSlot.countDocuments({
          lot: lot._id
        });

        const lotObj = lot.toObject();
        lotObj.availableSlotsCount = availableCount;
        lotObj.totalSlots = totalSlotsCount || lot.totalSlots;
        return lotObj;
      })
    );

    res.json(lotsWithAvailability);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single parking lot by ID
// @route   GET /api/lots/:id
// @access  Public
const getLotById = async (req, res, next) => {
  try {
    const lot = await ParkingLot.findById(req.params.id);

    if (!lot) {
      return res.status(404).json({ message: 'Parking Lot not found' });
    }

    const availableCount = await ParkingSlot.countDocuments({
      lot: lot._id,
      status: 'available'
    });
    const totalSlotsCount = await ParkingSlot.countDocuments({
      lot: lot._id
    });

    const lotObj = lot.toObject();
    lotObj.availableSlotsCount = availableCount;
    lotObj.totalSlots = totalSlotsCount || lot.totalSlots;

    res.json(lotObj);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new parking lot
// @route   POST /api/lots
// @access  Private/Admin
const createLot = async (req, res, next) => {
  try {
    const { name, location, city, floors, totalSlots, hourlyRates, imageUrl, description } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    const lot = await ParkingLot.create({
      name,
      location,
      city: city || 'Metropolis',
      floors: floors || 3,
      totalSlots: totalSlots || 20,
      hourlyRates: hourlyRates || { bike: 20, car: 50, ev: 60, truck: 100 },
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1000',
      description: description || 'Modern parking structure with automated security and electric vehicle charging.'
    });

    // Automatically generate initial slots if requested or defaults
    const floorCount = lot.floors;
    const slotsPerFloor = Math.ceil(lot.totalSlots / floorCount);
    let createdSlots = [];

    for (let f = 1; f <= floorCount; f++) {
      const floorPrefix = String.fromCharCode(64 + f); // A, B, C...
      for (let s = 1; s <= slotsPerFloor; s++) {
        if (createdSlots.length >= lot.totalSlots) break;

        const slotNum = `${floorPrefix}-${100 + s}`;
        // Distribute slot types: EV every 5th, Bike every 3rd, Car for rest
        let type = 'car';
        if (s % 5 === 0) type = 'ev';
        else if (s % 3 === 0) type = 'bike';
        else if (s === 1 && f === floorCount) type = 'truck';

        createdSlots.push({
          slotNumber: slotNum,
          lot: lot._id,
          floor: f,
          type,
          status: 'available'
        });
      }
    }

    if (createdSlots.length > 0) {
      await ParkingSlot.insertMany(createdSlots);
    }

    res.status(201).json(lot);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a parking lot
// @route   PUT /api/lots/:id
// @access  Private/Admin
const updateLot = async (req, res, next) => {
  try {
    const lot = await ParkingLot.findById(req.params.id);

    if (!lot) {
      return res.status(404).json({ message: 'Parking Lot not found' });
    }

    lot.name = req.body.name || lot.name;
    lot.location = req.body.location || lot.location;
    lot.city = req.body.city || lot.city;
    lot.floors = req.body.floors || lot.floors;
    lot.totalSlots = req.body.totalSlots || lot.totalSlots;
    lot.imageUrl = req.body.imageUrl || lot.imageUrl;
    lot.description = req.body.description || lot.description;

    if (req.body.hourlyRates) {
      lot.hourlyRates = {
        ...lot.hourlyRates,
        ...req.body.hourlyRates
      };
    }

    const updatedLot = await lot.save();
    res.json(updatedLot);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a parking lot and its slots
// @route   DELETE /api/lots/:id
// @access  Private/Admin
const deleteLot = async (req, res, next) => {
  try {
    const lot = await ParkingLot.findById(req.params.id);

    if (!lot) {
      return res.status(404).json({ message: 'Parking Lot not found' });
    }

    // Delete associated slots
    await ParkingSlot.deleteMany({ lot: lot._id });
    await lot.deleteOne();

    res.json({ message: 'Parking Lot and all associated slots deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLots,
  getLotById,
  createLot,
  updateLot,
  deleteLot
};
