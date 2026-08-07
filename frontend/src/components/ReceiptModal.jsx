import React from 'react';
import { X, Printer, CheckCircle2, Car, Calendar, Clock, Shield } from 'lucide-react';

export default function ReceiptModal({ booking, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const finalFee = booking.finalFee > 0 ? booking.finalFee : booking.estimatedFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 print:bg-transparent print:border-slate-300">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-500 print:text-black" />
            <h3 className="text-base font-bold text-white print:text-black">ParkPulse Official Receipt</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white print:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-5 text-xs">
          <div className="text-center py-2 border-b border-slate-800 print:border-slate-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30 print:border-black print:text-black">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>PAYMENT SUCCESSFUL</span>
            </span>
            <p className="text-[10px] text-slate-500 mt-2 font-mono">Invoice ID: #{booking._id.substring(0, 10).toUpperCase()}</p>
          </div>

          <div className="space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Facility:</span>
              <span className="font-bold text-white print:text-black">{booking.lot?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Location:</span>
              <span className="text-slate-300 print:text-slate-800">{booking.lot?.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Slot Code:</span>
              <span className="font-bold text-blue-400 print:text-black">Slot {booking.slot?.slotNumber} (Floor {booking.slot?.floor})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Vehicle Number:</span>
              <span className="font-bold text-white print:text-black">{booking.vehicleNumber} ({booking.vehicleType?.toUpperCase()})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Check In:</span>
              <span className="text-slate-300 print:text-slate-800">
                {new Date(booking.entryTime || booking.startTime).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Check Out:</span>
              <span className="text-slate-300 print:text-slate-800">
                {booking.exitTime ? new Date(booking.exitTime).toLocaleString() : 'Currently Active'}
              </span>
            </div>
          </div>

          {/* Amount Paid Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between font-mono print:bg-slate-100 print:border-slate-300">
            <div>
              <p className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-bold">Total Amount Paid</p>
              <p className="text-xl font-extrabold text-emerald-400 print:text-black">₹{finalFee}</p>
            </div>
            <div className="text-right text-[10px] text-slate-500">
              <p>Method: {booking.paymentMethod?.toUpperCase()}</p>
              <p>Rate: ₹{booking.hourlyRate}/hr</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-800 print:border-slate-300">
            Thank you for parking with ParkPulse! Safe Travels.
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
