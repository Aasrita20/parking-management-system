const express = require('express');
const router = express.Router();
const {
  getLots,
  getLotById,
  createLot,
  updateLot,
  deleteLot
} = require('../controllers/lotController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getLots)
  .post(protect, adminOnly, createLot);

router.route('/:id')
  .get(getLotById)
  .put(protect, adminOnly, updateLot)
  .delete(protect, adminOnly, deleteLot);

module.exports = router;
