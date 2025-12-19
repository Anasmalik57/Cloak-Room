"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { API_BASE } from '@/lib/api';
import Barcode from 'react-barcode';

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

export default function CheckinReport() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCheckin = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${API_BASE}/checkins/token/${token}`);
        if (!response.ok) {
          throw new Error('Checkin not found');
        }
        const checkin = await response.json();
        if (checkin.status !== 'checkedIn') {
          throw new Error('This is not a checked in record');
        }
        setData(checkin);
      } catch (err) {
        console.error('Error fetching checkin:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckin();
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

  const totalUnits = Object.values(data.luggage).reduce((sum, val) => sum + val, 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 py-4 px-3 flex items-start justify-center print:items-start print:p-0">
      <div className="w-full max-w-[80mm] bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-800/20 print:shadow-none print:rounded-none  print:max-w-[80mm] print:w-[80mm]">
        
        {/* Header */}
        <div className="bg-linear-to-r from-orange-500 via-amber-500 to-orange-500 text-white px-4 py-2.5 print:bg-orange-600">
          <h1 className="text-center font-bold text-xs tracking-widest">CLOAK ROOM CHECK-IN RECEIPT</h1>
          <p className="text-center text-[10px] opacity-95 mt-0.5">Token: {data.tokenNo}</p>
        </div>

        {/* Content - Compact Layout */}
        <div className="p-3 print:p-2">
          
          {/* Passenger Info */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-lg p-2 border border-gray-200 mb-2">
            <h2 className="text-[10px] font-bold text-gray-800 mb-1 uppercase tracking-wide flex items-center gap-1">
              <span className="w-1 h-3 bg-orange-500 rounded-full"></span>
              Passenger
            </h2>
            <div className="space-y-0.5 text-[10px]">
              <div className="flex justify-between gap-2">
                <span className="text-gray-500 font-medium">Name</span>
                <span className="font-semibold text-gray-800 text-right">{data.passengerName}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500 font-medium">Mobile</span>
                <span className="font-semibold text-gray-800">+91 {data.passengerMobile}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500 font-medium">PNR</span>
                <span className="font-semibold text-gray-800">{data.pnrNumber}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500 font-medium">Aadhaar</span>
                <span className="font-semibold text-gray-800">{data.aadharNumber}</span>
              </div>
            </div>
          </div>

          {/* Timing Info */}
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-2 border border-blue-200 mb-2">
            <h2 className="text-[10px] font-bold text-gray-800 mb-1 uppercase tracking-wide flex items-center gap-1">
              <span className="w-1 h-3 bg-blue-500 rounded-full"></span>
              Timing
            </h2>
            <div className="space-y-0.5 text-[9px]">
              <div>
                <span className="text-gray-600 block mb-0.5">Check-in</span>
                <span className="font-semibold text-gray-800 block">{formatDateTime(data.checkInTime)}</span>
              </div>
            </div>
          </div>

          {/* Luggage */}
          <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-2 border border-purple-200 mb-2">
            <h2 className="text-[10px] font-bold text-gray-800 mb-1 uppercase tracking-wide flex items-center gap-1">
              <span className="w-1 h-3 bg-purple-500 rounded-full"></span>
              Luggage
            </h2>
            <div className="space-y-0.5 text-[10px]">
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
              <div className="flex justify-between pt-1 border-t border-purple-300 mt-1">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-purple-700">{totalUnits}</span>
              </div>
            </div>
          </div>

          {/* Barcode Section */}
          <div className="flex justify-center mt-3 print:mt-2">
            <div className="bg-white p-2 border border-gray-300 rounded">
              <Barcode
                value={data.tokenNo}
                width={1.5}
                height={45}
                fontSize={10}
                margin={0}
                displayValue={true}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-[9px] text-gray-500 pt-2 mt-2 border-t border-gray-200">
            <p className="font-semibold text-gray-700">Thank you for choosing us!</p>
            <p className="mt-0.5">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Print Button */}
        <div className="print:hidden px-3 pb-3">
          <button 
            onClick={handlePrint}
            className="w-full py-4 cursor-pointer bg-linear-to-r from-red-600 to-amber-600 text-white rounded-lg font-semibold text-sm hover:rose-green-700 hover:to-amber-700 transition-all duration-300 ease-in shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Print Receipt
          </button>
        </div>
      </div>

      {/* <style jsx global>{`
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body * { visibility: hidden; }
          .min-h-screen, .min-h-screen * { visibility: visible; }
          .min-h-screen { position: absolute; left: 0; top: 0; width: 80mm; margin: 0; padding: 0; }
          button { display: none !important; }
          .max-w-[80mm] { width: 80mm !important; max-width: 80mm !important; }
        }
      `}</style> */}
    </div>
  );
}