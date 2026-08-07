import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchAPI } from '../services/api';
import CheckInOutModal from '../components/CheckInOutModal';
import ReceiptModal from '../components/ReceiptModal';
import {
  Building2,
  Car,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Zap,
  ArrowUpRight,
  Filter
} from 'lucide-react';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForGate, setSelectedBookingForGate] = useState(null);
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState(null);

  const loadStats = async () => {
    try {
      const data = await fetchAPI('/bookings/dashboard-stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-slate-400">Loading live parking stats...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 uppercase tracking-wider">
                {isAdmin ? 'System Administrator Portal' : 'Driver Dashboard'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-blue-400">{user?.name}</span> 👋
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
              {isAdmin
                ? 'Monitor facility occupancy, track active vehicles inside lots, and manage revenue calculations in real time.'
                : 'Manage your active spot reservations, view parking floor maps, and access instant billing receipts.'}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/lots"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span>Explore Parking Lots</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ADMIN DASHBOARD WIDGETS */}
      {isAdmin && stats && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Active Lots</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white">{stats.totalLots}</p>
              <p className="text-[11px] text-slate-500">{stats.totalSlots} Total Slots Managed</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Live Occupancy Rate</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white">{stats.occupancyRate}%</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: `${stats.occupancyRate}%` }}></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Occupied Slots</span>
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                  <Car className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white">{stats.occupiedSlots + stats.reservedSlots}</p>
              <p className="text-[11px] text-emerald-400 font-semibold">{stats.availableSlots} Slots Available Right Now</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-emerald-400">₹{stats.totalRevenue}</p>
              <p className="text-[11px] text-slate-500">Automated Billing System</p>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Recent Vehicle Bookings & Barrier Gates</span>
              </h3>
              <Link to="/admin/lots" className="text-xs font-semibold text-blue-400 hover:text-blue-300">
                Manage Gate Entry/Exit →
              </Link>
            </div>

            {stats.recentBookings && stats.recentBookings.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {stats.recentBookings.map((b) => (
                  <div key={b._id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-mono font-bold text-blue-400">
                        {b.slot?.slotNumber || 'P'}
                      </div>
                      <div>
                        <p className="font-bold text-white">{b.vehicleNumber} ({b.user?.name})</p>
                        <p className="text-[11px] text-slate-400">{b.lot?.name} • {new Date(b.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'booked' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        b.status === 'active' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        b.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {b.status}
                      </span>

                      {(b.status === 'booked' || b.status === 'active') && (
                        <button
                          onClick={() => setSelectedBookingForGate(b)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-[11px]"
                        >
                          Barrier Gate Action
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No recent activity recorded.</p>
            )}
          </div>
        </div>
      )}

      {/* USER DASHBOARD WIDGETS */}
      {!isAdmin && stats && (
        <div className="space-y-8">
          {/* User Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Active Reservations</span>
              <p className="text-3xl font-extrabold text-white">{stats.activeBookings?.length || 0}</p>
              <p className="text-[11px] text-blue-400">Current Reserved Slots</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Completed Trips</span>
              <p className="text-3xl font-extrabold text-white">{stats.completedBookingsCount || 0}</p>
              <p className="text-[11px] text-slate-500 font-mono">Past Bookings</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Parking Spent</span>
              <p className="text-3xl font-extrabold text-emerald-400">₹{stats.totalSpent || 0}</p>
              <p className="text-[11px] text-slate-500">Paid Invoices</p>
            </div>
          </div>

          {/* Active Bookings List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>My Active Reservations</span>
              </h3>
              <Link to="/bookings" className="text-xs font-semibold text-blue-400 hover:text-blue-300">
                View Full Booking History →
              </Link>
            </div>

            {stats.activeBookings && stats.activeBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.activeBookings.map((booking) => (
                  <div key={booking._id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Slot {booking.slot?.slotNumber}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{booking.lot?.name}</h4>
                        <p className="text-xs text-slate-400">{booking.lot?.location}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        booking.status === 'booked' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Vehicle No.</span>
                        <span className="font-bold text-white">{booking.vehicleNumber}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[10px]">Est. Fee</span>
                        <span className="font-bold text-emerald-400">₹{booking.estimatedFee}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedBookingForReceipt(booking)}
                      className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                    >
                      View Digital Ticket / Receipt
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                <p className="text-xs text-slate-400">You have no active parking reservations right now.</p>
                <Link
                  to="/lots"
                  className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30"
                >
                  Book a Parking Spot Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALS */}
      {selectedBookingForGate && (
        <CheckInOutModal
          booking={selectedBookingForGate}
          onClose={() => setSelectedBookingForGate(null)}
          onSuccess={loadStats}
        />
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
