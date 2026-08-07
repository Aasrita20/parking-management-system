import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Layers, Car, Bike, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LotCard({ lot }) {
  const availableCount = lot.availableSlotsCount ?? 0;
  const totalCount = lot.totalSlots ?? 0;
  const occupancyPercentage = totalCount > 0 ? Math.round(((totalCount - availableCount) / totalCount) * 100) : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 group flex flex-col justify-between">
      <div>
        {/* Image & Occupancy Badge */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={lot.imageUrl}
            alt={lot.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

          {/* Occupancy Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border flex items-center gap-1.5 shadow-md bg-slate-900/80 border-slate-700 text-white">
            <span className={`w-2 h-2 rounded-full ${availableCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
            {availableCount > 0 ? `${availableCount} Available` : 'FULL'}
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
              {lot.name}
            </h3>
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{lot.location}, {lot.city}</span>
            </p>
          </div>
        </div>

        {/* Content & Specs */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {lot.description}
          </p>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
              <span>Occupancy</span>
              <span className={occupancyPercentage > 85 ? 'text-rose-400' : 'text-emerald-400'}>
                {occupancyPercentage}% ({totalCount - availableCount}/{totalCount} slots)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  occupancyPercentage > 85 ? 'bg-rose-500' : occupancyPercentage > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${occupancyPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Hourly Rates Grid */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] uppercase font-bold">
                <Bike className="w-3 h-3 text-emerald-400" /> Bike
              </div>
              <p className="font-bold text-white mt-0.5">₹{lot.hourlyRates?.bike || 20}/h</p>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] uppercase font-bold">
                <Car className="w-3 h-3 text-blue-400" /> Car
              </div>
              <p className="font-bold text-white mt-0.5">₹{lot.hourlyRates?.car || 50}/h</p>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] uppercase font-bold">
                <Zap className="w-3 h-3 text-amber-400" /> EV
              </div>
              <p className="font-bold text-white mt-0.5">₹{lot.hourlyRates?.ev || 60}/h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 pt-0">
        <Link
          to={`/lots/${lot._id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-semibold text-xs border border-blue-500/30 transition-all group-hover:shadow-lg group-hover:shadow-blue-500/20"
        >
          <span>View Layout & Book</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
