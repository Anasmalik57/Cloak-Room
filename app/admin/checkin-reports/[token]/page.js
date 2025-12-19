"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';
import { showToast } from 'nextjs-toast-notify';

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
  const router = useRouter();

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

      // alert('Check-in updated successfully!');
      showToast.success("Check-in updated successfully!", {
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceInDown",
        icon: '',
        sound: true,
      });
      router.push('/admin/checkin-reports');
    } catch (err) {
      console.error('Error updating:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Header */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
              Edit Check-in Report
            </h1>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check In Time
                  </label>
                  <input
                    type="text"
                    value={formData.checkInTime}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token No
                  </label>
                  <input
                    type="text"
                    value={formData.tokenNo}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passenger Mobile
                  </label>
                  <input
                    type="tel"
                    value={formData.passengerMobile}
                    onChange={(e) => handleInputChange('passengerMobile', e.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passenger Name
                  </label>
                  <input
                    type="text"
                    value={formData.passengerName}
                    onChange={(e) => handleInputChange('passengerName', e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PNR Number
                  </label>
                  <input
                    type="text"
                    value={formData.pnrNumber}
                    onChange={(e) => handleInputChange('pnrNumber', e.target.value.toUpperCase())}
                    placeholder="Enter PNR"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Number
                  </label>
                  <input
                    type="text"
                    value={formData.aadharNumber}
                    onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                    placeholder="Enter Aadhar (12 digits)"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="checkedIn">Checked In</option>
                    <option value="checkedOut">Checked Out</option>
                  </select>
                </div>
              </div>

              {/* Luggage Section */}
              <div className="pt-6 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Luggage Details</h2>

                {/* Responsive Luggage Table */}
                <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-lg border border-gray-200">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Type
                          </th>
                          {luggageTypes.map((type) => (
                            <th key={type.key} className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              {type.label}
                            </th>
                          ))}
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Total Units
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            Units
                          </td>
                          {luggageTypes.map((type) => (
                            <td key={type.key} className="px-4 py-4">
                              <input
                                type="number"
                                min="0"
                                value={formData.luggage[type.key]}
                                onChange={(e) => handleLuggageChange(type.key, e.target.value)}
                                className="w-full md:px-3 py-2 text-center border rota45 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                              />
                            </td>
                          ))}
                          <td className="px-4 py-4 text-center font-bold text-gray-900">
                            {getTotalUnits()}
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 whitespace-nowrap">
                            Rate (₹)
                          </td>
                          {luggageTypes.map((type) => (
                            <td key={`rate-${type.key}`} className="px-4 py-3 text-center font-semibold text-gray-800">
                              {type.rate}
                            </td>
                          ))}
                          <td className="px-4 py-3"></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            Amount (₹)
                          </td>
                          {luggageTypes.map((type) => (
                            <td key={`amount-${type.key}`} className="px-4 py-4">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.amount[`${type.key}Amount`]}
                                onChange={(e) => handleAmountChange(`${type.key}Amount`, e.target.value)}
                                className="w-full md:px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                              />
                            </td>
                          ))}
                          <td className="px-4 py-4 text-center font-bold text-blue-600 bg-blue-50 rounded-lg">
                            {formData.amount.totalAmount.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row-reverse gap-4 pt-8 border-t border-gray-200">
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="w-full sm:w-auto px-8 py-3.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Update'}
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}