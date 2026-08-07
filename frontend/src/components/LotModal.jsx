import React, { useState } from 'react';
import { fetchAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { X, Building2, Save } from 'lucide-react';

export default function LotModal({ lot, onClose, onSuccess }) {
  const { addToast } = useToast();

  const [name, setName] = useState(lot?.name || '');
  const [location, setLocation] = useState(lot?.location || '');
  const [city, setCity] = useState(lot?.city || 'Metropolis');
  const [floors, setFloors] = useState(lot?.floors || 3);
  const [totalSlots, setTotalSlots] = useState(lot?.totalSlots || 20);
  const [bikeRate, setBikeRate] = useState(lot?.hourlyRates?.bike || 20);
  const [carRate, setCarRate] = useState(lot?.hourlyRates?.car || 50);
  const [evRate, setEvRate] = useState(lot?.hourlyRates?.ev || 60);
  const [truckRate, setTruckRate] = useState(lot?.hourlyRates?.truck || 100);
  const [imageUrl, setImageUrl] = useState(
    lot?.imageUrl || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1000'
  );
  const [description, setDescription] = useState(lot?.description || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      location,
      city,
      floors: Number(floors),
      totalSlots: Number(totalSlots),
      hourlyRates: {
        bike: Number(bikeRate),
        car: Number(carRate),
        ev: Number(evRate),
        truck: Number(truckRate)
      },
      imageUrl,
      description
    };

    try {
      if (lot?._id) {
        await fetchAPI(`/lots/${lot._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        addToast('Parking Lot updated successfully!', 'success');
      } else {
        await fetchAPI('/lots', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        addToast('Parking Lot created with slots!', 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to save lot', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            <span>{lot ? 'Edit Parking Facility' : 'Create New Parking Facility'}</span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Facility Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. City Center Mall Parking"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Location Address</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 5th Main Road"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Floors Count</label>
              <input
                type="number"
                min="1"
                required
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Total Capacity Slots</label>
              <input
                type="number"
                min="1"
                required
                value={totalSlots}
                onChange={(e) => setTotalSlots(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Hourly Rates */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2 uppercase tracking-wider">Hourly Rates (₹)</label>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Bike</span>
                <input
                  type="number"
                  value={bikeRate}
                  onChange={(e) => setBikeRate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Car</span>
                <input
                  type="number"
                  value={carRate}
                  onChange={(e) => setCarRate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">EV</span>
                <input
                  type="number"
                  value={evRate}
                  onChange={(e) => setEvRate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Truck</span>
                <input
                  type="number"
                  value={truckRate}
                  onChange={(e) => setTruckRate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Cover Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Lot'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
