import React from 'react';
import { Car, Shield, Clock, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <Car className="w-5 h-5 text-blue-500" />
              <span>ParkPulse</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Next-generation smart parking management platform for effortless spot reservations, vehicle entry/exit tracking, and instant automated billing.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Key Features</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-blue-400" /> Real-time Slot Availability</li>
              <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-amber-400" /> EV Supercharging Slots</li>
              <li className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Automatic Fee Engine</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Vehicle Categories</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>🚗 4-Wheeler Cars & SUVs</li>
              <li>🏍️ 2-Wheeler Motorcycles</li>
              <li>⚡ Electric Vehicles (EV)</li>
              <li>🚚 Heavy Trucks & Vans</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">System Info</h4>
            <p className="text-xs text-slate-500">
              Built with Node.js, Express, React, Tailwind CSS, and MongoDB.
            </p>
            <p className="text-[11px] text-blue-400 mt-2 font-mono">
              Status: Operational (All Clusters Online)
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} ParkPulse Full Stack Parking System. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
