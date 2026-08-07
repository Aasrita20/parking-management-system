import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SlotGrid from '../components/SlotGrid';
import BookModal from '../components/BookModal';
import SlotModal from '../components/SlotModal';
import {
  MapPin,
  Layers,
  Car,
  Bike,
  Zap,
  Truck,
  ArrowLeft,
  Filter,
  Plus,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function LotDetailsPage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();

  const [lot, setLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals
  const [selectedSlotToBook, setSelectedSlotToBook] = useState(null);
  const [selectedSlotToEdit, setSelectedSlotToEdit] = useState(null);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);

  const loadLotDetails = async () => {
    try {
      const lotData = await fetchAPI(`/lots/${id}`);
      setLot(lotData);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSlots = async () => {
    try {
      let query = '';
      const params = [];
      if (selectedFloor) params.push(`floor=${selectedFloor}`);
      if (selectedType) params.push(`type=${selectedType}`);
      if (selectedStatus) params.push(`status=${selectedStatus}`);
      if (params.length > 0) query = '?' + params.join('&');

      const slotsData = await fetchAPI(`/slots/lot/${id}${query}`);
      setSlots(slotsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLotDetails();
  }, [id]);

  useEffect(() => {
    loadSlots();
  }, [id, selectedFloor, selectedType, selectedStatus]);

  if (!lot && loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-slate-400">Loading interactive floor map...</p>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white">Parking Lot Not Found</h2>
        <Link to="/lots" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-xl">
          Back to Lots Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Button */}
      <Link to="/lots" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Parking Directory
      </Link>

      {/* Lot Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                {lot.availableSlotsCount} / {lot.totalSlots} Slots Available
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                {lot.floors} Floors Facility
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">{lot.name}</h1>
            <p className="text-xs md:text-sm text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{lot.location}, {lot.city}</span>
            </p>
          </div>

          {/* Rates pill */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-4 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Bike Rate</span>
              <span className="font-extrabold text-white text-sm">₹{lot.hourlyRates?.bike}/h</span>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Car Rate</span>
              <span className="font-extrabold text-blue-400 text-sm">₹{lot.hourlyRates?.car}/h</span>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">EV Rate</span>
              <span className="font-extrabold text-amber-400 text-sm">₹{lot.hourlyRates?.ev}/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Floor & Slot Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Floor Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase mr-1">Floor:</span>
            <button
              onClick={() => setSelectedFloor('')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedFloor === '' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              All Floors ({lot.floors})
            </button>
            {Array.from({ length: lot.floors }, (_, i) => i + 1).map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFloor(String(f))}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedFloor === String(f) ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Floor {f}
              </button>
            ))}
          </div>

          {/* Type & Status Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none"
            >
              <option value="">All Vehicle Types</option>
              <option value="car">Cars (4-Wheeler)</option>
              <option value="bike">Bikes (2-Wheeler)</option>
              <option value="ev">EV Charging</option>
              <option value="truck">Trucks</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="available">Available Only</option>
              <option value="reserved">Reserved</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>

            {isAdmin && (
              <button
                onClick={() => setShowAddSlotModal(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1 shadow-md shadow-emerald-600/20"
              >
                <Plus className="w-3.5 h-3.5" /> Add Slot
              </button>
            )}
          </div>
        </div>

        {/* Visual Slot Grid */}
        <SlotGrid
          slots={slots}
          selectedSlot={selectedSlotToBook}
          onSelectSlot={(slot) => setSelectedSlotToBook(slot)}
          onEditSlot={(slot) => setSelectedSlotToEdit(slot)}
          isAdmin={isAdmin}
        />
      </div>

      {/* Modals */}
      {selectedSlotToBook && (
        <BookModal
          slot={selectedSlotToBook}
          lot={lot}
          onClose={() => setSelectedSlotToBook(null)}
          onSuccess={() => {
            loadSlots();
            loadLotDetails();
          }}
        />
      )}

      {selectedSlotToEdit && (
        <SlotModal
          slot={selectedSlotToEdit}
          lotId={lot._id}
          onClose={() => setSelectedSlotToEdit(null)}
          onSuccess={() => {
            loadSlots();
            loadLotDetails();
          }}
        />
      )}

      {showAddSlotModal && (
        <SlotModal
          slot={null}
          lotId={lot._id}
          onClose={() => setShowAddSlotModal(false)}
          onSuccess={() => {
            loadSlots();
            loadLotDetails();
          }}
        />
      )}
    </div>
  );
}
