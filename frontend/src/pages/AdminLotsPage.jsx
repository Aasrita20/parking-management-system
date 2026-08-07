import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import LotModal from '../components/LotModal';
import CheckInOutModal from '../components/CheckInOutModal';
import { ShieldCheck, Plus, Edit, Trash2, Building2, Car, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminLotsPage() {
  const { addToast } = useToast();

  const [lots, setLots] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedLotForEdit, setSelectedLotForEdit] = useState(null);
  const [showAddLotModal, setShowAddLotModal] = useState(false);
  const [selectedBookingForGate, setSelectedBookingForGate] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const lotsData = await fetchAPI('/lots');
      setLots(lotsData);

      const bookingsData = await fetchAPI('/bookings');
      setAllBookings(bookingsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteLot = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete parking facility "${name}" and all its slots?`)) return;

    try {
      await fetchAPI(`/lots/${id}`, { method: 'DELETE' });
      addToast(`Parking Lot "${name}" deleted`, 'success');
      loadData();
    } catch (err) {
      addToast(err.message || 'Could not delete lot', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              ADMIN CONTROL CENTER
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2 mt-1">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
            <span>Manage Parking Lots & Barrier Gates</span>
          </h1>
          <p className="text-xs text-slate-400">Add, edit, or remove parking lots and simulate live barrier gate entry/exits.</p>
        </div>

        <button
          onClick={() => setShowAddLotModal(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Parking Lot</span>
        </button>
      </div>

      {/* Facilities Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-400" />
          <span>Configured Parking Facilities ({lots.length})</span>
        </h2>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading facilities...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lots.map((lot) => (
              <div key={lot._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{lot.name}</h3>
                    <p className="text-xs text-slate-400">{lot.location}, {lot.city}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedLotForEdit(lot)}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg"
                      title="Edit Lot"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLot(lot._id, lot.name)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      title="Delete Lot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Total Slots</span>
                    <span className="font-bold text-white text-base">{lot.totalSlots}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Available</span>
                    <span className="font-bold text-emerald-400 text-base">{lot.availableSlotsCount}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Floors</span>
                    <span className="font-bold text-blue-400 text-base">{lot.floors}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Car Rate: <strong>₹{lot.hourlyRates?.car}/h</strong></span>
                  <Link
                    to={`/lots/${lot._id}`}
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                  >
                    <span>Manage Slot Grid</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global Vehicle Gate Control Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Car className="w-5 h-5 text-emerald-400" />
          <span>Vehicle Entry & Exit Gate Queue ({allBookings.length} Total Bookings)</span>
        </h2>

        {allBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Facility & Slot</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action Gate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {allBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-white">
                      {b.vehicleNumber} ({b.vehicleType?.toUpperCase()})
                    </td>
                    <td className="p-3 text-slate-300">
                      {b.user?.name || 'Guest'}
                    </td>
                    <td className="p-3 text-slate-300">
                      {b.lot?.name} <span className="text-blue-400 font-bold font-mono">(Slot {b.slot?.slotNumber})</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.status === 'booked' ? 'bg-amber-500/20 text-amber-300' :
                        b.status === 'active' ? 'bg-rose-500/20 text-rose-300' :
                        b.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {(b.status === 'booked' || b.status === 'active') ? (
                        <button
                          onClick={() => setSelectedBookingForGate(b)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
                        >
                          Trigger Gate
                        </button>
                      ) : (
                        <span className="text-slate-500 font-mono text-[10px]">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-4">No active or historical bookings found.</p>
        )}
      </div>

      {/* Modals */}
      {showAddLotModal && (
        <LotModal
          lot={null}
          onClose={() => setShowAddLotModal(false)}
          onSuccess={loadData}
        />
      )}

      {selectedLotForEdit && (
        <LotModal
          lot={selectedLotForEdit}
          onClose={() => setSelectedLotForEdit(null)}
          onSuccess={loadData}
        />
      )}

      {selectedBookingForGate && (
        <CheckInOutModal
          booking={selectedBookingForGate}
          onClose={() => setSelectedBookingForGate(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
