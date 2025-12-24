"use client"
import { API_BASE } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { showToast } from 'nextjs-toast-notify';
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
    },
    amount: { // Added for completeness, though schema has it as nested
      oneUnitAmount: 0,
      twoUnitAmount: 0,
      threeUnitAmount: 0,
      lockerAmount: 0,
    },
    status: 'checkedIn' // Default as per schema
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    const formattedTime = formatDateTime(now);
    const token = generateToken().toString();
    setFormData(prev => ({
      ...prev,
      checkInTime: formattedTime,
      tokenNo: token,
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
    const rate = luggageTypes.find(type => type.key === key)?.rate || 0;
    setFormData(prev => ({
      ...prev,
      luggage: { ...prev.luggage, [key]: numValue },
      amount: {
        ...prev.amount,
        [`${key}Amount`]: numValue * rate
      }
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value.toUpperCase() })); // Uppercase for PNR as per schema
  };

  const handleTokenChange = (value) => {
    setFormData(prev => ({ ...prev, tokenNo: value }));
  };

  const handleSubmit = async () => {
    if (!formData.passengerMobile || !formData.passengerName || !formData.pnrNumber || !formData.aadharNumber || !formData.tokenNo) {
      setError('Please fill all required fields');
      return;
    }
    if (!/^[0-9]{10}$/.test(formData.passengerMobile)) {
      setError('Mobile must be 10 digits');
      return;
    }
    if (!/^[0-9]{12}$/.test(formData.aadharNumber)) {
      setError('Aadhaar must be 12 digits');
      return;
    }
    if (getTotalUnits() === 0) {
      setError('At least one luggage unit required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare payload: omit checkInTime as backend defaults to Date.now for accuracy
      const payload = {
        tokenNo: formData.tokenNo.trim(),
        passengerMobile: formData.passengerMobile.trim(),
        passengerName: formData.passengerName.trim(),
        pnrNumber: formData.pnrNumber.trim(),
        aadharNumber: formData.aadharNumber.trim(),
        luggage: formData.luggage,
        amount: formData.amount,
        status: formData.status
      };

      const response = await fetch(`${API_BASE}/checkins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to save check-in');
      }

      const savedData = await response.json();
      // console.log('Check-in saved successfully:', savedData);
      // alert('Check-in data saved successfully!');
      showToast.success("Check-in data saved successfully!", {
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceInDown",
        icon: '',
        sound: true,
      });
      router.push(`/checkin-reciepts/${savedData.tokenNo}`);
      
      // Optional: Reset form or update token for next
      const newToken = generateToken().toString();
      setFormData(prev => ({
        ...prev,
        tokenNo: newToken,
        passengerMobile: '',
        passengerName: '',
        pnrNumber: '',
        aadharNumber: '',
        luggage: { oneUnit: 0, twoUnit: 0, threeUnit: 0, locker: 0 },
        amount: { oneUnitAmount: 0, twoUnitAmount: 0, threeUnitAmount: 0, lockerAmount: 0 }
      }));
      setFormData(prev => ({ ...prev, checkInTime: formatDateTime(new Date()) })); // Update time display
    } catch (err) {
      console.error('Error saving check-in:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-gray-800 to-slate-900 p-3 sm:p-4 md:p-6 flex items-center justify-center flex-1">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-white/20">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-left border-b border-amber-400/20 pb-2">Check In</h1>
        
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-xs sm:text-sm">
            {error}
          </div>
        )}
        
        {/* Form Grid */}
        <div className="space-y-4">
          {/* Row 1 - Check In Time & Token No */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-2">
                Check In Time
              </label>
              <input
                type="text"
                value={formData.checkInTime}
                readOnly
                placeholder="Auto-generated"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 rounded-xl text-white text-sm sm:text-base placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-2">
                Token No
              </label>
              <input
                type="text"
                value={formData.tokenNo}
                onChange={(e) => handleTokenChange(e.target.value)}
                placeholder="Enter or auto-generated"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 rounded-xl text-white text-sm sm:text-base placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
          </div>
          
          {/* Row 2 - Passenger Mobile & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-2">
                Passenger Mobile
              </label>
              <input
                type="tel"
                value={formData.passengerMobile}
                onChange={(e) => handleInputChange('passengerMobile', e.target.value)}
                placeholder="Enter mobile number"
                maxLength={10}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 rounded-xl text-white text-sm sm:text-base placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-2">
                Passenger Name
              </label>
              <input
                type="text"
                value={formData.passengerName}
                onChange={(e) => handleInputChange('passengerName', e.target.value)}
                placeholder="Enter full name"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 rounded-xl text-white text-sm sm:text-base placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
          </div>
          
          {/* Row 3 - PNR & Aadhar Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-2">
                PNR Number
              </label>
              <input
                type="text"
                value={formData.pnrNumber}
                onChange={(e) => handleInputChange('pnrNumber', e.target.value)}
                placeholder="Enter PNR"
                maxLength={10}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 rounded-xl text-white text-sm sm:text-base placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-2">
                Aadhar Number
              </label>
              <input
                type="text"
                value={formData.aadharNumber}
                onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                placeholder="Enter Aadhar (12 digits)"
                maxLength={12}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 rounded-xl text-white text-sm sm:text-base placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
          </div>
          
          {/* Luggage Type Section */}
          <div className="pt-2">
            <h2 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Luggage Details</h2>
           
            {/* Luggage Type Headers & Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-3 sm:mb-4">
              {luggageTypes.map((type) => (
                <div key={type.key} className="space-y-2">
                  <label className="block text-gray-300 text-xs font-semibold">
                    {type.label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.luggage[type.key]}
                    onChange={(e) => handleLuggageChange(type.key, e.target.value)}
                    placeholder="0"
                    className="w-full px-2 sm:px-3 py-2 bg-white/5 rounded-lg text-white placeholder-gray-400 font-bold text-center focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10 text-xs sm:text-sm"
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
                  className="w-full px-2 sm:px-3 py-2 bg-white/5 rounded-lg text-white font-bold text-center focus:outline-none border border-white/10 text-xs sm:text-sm"
                />
              </div>
            </div>
            
            {/* Rate Section */}
            <div className="mb-3 sm:mb-4">
              <h3 className="text-gray-300 text-xs sm:text-sm font-semibold mb-2">Rate (₹)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {luggageTypes.map((type) => (
                  <input
                    key={`rate-${type.key}`}
                    type="text"
                    value={type.rate}
                    readOnly
                    className="w-full px-2 sm:px-3 py-2 bg-white/5 rounded-lg text-white font-bold text-center focus:outline-none border border-white/10 text-xs sm:text-sm"
                  />
                ))}
                <div></div>
              </div>
            </div>
            
            {/* Amount Section */}
            <div>
              <h3 className="text-gray-300 text-xs sm:text-sm font-semibold mb-2">Amount (₹)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {luggageTypes.map((type) => (
                  <input
                    key={`amount-${type.key}`}
                    type="text"
                    value={(formData.luggage[type.key] * type.rate).toFixed(0)}
                    readOnly
                    className="w-full px-2 sm:px-3 py-2 bg-white/5 rounded-lg text-white font-bold text-center focus:outline-none border border-white/10 text-xs sm:text-sm"
                  />
                ))}
                <input
                  type="text"
                  value={calculateTotal().toFixed(0)}
                  readOnly
                  className="w-full px-2 sm:px-3 py-2 bg-orange-500/20 rounded-lg text-orange-300 font-bold text-center focus:outline-none border border-orange-500/30 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-2">
            <button 
              type="button"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 cursor-pointer bg-white/10 border border-white/20 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-white/20 transition-all"
              onClick={() => {
                // Simple reset without submit
                const newToken = generateToken().toString();
                setFormData(prev => ({
                  ...prev,
                  tokenNo: newToken,
                  passengerMobile: '',
                  passengerName: '',
                  pnrNumber: '',
                  aadharNumber: '',
                  luggage: { oneUnit: 0, twoUnit: 0, threeUnit: 0, locker: 0 },
                  amount: { oneUnitAmount: 0, twoUnitAmount: 0, threeUnitAmount: 0, lockerAmount: 0 }
                }));
                setFormData(prev => ({ ...prev, checkInTime: formatDateTime(new Date()) }));
                setError('');
              }}
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 cursor-pointer bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? 'Saving...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}