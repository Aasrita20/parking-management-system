import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { X, Car, Bike, Zap, Truck, Clock, CreditCard, ShieldCheck } from 'lucide-react';

export default function BookModal({ slot, lot, onClose, onSuccess }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [vehicleNumber, setVehicleNumber] = useState(user?.defaultVehicleNumber || '');
  const [vehicleType, setVehicleType] = useState(slot?.type || user?.defaultVehicleType || 'car');
  const [durationHours, setDurationHours] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const hourlyRate = lot?.hourlyRates?.[vehicleType] || lot?.hourlyRates?.car || 50;
  const estimatedFee = durationHours * hourlyRate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      addToast('Please enter your vehicle registration number', 'error');
      return;
    }

    setLoading(true);
    try {
      const booking = await fetchAPI('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          slotId: slot._id,
          vehicleNumber: vehicleNumber.toUpperCase().trim(),
          vehicleType,
          estimatedDurationHours: durationHours,
          paymentMethod
        })
      });

      addToast(`Slot ${slot.slotNumber} booked successfully!`, 'success');
      onSuccess(booking);
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to book slot', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              🅿️
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Reserve Slot {slot.slotNumber}</h3>
              <p className="text-xs text-slate-400">{lot.name} (Floor {slot.floor})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Vehicle Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Vehicle Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: 'car', label: 'Car', icon: <Car className="w-4 h-4" /> },
                { type: 'bike', label: 'Bike', icon: <Bike className="w-4 h-4" /> },
                { type: 'ev', label: 'EV', icon: <Zap className="w-4 h-4" /> },
                { type: 'truck', label: 'Truck', icon: <Truck className="w-4 h-4" /> }
              ].map((v) => (
                <button
                  type="button"
                  key={v.type}
                  onClick={() => setVehicleType(v.type)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                    vehicleType === v.type
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {v.icon}
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Plate Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Vehicle Number Plate
            </label>
            <input
              type="text"
              required
              placeholder="e.g. KA-05-MC-1234"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Duration Selector */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              <span>Estimated Duration</span>
              <span className="text-blue-400 font-bold">{durationHours} Hours</span>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>1h</span>
              <span>6h</span>
              <span>12h</span>
              <span>24h</span>
            </div>
          </div>

          {/* Pricing Summary Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Base Hourly Rate ({vehicleType.toUpperCase()}):</span>
              <span className="font-semibold text-slate-200">₹{hourlyRate}/hour</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Estimated Duration:</span>
              <span className="font-semibold text-slate-200">{durationHours} Hours</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
              <span className="text-white">Total Amount Due:</span>
              <span className="text-emerald-400 text-base">₹{estimatedFee}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Confirm & Book Slot</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
