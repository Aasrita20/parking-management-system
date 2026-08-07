import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold mb-4">
        <Car className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404 - Slot Not Found</h1>
      <p className="text-sm text-slate-400 mt-2 max-w-md">
        The parking page or resource you are looking for has been moved or does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2"
      >
        <Home className="w-4 h-4" /> Return to Home Dashboard
      </Link>
    </div>
  );
}
