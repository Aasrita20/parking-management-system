import React, { useState } from 'react';
import { fetchAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { X, LogIn, LogOut, Calculator, Clock, DollarSign } from 'lucide-react';

export default function CheckInOutModal({ booking, onClose, onSuccess }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [feePreview, setFeePreview] = useState(null);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI(`/bookings/${booking._id}/check-in`, {
        method: 'PUT'
      });
      addToast('Vehicle checked in successfully!', 'success');
      onSuccess(res.booking);
      onClose();
    } catch (err) {
      addToast(err.message || 'Check-in failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchPreview = async () => {
    try {
      const preview = await fetchAPI(`/bookings/${booking._id}/fee-preview`);
      setFeePreview(preview);
    } catch (err) {
      addToast(err.message || 'Could not fetch fee preview', 'error');
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI(`/bookings/${booking._id}/check-out`, {
        method: 'PUT'
      });
      addToast(`Vehicle checked out! Total Fee: ₹${res.calculation.totalFee}`, 'success');
      onSuccess(res.booking);
      onClose();
    } catch (err) {
      addToast(err.message || 'Check-out failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isBooked = booking.status === 'booked';
  const isActive = booking.status === 'active';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Vehicle Barrier Control</span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Vehicle Number:</span>
              <span className="font-mono font-bold text-white text-sm">{booking.vehicleNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Parking Lot & Slot:</span>
              <span className="font-semibold text-blue-400">{booking.lot?.name} (Slot {booking.slot?.slotNumber})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="uppercase font-bold text-amber-400">{booking.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hourly Rate:</span>
              <span className="font-bold text-white">₹{booking.hourlyRate}/hour</span>
            </div>
          </div>

          {/* Current Action Info */}
          {isBooked && (
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-2">
              <LogIn className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Vehicle has arrived at gate. Click Entry Check-In to lift barrier gate and mark slot occupied.</span>
            </div>
          )}

          {isActive && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Vehicle is inside lot. Checked in at {new Date(booking.entryTime || booking.startTime).toLocaleTimeString()}</span>
                </div>
                <button
                  onClick={handleFetchPreview}
                  className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 hover:bg-amber-500/30"
                >
                  Calc Fee
                </button>
              </div>

              {feePreview && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Duration:</span>
                    <span>{feePreview.durationMinutes} mins ({feePreview.durationHours} hrs)</span>
                  </div>
                  <div className="flex justify-between text-slate-200 font-bold text-sm">
                    <span>Total Fee:</span>
                    <span className="text-emerald-400">₹{feePreview.fee}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 flex gap-3">
            {isBooked && (
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Vehicle ENTRY (Check In)</span>
              </button>
            )}

            {isActive && (
              <button
                onClick={handleCheckOut}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Vehicle EXIT & Calculate Fee</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
