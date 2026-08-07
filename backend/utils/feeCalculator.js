/**
 * Utility function to calculate parking fees dynamically
 * @param {Date} startTime 
 * @param {Date} exitTime 
 * @param {Number} hourlyRate 
 * @returns {Object} { durationMinutes, durationHours, fee }
 */
const calculateParkingFee = (startTime, exitTime, hourlyRate) => {
  const start = new Date(startTime);
  const end = exitTime ? new Date(exitTime) : new Date();

  // Difference in milliseconds
  const diffMs = Math.max(0, end - start);
  const durationMinutes = Math.ceil(diffMs / (1000 * 60));

  // Charge per full or partial hour (minimum 1 hour)
  const durationHours = Math.max(1, Math.ceil(durationMinutes / 60));
  const fee = durationHours * hourlyRate;

  return {
    durationMinutes,
    durationHours,
    fee
  };
};

module.exports = { calculateParkingFee };
