import React from 'react';
import { Car, Bike, Zap, Truck, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SlotGrid({ slots, selectedSlot, onSelectSlot, onEditSlot, isAdmin }) {
  const getSlotIcon = (type) => {
    switch (type) {
      case 'bike':
        return <Bike className="w-5 h-5" />;
      case 'ev':
        return <Zap className="w-5 h-5 text-amber-300" />;
      case 'truck':
        return <Truck className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80 hover:border-emerald-400',
          label: 'AVAILABLE',
          color: 'bg-emerald-500'
        };
      case 'reserved':
        return {
          bg: 'bg-amber-950/70 border-amber-500/40 text-amber-300 cursor-not-allowed',
          label: 'RESERVED',
          color: 'bg-amber-500'
        };
      case 'occupied':
        return {
          bg: 'bg-rose-950/70 border-rose-500/40 text-rose-300 cursor-not-allowed',
          label: 'OCCUPIED',
          color: 'bg-rose-500'
        };
      case 'maintenance':
        return {
          bg: 'bg-slate-800/60 border-slate-700 text-slate-400 cursor-not-allowed',
          label: 'MAINTENANCE',
          color: 'bg-slate-500'
        };
      default:
        return {
          bg: 'bg-slate-800 border-slate-700 text-slate-300',
          label: status,
          color: 'bg-slate-400'
        };
    }
  };

  if (!slots || slots.length === 0) {
    return (
      <div className="py-12 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h4 className="text-base font-semibold text-slate-300">No parking slots found</h4>
        <p className="text-xs text-slate-500 mt-1">Try resetting your filters or selecting a different floor level.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs">
        <span className="font-semibold text-slate-400 mr-2">Slot Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-300">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-slate-300">Reserved / Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span className="text-slate-300">Occupied (Vehicle In)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
          <span className="text-slate-400">Maintenance</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {slots.map((slot) => {
          const badge = getStatusBadge(slot.status);
          const isSelected = selectedSlot?._id === slot._id;
          const isAvailable = slot.status === 'available';

          return (
            <div
              key={slot._id}
              onClick={() => isAvailable && onSelectSlot && onSelectSlot(slot)}
              className={`relative p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between h-32 select-none ${
                badge.bg
              } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950 scale-105 shadow-lg shadow-blue-500/20' : ''} ${
                isAvailable ? 'cursor-pointer hover:scale-[1.02]' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-950/60 text-white">
                  {slot.slotNumber}
                </span>
                <span className="capitalize text-[10px] px-1.5 py-0.5 rounded bg-slate-900/60 font-medium">
                  Fl-{slot.floor}
                </span>
              </div>

              {/* Icon & Type */}
              <div className="my-auto flex flex-col items-center justify-center gap-1 py-1">
                <div className={`p-2 rounded-lg ${slot.status === 'occupied' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-900/40'}`}>
                  {getSlotIcon(slot.type)}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {slot.type}
                </span>
              </div>

              {/* Status Indicator Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${badge.color}`}></span>
                  <span className="text-[10px] font-bold tracking-wider">{badge.label}</span>
                </div>

                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSlot(slot);
                    }}
                    className="text-[10px] underline text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
