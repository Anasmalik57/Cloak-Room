"use client"
import React, { useState, useEffect } from 'react';

const luggageTypes = [
  { label: 'One Unit', rate: 30, key: 'oneUnit' },
  { label: 'Two Unit', rate: 60, key: 'twoUnit' },
  { label: 'Three Unit', rate: 90, key: 'threeUnit' },
  { label: 'Locker', rate: 60, key: 'locker' },
];

const formatDateTime = (date) => {
  const pad = (num) => num.toString().padStart(2, '0');
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const generateToken = () => Math.floor(Math.random() * 9000000) + 1000000;

export default function CheckInForm() {
  const [formData, setFormData] = useState({
    checkInTime: '',
    tokenNo: '',
    passengerMobile: '',
    passengerName: '',
    pnrNumber: '',
    aadharNumber: '',
    luggage: {
      oneUnit: 0,
      twoUnit: 0,
      threeUnit: 0,
      locker: 0,
    }
  });

  useEffect(() => {
    const now = new Date();
    setFormData(prev => ({
      ...prev,
      checkInTime: formatDateTime(now),
      tokenNo: generateToken().toString(),
    }));
  }, []);

  const calculateTotal = () => {
    return luggageTypes.reduce((total, type) => {
      return total + (formData.luggage[type.key] * type.rate);
    }, 0);
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

  const handleUpdate = () => {
    console.log('Form Data:', formData);
    setTimeout(() => {
      alert('Check-in data updated successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-gray-800 to-slate-900 p-6 flex items-center justify-center flex-1 ml-64">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white mb-8 text-left border-b border-amber-400/20 pb-2">Check In</h1>
        {/* Form Grid */}
        <div className="space-y-4">
          {/* Row 1 - Check In Time & Token No */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Check In Time
              </label>
              <input
                type="text"
                value={formData.checkInTime}
                readOnly
                placeholder="Auto-generated"
                className="w-full px-4 py-3 bg-white/5 rounded-xl text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Token No
              </label>
              <input
                type="text"
                value={formData.tokenNo}
                readOnly
                placeholder="Auto-generated"
                className="w-full px-4 py-3 bg-white/5 rounded-xl text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
          </div>
          {/* Row 2 - Passenger Mobile & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Passenger Mobile
              </label>
              <input
                type="tel"
                value={formData.passengerMobile}
                onChange={(e) => handleInputChange('passengerMobile', e.target.value)}
                placeholder="Enter mobile number"
                className="w-full px-4 py-3 bg-white/5 rounded-xl text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Passenger Name
              </label>
              <input
                type="text"
                value={formData.passengerName}
                onChange={(e) => handleInputChange('passengerName', e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-3 bg-white/5 rounded-xl text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
          </div>
          {/* Row 3 - PNR & Aadhar Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                PNR Number
              </label>
              <input
                type="text"
                value={formData.pnrNumber}
                onChange={(e) => handleInputChange('pnrNumber', e.target.value)}
                placeholder="Enter PNR"
                className="w-full px-4 py-3 bg-white/5 rounded-xl text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Aadhar Number
              </label>
              <input
                type="text"
                value={formData.aadharNumber}
                onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                placeholder="Enter Aadhar (12 digits)"
                className="w-full px-4 py-3 bg-white/5 rounded-xl text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
          </div>
          {/* Luggage Type Section */}
          <div className="pt-2">
            <h2 className="text-white text-lg font-bold mb-4">Luggage Details</h2>
           
            {/* Luggage Type Headers & Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              {luggageTypes.map((type) => (
                <div key={type.key} className="space-y-2">
                  <label className="block text-gray-300 text-xs font-semibold">
                    {type.label}
                  </label>
                  <input
                    type="text"
                    min="0"
                    value={formData.luggage[type.key]}
                    onChange={(e) => handleLuggageChange(type.key, e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-white/5 rounded-lg text-white placeholder-gray-400 font-bold text-center focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10 text-sm"
                  />
                </div>
              ))}
              <div className="space-y-2">
                <label className="block text-gray-300 text-xs font-semibold">
                  Total Units
                </label>
                <input
                  type="text"
                  value={getTotalUnits()}
                  readOnly
                  className="w-full px-3 py-2 bg-white/5 rounded-lg text-white font-bold text-center focus:outline-none border border-white/10 text-sm"
                />
              </div>
            </div>
            {/* Rate Section */}
            <div className="mb-4">
              <h3 className="text-gray-300 text-sm font-semibold mb-2">Rate (₹)</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {luggageTypes.map((type) => (
                  <input
                    key={`rate-${type.key}`}
                    type="text"
                    value={type.rate}
                    readOnly
                    className="w-full px-3 py-2 bg-white/5 rounded-lg text-white font-bold text-center focus:outline-none border border-white/10 text-sm"
                  />
                ))}
                <div></div>
              </div>
            </div>
            {/* Amount Section */}
            <div>
              <h3 className="text-gray-300 text-sm font-semibold mb-2">Amount (₹)</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {luggageTypes.map((type) => (
                  <input
                    key={`amount-${type.key}`}
                    type="text"
                    value={(formData.luggage[type.key] * type.rate).toFixed(0)}
                    readOnly
                    className="w-full px-3 py-2 bg-white/5 rounded-lg text-white font-bold text-center focus:outline-none border border-white/10 text-sm"
                  />
                ))}
                <input
                  type="text"
                  value={calculateTotal().toFixed(0)}
                  readOnly
                  className="w-full px-3 py-2 bg-orange-500/20 rounded-lg text-orange-300 font-bold text-center focus:outline-none border border-orange-500/30 text-sm"
                />
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-2">
            <button className="px-6 py-3 cursor-pointer bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
              Cancel
            </button>
            <button 
              onClick={handleUpdate}
              className="px-6 py-3 cursor-pointer bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}