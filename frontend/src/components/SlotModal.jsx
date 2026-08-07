import React, { useState } from 'react';
import { fetchAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { X, Save, Trash2 } from 'lucide-react';

export default function SlotModal({ slot, lotId, onClose, onSuccess }) {
  const { addToast } = useToast();

  const [slotNumber, setSlotNumber] = useState(slot?.slotNumber || '');
  const [floor, setFloor] = useState(slot?.floor || 1);
  const [type, setType] = useState(slot?.type || 'car');
  const [status, setStatus] = useState(slot?.status || 'available');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (slot?._id) {
        await fetchAPI(`/slots/${slot._id}`, {
          method: 'PUT',
          body: JSON.stringify({ slotNumber, floor: Number(floor), type, status })
        });
        addToast(`Slot ${slotNumber} updated`, 'success');
      } else {
        await fetchAPI('/slots', {
          method: 'POST',
          body: JSON.stringify({ lotId, slotNumber, floor: Number(floor), type })
        });
        addToast(`Slot ${slotNumber} added`, 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to save slot', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete Slot ${slot.slotNumber}?`)) return;
    setLoading(true);
    try {
      await fetchAPI(`/slots/${slot._id}`, { method: 'DELETE' });
      addToast('Slot deleted', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.message || 'Could not delete slot', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <h3 className="text-sm font-bold text-white">
            {slot ? `Edit Slot ${slot.slotNumber}` : 'Add New Parking Slot'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Slot Identifier</label>
            <input
              type="text"
              required
              placeholder="e.g. A-101"
              value={slotNumber}
              onChange={(e) => setSlotNumber(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono uppercase focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Floor Level</label>
              <input
                type="number"
                min="1"
                required
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Slot Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              >
                <option value="car">Car (4-Wheeler)</option>
                <option value="bike">Bike (2-Wheeler)</option>
                <option value="ev">EV Charging</option>
                <option value="truck">Truck / Bus</option>
              </select>
            </div>
          </div>

          {slot && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Operational Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          )}

          <div className="pt-3 flex items-center justify-between border-t border-slate-800">
            {slot ? (
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            ) : <div></div>}

            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="px-3 py-1.5 text-slate-400">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
