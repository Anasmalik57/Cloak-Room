"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';

const luggageTypes = [
  { label: 'One Unit', rate: 30, key: 'oneUnit' },
  { label: 'Two Unit', rate: 60, key: 'twoUnit' },
  { label: 'Three Unit', rate: 90, key: 'threeUnit' },
  { label: 'Locker', rate: 60, key: 'locker' },
];

const formatDateTime = (date) => {
  const d = new Date(date);
  const pad = (num) => num.toString().padStart(2, '0');
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};


export default function CheckInReport() {
  const { token } = useParams();
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
    amount: {
      oneUnitAmount: 0,
      twoUnitAmount: 0,
      threeUnitAmount: 0,
      lockerAmount: 0,
      totalAmount: 0,
    },
    status: 'checkedIn',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const fetchCheckin = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${API_BASE}/checkins/token/${token}`);
        if (!response.ok) {
          throw new Error('Check-in not found');
        }
        const checkin = await response.json();
        
        // Format checkInTime
        const formattedTime = formatDateTime(checkin.checkInTime);
        
        setFormData({
          checkInTime: formattedTime,
          tokenNo: checkin.tokenNo,
          passengerMobile: checkin.passengerMobile,
          passengerName: checkin.passengerName,
          pnrNumber: checkin.pnrNumber,
          aadharNumber: checkin.aadharNumber,
          luggage: checkin.luggage,
          amount: checkin.amount,
          status: checkin.status,
        });
      } catch (err) {
        console.error('Error fetching check-in:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckin();
  }, [token]);

  const calculateTotalAmount = (amounts) => {
    return (amounts.oneUnitAmount || 0) + 
           (amounts.twoUnitAmount || 0) + 
           (amounts.threeUnitAmount || 0) + 
           (amounts.lockerAmount || 0);
  };

  const getTotalUnits = () => {
    return Object.values(formData.luggage).reduce((sum, val) => sum + val, 0);
  };

  const handleLuggageChange = (key, value) => {
    const numValue = parseInt(value) || 0;
    const rate = luggageTypes.find(type => type.key === key)?.rate || 0;
    setFormData(prev => {
      const newLuggage = { ...prev.luggage, [key]: numValue };
      const newAmount = {
        ...prev.amount,
        [`${key}Amount`]: numValue * rate,
      };
      newAmount.totalAmount = calculateTotalAmount(newAmount);
      return {
        ...prev,
        luggage: newLuggage,
        amount: newAmount,
      };
    });
  };

  const handleAmountChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => {
      const newAmount = { 
        ...prev.amount, 
        [field]: numValue 
      };
      newAmount.totalAmount = calculateTotalAmount(newAmount);
      return {
        ...prev,
        amount: newAmount,
      };
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleUpdate = async () => {
    if (!formData.tokenNo) {
      setError('Token required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        passengerMobile: formData.passengerMobile,
        passengerName: formData.passengerName,
        pnrNumber: formData.pnrNumber,
        aadharNumber: formData.aadharNumber,
        luggage: formData.luggage,
        amount: formData.amount,
        status: formData.status,
      };

      const response = await fetch(`${API_BASE}/checkins/token/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update');
      }

      const updated = await response.json();
      console.log('Updated successfully:', updated);
      alert('Check-in updated successfully!');
      router.push('/admin/checkout-reports');
    } catch (err) {
      console.error('Error updating:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 flex items-center justify-center flex-1 ml-64">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-6 flex items-center justify-center flex-1 ml-64">
      <div className="w-full max-w-5xl bg-white backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-left border-b border-gray-200 pb-2">Edit Report</h1>
        
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form Grid */}
        <div className="space-y-4">
          {/* Row 1 - Check In Time & Token No */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Check In Time
              </label>
              <input
                type="text"
                value={formData.checkInTime}
                readOnly
                placeholder="Auto-generated"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Token No
              </label>
              <input
                type="text"
                value={formData.tokenNo}
                readOnly
                placeholder="From URL"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
              />
            </div>
          </div>
          {/* Row 2 - Passenger Mobile & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Passenger Mobile
              </label>
              <input
                type="tel"
                value={formData.passengerMobile}
                onChange={(e) => handleInputChange('passengerMobile', e.target.value)}
                placeholder="Enter mobile number"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Passenger Name
              </label>
              <input
                type="text"
                value={formData.passengerName}
                onChange={(e) => handleInputChange('passengerName', e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
              />
            </div>
          </div>
          {/* Row 3 - PNR & Aadhar Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                PNR Number
              </label>
              <input
                type="text"
                value={formData.pnrNumber}
                onChange={(e) => handleInputChange('pnrNumber', e.target.value.toUpperCase())}
                placeholder="Enter PNR"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Aadhar Number
              </label>
              <input
                type="text"
                value={formData.aadharNumber}
                onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                placeholder="Enter Aadhar (12 digits)"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
              />
            </div>
          </div>
          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
              >
                <option value="checkedIn">Checked In</option>
                <option value="checkedOut">Checked Out</option>
              </select>
            </div>
          </div>
          {/* Luggage Type Section */}
          <div className="pt-2">
            <h2 className="text-gray-800 text-lg font-bold mb-4">Luggage Details</h2>
           
            {/* Luggage Type Headers & Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              {luggageTypes.map((type) => (
                <div key={type.key} className="space-y-2">
                  <label className="block text-gray-700 text-xs font-semibold">
                    {type.label}
                  </label>
                  <input
                    type="text"
                    min="0"
                    value={formData.luggage[type.key]}
                    onChange={(e) => handleLuggageChange(type.key, e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-800 placeholder-gray-500 font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200 text-sm"
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
              <h3 className="text-gray-700 text-sm font-semibold mb-2">Amount (₹)</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {luggageTypes.map((type) => (
                  <input
                    key={`amount-${type.key}`}
                    type="text"
                    min="0"
                    step="0.01"
                    value={formData.amount[`${type.key}Amount`]}
                    onChange={(e) => handleAmountChange(`${type.key}Amount`, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 rounded-lg text-gray-800 font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200 text-sm"
                  />
                ))}
                <input
                  type="text"
                  value={formData.amount.totalAmount.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 bg-blue-50 rounded-lg text-blue-600 font-bold text-center focus:outline-none border border-blue-200 text-sm"
                />
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-2">
            <button 
              className="px-6 py-3 cursor-pointer bg-gray-200 border border-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              onClick={() => window.history.back()}
            >
              Back
            </button>
            <button 
              onClick={handleUpdate}
              disabled={saving}
              className="px-6 py-3 cursor-pointer bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}