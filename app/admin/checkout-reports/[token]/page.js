"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Search } from 'lucide-react';

const luggageTypes = [
  { label: 'One Unit', rate: 50, key: 'oneUnit' },
  { label: 'Two Unit', rate: 150, key: 'twoUnit' },
  { label: 'Three Unit', rate: 100, key: 'threeUnit' },
  { label: 'Locker', rate: 0, key: 'locker' },
];

const demoRecords = [
  {
    tokenNo: '1245327',
    passengerName: 'Vikrant Verma',
    passengerMobile: '1234567890',
    pnrNumber: '123',
    checkInTime: '12/02/2025 11:16:12',
    luggage: {
      oneUnit: 2,
      twoUnit: 1,
      threeUnit: 1,
      locker: 0,
    }
  },
  {
    tokenNo: '9876543',
    passengerName: 'Priya Sharma',
    passengerMobile: '0987654321',
    pnrNumber: '456',
    checkInTime: '12/15/2025 09:30:00',
    luggage: {
      oneUnit: 1,
      twoUnit: 0,
      threeUnit: 2,
      locker: 1,
    }
  },
  {
    tokenNo: '5556667',
    passengerName: 'Rahul Kumar',
    passengerMobile: '1122334455',
    pnrNumber: '789',
    checkInTime: '12/10/2025 14:45:22',
    luggage: {
      oneUnit: 0,
      twoUnit: 3,
      threeUnit: 0,
      locker: 0,
    }
  }
];

