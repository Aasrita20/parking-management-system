import React, { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';
import LotCard from '../components/LotCard';
import { Search, MapPin, SlidersHorizontal, Building2 } from 'lucide-react';

export default function LotsPage() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const loadLots = async () => {
    setLoading(true);
    try {
      let query = `?search=${encodeURIComponent(search)}`;
      if (selectedCity) query += `&city=${encodeURIComponent(selectedCity)}`;

      const data = await fetchAPI(`/lots${query}`);
      setLots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLots();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-500" />
            <span>Find & Reserve Parking Facilities</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse multi-floor parking locations, check live available slots, and reserve your spot instantly.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lot name or area..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full sm:w-40 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="">All Cities</option>
            <option value="Metropolis">Metropolis</option>
            <option value="Downtown">Downtown</option>
          </select>
        </div>
      </div>

      {/* Grid of Lots */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-slate-400">Searching active parking lots...</p>
        </div>
      ) : lots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lots.map((lot) => (
            <LotCard key={lot._id} lot={lot} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
          <p className="text-sm font-semibold text-slate-300">No parking facilities match your search criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing your filters or searching for another keyword.</p>
          <button
            onClick={() => { setSearch(''); setSelectedCity(''); }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
