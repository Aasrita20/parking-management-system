import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import ReceiptModal from '../components/ReceiptModal';
import { CalendarCheck2, XCircle, Printer, Clock, CheckCircle2, Car, AlertTriangle } from 'lucide-react';

export default function BookingsPage() {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      let query = filterStatus ? `?status=${filterStatus}` : '';
      const data = await fetchAPI(`/bookings/my-bookings${query}`);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [filterStatus]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this slot reservation?')) return;

    try {
      await fetchAPI(`/bookings/${id}/cancel`, { method: 'PUT' });
      addToast('Booking cancelled successfully', 'info');
      loadBookings();
    } catch (err) {
      addToast(err.message || 'Could not cancel booking', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CalendarCheck2 className="w-7 h-7 text-blue-500" />
            <span>My Parking Reservations & History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track active tickets, review billing history, or print official invoice receipts.
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl overflow-x-auto text-xs font-semibold">
          {[
            { label: 'All', value: '' },
            { label: 'Active / Reserved', value: 'booked' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                filterStatus === tab.value
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-400">Loading reservation history...</p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((b) => {
            const finalPrice = b.finalFee > 0 ? b.finalFee : b.estimatedFee;

            return (
              <div
                key={b._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0">
                    <Car className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{b.lot?.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-blue-400 border border-slate-800">
                        Slot {b.slot?.slotNumber}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">{b.lot?.location}, {b.lot?.city}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1 font-mono">
                      <span>Vehicle: <strong className="text-slate-200">{b.vehicleNumber} ({b.vehicleType?.toUpperCase()})</strong></span>
                      <span>Booked: <strong className="text-slate-200">{new Date(b.createdAt).toLocaleDateString()}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      b.status === 'booked' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      b.status === 'active' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      b.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {b.status}
                    </span>

                    <span className="text-lg font-extrabold text-emerald-400 font-mono">
                      ₹{finalPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {b.status === 'booked' && (
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl border border-rose-500/20 transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedBookingForReceipt(b)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" /> Digital Receipt
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
          <AlertTriangle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No reservations found in this view.</p>
          <p className="text-xs text-slate-500 mt-1">Book your first slot from the Find Parking section.</p>
        </div>
      )}

      {selectedBookingForReceipt && (
        <ReceiptModal
          booking={selectedBookingForReceipt}
          onClose={() => setSelectedBookingForReceipt(null)}
        />
      )}
    </div>
  );
}
