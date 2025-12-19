"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { API_BASE } from '@/lib/api';

const formatDateTime = (date) => {
  const d = new Date(date);
  return d.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
};

const calculateDuration = (start, end) => {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const diffMs = endTime - startTime;
  if (diffMs < 0) return '0h 0m';
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export default function CheckoutReport() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCheckout = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${API_BASE}/checkins/token/${token}`);
        if (!response.ok) {
          throw new Error('Checkout not found');
        }
        const checkout = await response.json();
        if (checkout.status !== 'checkedOut') {
          throw new Error('This is not a checked out record');
        }
        setData(checkout);
      } catch (err) {
        console.error('Error fetching checkout:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckout();
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-lg shadow-lg">
          <p className="text-red-600 mb-3 text-sm font-medium">{error || 'No data found'}</p>
          <button 
            onClick={() => window.history.back()} 
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const duration = calculateDuration(data.checkInTime, data.updatedAt);
  const totalUnits = Object.values(data.luggage).reduce((sum, val) => sum + val, 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 py-4 px-3 flex items-start justify-center print:items-start print:p-0">
      <div className="w-full max-w-[80mm] bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 print:shadow-none print:rounded-none  print:max-w-[80mm] print:w-[80mm]">
        
        {/* Header */}
        <div className="bg-linear-to-r from-orange-500 via-amber-500 to-orange-500 text-white px-4 py-3 print:py-2 print:bg-orange-600">
          <h1 className="text-center font-bold text-sm print:text-xs tracking-widest">CLOAK ROOM RECEIPT</h1>
          <p className="text-center text-xs print:text-[10px] opacity-95 mt-1 print:mt-0.5">Token: {data.tokenNo}</p>
        </div>

        {/* Content - Single Column Layout for Print */}
        <div className="p-4 print:p-3 space-y-4 print:space-y-2">
          
          {/* Passenger Info */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
            <h2 className="text-xs print:text-[10px] font-bold text-gray-800 mb-2 uppercase tracking-wide flex items-center gap-1">
              <span className="w-1 h-4 print:h-3.5 bg-orange-500 rounded-full"></span>
              Passenger Details
            </h2>
            <div className="space-y-1.5 text-xs print:text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-semibold text-gray-800">{data.passengerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile</span>
                <span className="font-semibold text-gray-800">+91 {data.passengerMobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PNR</span>
                <span className="font-semibold text-gray-800">{data.pnrNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aadhaar</span>
                <span className="font-semibold text-gray-800">{data.aadharNumber}</span>
              </div>
            </div>
          </div>

          {/* Timing Info */}
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
            <h2 className="text-xs print:text-[10px] font-bold text-gray-800 mb-2 uppercase tracking-wide flex items-center gap-1">
              <span className="w-1 h-4 print:h-3.5 bg-blue-500 rounded-full"></span>
              Timing
            </h2>
            <div className="space-y-1.5 text-xs print:text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in</span>
                <span className="font-semibold text-gray-800">{formatDateTime(data.checkInTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out</span>
                <span className="font-semibold text-gray-800">{formatDateTime(data.updatedAt)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-300">
                <span className="text-gray-700 font-medium">Duration</span>
                <span className="font-bold text-blue-700 text-sm print:text-[10px]">{duration}</span>
              </div>
            </div>
          </div>

          {/* Luggage */}
          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
            <h2 className="text-xs print:text-[10px] font-bold text-gray-800 mb-2 uppercase tracking-wide flex items-center gap-1">
              <span className="w-1 h-4 print:h-3.5 bg-purple-500 rounded-full"></span>
              Luggage
            </h2>
            <div className="space-y-1.5 text-xs print:text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-600">One Unit</span>
                <span className="font-semibold">{data.luggage.oneUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Two Unit</span>
                <span className="font-semibold">{data.luggage.twoUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Three Unit</span>
                <span className="font-semibold">{data.luggage.threeUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Locker</span>
                <span className="font-semibold">{data.luggage.locker}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-purple-300">
                <span className="font-bold text-gray-800">Total Units</span>
                <span className="font-bold text-purple-700 text-sm print:text-[10px]">{totalUnits}</span>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
            <h2 className="text-xs print:text-[10px] font-bold text-gray-800 mb-2 uppercase tracking-wide flex items-center gap-1">
              <span className="w-1 h-4 print:h-3.5 bg-green-500 rounded-full"></span>
              Amount
            </h2>
            <div className="space-y-1.5 text-xs print:text-[10px]">
              <div className="flex justify-between">
                <span className="text-gray-600">One Unit</span>
                <span className="font-semibold">₹{data.amount.oneUnitAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Two Unit</span>
                <span className="font-semibold">₹{data.amount.twoUnitAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Three Unit</span>
                <span className="font-semibold">₹{data.amount.threeUnitAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Locker</span>
                <span className="font-semibold">₹{data.amount.lockerAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-green-400">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className="font-bold text-green-700 text-base print:text-[10px]">₹{data.amount.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs print:text-[10px] text-gray-600 pt-3 border-t border-gray-300">
            <p className="font-bold text-gray-800">Thank you for choosing us!</p>
            <p className="mt-1">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Print Button - Hidden on Print */}
        <div className="print:hidden px-4 pb-4">
          <button 
            onClick={handlePrint}
            className="w-full py-4 bg-linear-to-r from-red-600 to-amber-600 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Print Receipt
          </button>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body * { visibility: hidden; }
          .min-h-screen, .min-h-screen * { visibility: visible; }
          .min-h-screen { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 80mm; 
            margin: 0; 
            padding: 0; 
            background: white;
          }
          button { display: none !important; }
          .max-w-[80mm] { 
            width: 80mm !important; 
            max-width: 80mm !important; 
          }
        }
      `}</style>
    </div>
  );
}