const formatDateTime = (date) => {
  const pad = (num) => num.toString().padStart(2, '0');
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const generateToken = () => Math.floor(Math.random() * 9000000) + 1000000;

export default function CheckOutEditPage() {
  const params = useParams();
  const tokenNo = params.token;

  const [formData, setFormData] = useState({
    checkOutTime: '',
    tokenNo: '',
    passengerName: '',
    passengerMobile: '',
    pnrNumber: '',
    checkInTime: '',
    luggage: {
      oneUnit: 0,
      twoUnit: 0,
      threeUnit: 0,
      locker: 0,
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const initialData = {
      checkOutTime: formatDateTime(now),
      tokenNo: tokenNo || generateToken().toString(),
      passengerName: '',
      passengerMobile: '',
      pnrNumber: '',
      checkInTime: '',
      luggage: {
        oneUnit: 0,
        twoUnit: 0,
        threeUnit: 0,
        locker: 0,
      }
    };

    // Fetch matching record by token
    const matchedRecord = demoRecords.find(record => record.tokenNo === tokenNo);
    if (matchedRecord) {
      setFormData({
        ...initialData,
        tokenNo: matchedRecord.tokenNo,
        passengerName: matchedRecord.passengerName,
        passengerMobile: matchedRecord.passengerMobile,
        pnrNumber: matchedRecord.pnrNumber,
        checkInTime: matchedRecord.checkInTime,
        luggage: { ...matchedRecord.luggage }
      });
    } else {
      setFormData(initialData);
    }
    setIsLoading(false);
  }, [tokenNo]);

  useEffect(() => {
    if (searchQuery.trim() === '') return;

    const matchedRecord = demoRecords.find(record =>
      record.tokenNo.includes(searchQuery) ||
      record.pnrNumber.includes(searchQuery) ||
      record.passengerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedRecord) {
      setFormData(prev => ({
        ...prev,
        tokenNo: matchedRecord.tokenNo,
        passengerName: matchedRecord.passengerName,
        passengerMobile: matchedRecord.passengerMobile,
        pnrNumber: matchedRecord.pnrNumber,
        checkInTime: matchedRecord.checkInTime,
        luggage: { ...matchedRecord.luggage }
      }));
    }
  }, [searchQuery]);

  const calculateBaseTotal = () => {
    return luggageTypes.reduce((total, type) => {
      return total + (formData.luggage[type.key] * type.rate);
    }, 0);
  };

  const calculateHours = () => {
    if (!formData.checkInTime || !formData.checkOutTime) return 0;
    const inTime = new Date(formData.checkInTime);
    const outTime = new Date(formData.checkOutTime);
    const diffMs = outTime.getTime() - inTime.getTime();
    return diffMs > 0 ? diffMs / (1000 * 60 * 60) : 0;
  };

  const getMultiplier = () => {
    const hours = calculateHours();
    return hours <= 24 ? 1 : 2;
  };

  const calculateTotal = () => {
    const base = calculateBaseTotal();
    const multiplier = getMultiplier();
    return base * multiplier;
  };

  const getTotalUnits = () => {
    return Object.values(formData.luggage).reduce((sum, val) => sum + val, 0);
  };

  const handleLuggageChange = (key, value) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      luggage: { ...prev.luggage, [key]: numValue }
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
    // Optionally redirect back or reset
  };

  const handleUpdate = () => {
    console.log('Updated Data:', formData);
    // Optionally save to backend or redirect
  };

  const hours = calculateHours();
  const multiplier = getMultiplier();

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center ml-64">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center flex-1 ml-64">
      <div className="w-full max-w-5xl bg-white backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200">
        {/* Header with Search */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Check Out - {formData.tokenNo}</h1>
          
          {/* Search Bar */}
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Token, PNR, or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-full text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
            />
          </div>
        </div>

        {/* Form Grid */}
        <div className="space-y-6">
          {/* Row 1 - Check Out Time & Token No */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Check Out Time
              </label>
              <input
                type="text"
                value={formData.checkOutTime}
                readOnly
                placeholder="Auto-generated"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Token No
              </label>
              <input
                type="text"
                value={formData.tokenNo}
                onChange={(e) => handleInputChange('tokenNo', e.target.value)}
                placeholder="Enter Token No"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
              />
            </div>
          </div>

          {/* Row 2 - Passenger Name & Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Passenger Name
              </label>
              <input
                type="text"
                value={formData.passengerName}
                onChange={(e) => handleInputChange('passengerName', e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Passenger Mobile
              </label>
              <input
                type="tel"
                value={formData.passengerMobile}
                onChange={(e) => handleInputChange('passengerMobile', e.target.value)}
                placeholder="Enter mobile number"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
              />
            </div>
          </div>

          {/* Row 3 - PNR Number & Check In Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                PNR Number
              </label>
              <input
                type="text"
                value={formData.pnrNumber}
                onChange={(e) => handleInputChange('pnrNumber', e.target.value)}
                placeholder="Enter PNR"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Check In Time
              </label>
              <input
                type="text"
                value={formData.checkInTime}
                onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                placeholder="MM/DD/YYYY HH:MM:SS"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
              />
            </div>
          </div>

          {/* Luggage Type Section */}
          <div className="pt-4">
            <h2 className="text-gray-800 text-lg font-bold mb-4">Luggage Details</h2>
           
            {/* Luggage Type Headers & Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              {luggageTypes.map((type) => (
                <div key={type.key} className="space-y-2">
                  <label className="block text-gray-700 text-xs font-semibold">
                    {type.label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.luggage[type.key]}
                    onChange={(e) => handleLuggageChange(type.key, e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-800 placeholder-gray-400 font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200 text-sm"
                  />
                </div>
              ))}
              <div className="space-y-2">
                <label className="block text-gray-700 text-xs font-semibold">
                  Total Units
                </label>
                <input
                  type="text"
                  value={getTotalUnits()}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-800 font-bold text-center focus:outline-none border border-gray-200 text-sm"
                />
              </div>
            </div>
            {/* Rate Section */}
            <div className="mb-4">
              <h3 className="text-gray-700 text-sm font-semibold mb-2">Rate (₹)</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {luggageTypes.map((type) => (
                  <input
                    key={`rate-${type.key}`}
                    type="text"
                    value={type.rate}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-800 font-bold text-center focus:outline-none border border-gray-200 text-sm"
                  />
                ))}
                <div></div>
              </div>
            </div>
            {/* Amount Section */}
            <div>
              <h3 className="text-gray-700 text-sm font-semibold mb-2">Amount (₹) {multiplier > 1 && `(x${multiplier})`}</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {luggageTypes.map((type) => (
                  <input
                    key={`amount-${type.key}`}
                    type="text"
                    value={(formData.luggage[type.key] * type.rate * multiplier).toFixed(0)}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-800 font-bold text-center focus:outline-none border border-gray-200 text-sm"
                  />
                ))}
                <input
                  type="text"
                  value={calculateTotal().toFixed(0)}
                  readOnly
                  className="w-full px-3 py-2 bg-blue-100 rounded-lg text-blue-800 font-bold text-center focus:outline-none border border-blue-300 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
            <button 
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-100 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpdate}
              className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Update
            </button>
          </div>

          {/* Footer Hint */}
          {hours > 0 && (
            <div className="text-center pt-4">
              <p className="text-gray-600 text-sm">Total duration: {hours.toFixed(2)} hours {multiplier > 1 && '(Charged as 2 days)'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}