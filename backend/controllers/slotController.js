const ParkingSlot = require('../models/ParkingSlot');
const ParkingLot = require('../models/ParkingLot');

// @desc    Get slots by Lot ID with optional floor, type, status filters
// @route   GET /api/slots/lot/:lotId
// @access  Public
const getSlotsByLot = async (req, res, next) => {
  try {
    const { floor, type, status, search } = req.query;
    let query = { lot: req.params.lotId };

    if (floor) query.floor = Number(floor);
    if (type) query.type = type;
    if (status) query.status = status;
    if (search) query.slotNumber = { $regex: search, $options: 'i' };

    const slots = await ParkingSlot.find(query)
      .populate({
        path: 'currentBooking',
        select: 'vehicleNumber vehicleType startTime status user',
        populate: { path: 'user', select: 'name email phone' }
      })
      .sort({ floor: 1, slotNumber: 1 });

    res.json(slots);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new slot in a parking lot
// @route   POST /api/slots
// @access  Private/Admin
const createSlot = async (req, res, next) => {
  try {
    const { lotId, slotNumber, floor, type } = req.body;

    if (!lotId || !slotNumber) {
      return res.status(400).json({ message: 'Lot ID and Slot Number are required' });
    }

    const lot = await ParkingLot.findById(lotId);
    if (!lot) {
      return res.status(404).json({ message: 'Parking Lot not found' });
    }

    const existingSlot = await ParkingSlot.findOne({ lot: lotId, slotNumber });
    if (existingSlot) {
      return res.status(400).json({ message: `Slot ${slotNumber} already exists in this lot` });
    }

    const slot = await ParkingSlot.create({
      lot: lotId,
      slotNumber: slotNumber.toUpperCase(),
      floor: floor || 1,
      type: type || 'car',
      status: 'available'
    });

    res.status(201).json(slot);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a slot (status, type, floor)
// @route   PUT /api/slots/:id
// @access  Private/Admin
const updateSlot = async (req, res, next) => {
  try {
    const slot = await ParkingSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: 'Parking Slot not found' });
    }

    if (req.body.slotNumber) slot.slotNumber = req.body.slotNumber.toUpperCase();
    if (req.body.floor !== undefined) slot.floor = req.body.floor;
    if (req.body.type) slot.type = req.body.type;
    if (req.body.status) slot.status = req.body.status;

    const updatedSlot = await slot.save();
    res.json(updatedSlot);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a slot
// @route   DELETE /api/slots/:id
// @access  Private/Admin
const deleteSlot = async (req, res, next) => {
  try {
    const slot = await ParkingSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: 'Parking Slot not found' });
    }

    if (slot.status === 'occupied' || slot.status === 'reserved') {
      return res.status(400).json({ message: 'Cannot delete a slot that is currently booked or occupied' });
    }

    await slot.deleteOne();
    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSlotsByLot,
  createSlot,
  updateSlot,
  deleteSlot
};
