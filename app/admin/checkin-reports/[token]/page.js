"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Search } from 'lucide-react';

const luggageTypes = [
  { label: 'One Unit', rate: 30, key: 'oneUnit' },
  { label: 'Two Unit', rate: 60, key: 'twoUnit' },
  { label: 'Three Unit', rate: 90, key: 'threeUnit' },
  { label: 'Locker', rate: 60, key: 'locker' },
];

const demoRecords = [
  {
    pnr: "10234",
    tokenNo: '1245327',
    passengerName: 'Rahul Sharma',
    passengerMobile: '9876543210',
    pnrNumber: 'PNR10234',
    aadharNumber: '123456789012',
    checkInTime: '01/05/2025 10:30:00',
    luggage: {
      oneUnit: 2,
      twoUnit: 1,
      threeUnit: 0,
      locker: 0,
    }
  },
  {
    pnr: "20456",
    tokenNo: '9876543',
    passengerName: 'Neha Verma',
    passengerMobile: '9123456789',
    pnrNumber: 'PNR20456',
    aadharNumber: '987654321098',
    checkInTime: '01/06/2025 09:15:45',
    luggage: {
      oneUnit: 1,
      twoUnit: 0,
      threeUnit: 2,
      locker: 1,
    }
  },
  {
    pnr: "30987",
    tokenNo: '5556667',
    passengerName: 'Amit Patel',
    passengerMobile: '9988776655',
    pnrNumber: 'PNR30987',
    aadharNumber: '456789123456',
    checkInTime: '01/07/2025 14:20:30',
    luggage: {
      oneUnit: 0,
      twoUnit: 3,
      threeUnit: 1,
      locker: 0,
    }
  },
  {
    pnr: "45678",
    tokenNo: '1122334',
    passengerName: 'Pooja Singh',
    passengerMobile: '9012345678',
    pnrNumber: 'PNR45678',
    aadharNumber: '789123456789',
    checkInTime: '01/08/2025 08:45:12',
    luggage: {
      oneUnit: 3,
      twoUnit: 0,
      threeUnit: 0,
      locker: 2,
    }
  },
  {
    pnr: "56789",
    tokenNo: '4455667',
    passengerName: 'Karan Mehta',
    passengerMobile: '8899776655',
    pnrNumber: 'PNR56789',
    aadharNumber: '321654987012',
    checkInTime: '01/09/2025 11:10:22',
    luggage: {
      oneUnit: 1,
      twoUnit: 2,
      threeUnit: 1,
      locker: 0,
    }
  },
  {
    pnr: "67890",
    tokenNo: '7788990',
    passengerName: 'Sneha Iyer',
    passengerMobile: '9345678901',
    pnrNumber: 'PNR67890',
    aadharNumber: '654987321098',
    checkInTime: '01/10/2025 07:55:00',
    luggage: {
      oneUnit: 0,
      twoUnit: 1,
      threeUnit: 3,
      locker: 1,
    }
  },
  {
    pnr: "78901",
    tokenNo: '3344556',
    passengerName: 'Vikas Kumar',
    passengerMobile: '9567890123',
    pnrNumber: 'PNR78901',
    aadharNumber: '012345678901',
    checkInTime: '01/11/2025 13:40:15',
    luggage: {
      oneUnit: 2,
      twoUnit: 0,
      threeUnit: 2,
      locker: 0,
    }
  },
  {
    pnr: "89012",
    tokenNo: '6677889',
    passengerName: 'Anjali Rao',
    passengerMobile: '9789012345',
    pnrNumber: 'PNR89012',
    aadharNumber: '345678901234',
    checkInTime: '01/12/2025 16:25:50',
    luggage: {
      oneUnit: 4,
      twoUnit: 1,
      threeUnit: 0,
      locker: 0,
    }
  },
  {
    pnr: "90123",
    tokenNo: '9900112',
    passengerName: 'Rohit Malhotra',
    passengerMobile: '9900123456',
    pnrNumber: 'PNR90123',
    aadharNumber: '678901234567',
    checkInTime: '01/13/2025 12:00:00',
    luggage: {
      oneUnit: 0,
      twoUnit: 2,
      threeUnit: 0,
      locker: 3,
    }
  },
];

export default function CheckInEditPage() {
  const params = useParams();
  const pnr = params.pnr;

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

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch matching record by pnr
    const matchedRecord = demoRecords.find(record => record.pnr === pnr);
    if (matchedRecord) {
      setFormData({
        checkInTime: matchedRecord.checkInTime,
        tokenNo: matchedRecord.tokenNo,
        passengerMobile: matchedRecord.passengerMobile,
        passengerName: matchedRecord.passengerName,
        pnrNumber: matchedRecord.pnrNumber,
        aadharNumber: matchedRecord.aadharNumber,
        luggage: { ...matchedRecord.luggage }
      });
    } else {
      // Fallback empty if no match
      setFormData({
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
    }
    setIsLoading(false);
  }, [pnr]);

  useEffect(() => {
    if (searchQuery.trim() === '') return;

    const matchedRecord = demoRecords.find(record =>
      record.tokenNo.includes(searchQuery) ||
      record.pnrNumber.includes(searchQuery) ||
      record.passengerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedRecord) {
      setFormData({
        checkInTime: matchedRecord.checkInTime,
        tokenNo: matchedRecord.tokenNo,
        passengerMobile: matchedRecord.passengerMobile,
        passengerName: matchedRecord.passengerName,
        pnrNumber: matchedRecord.pnrNumber,
        aadharNumber: matchedRecord.aadharNumber,
        luggage: { ...matchedRecord.luggage }
      });
    }
  }, [searchQuery]);

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

  const handleCancel = () => {
    console.log('Cancel clicked');
    // Optionally redirect back
  };

  const handleUpdate = () => {
    console.log('Updated Data:', formData);
    // Optionally save to backend or redirect
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center ml-64">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center flex-1 ml-64">
      <div className="w-full max-w-4xl bg-white backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200">
        {/* Header with Search */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Edit Check In - {formData.pnrNumber || 'New'}</h1>
          
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
          {/* Row 1 - Check In Time & Token No */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
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
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-200"
              />
            </div>
          </div>

          {/* Row 3 - PNR Number & Aadhar Number */}
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
                Aadhar Number
              </label>
              <input
                type="text"
                value={formData.aadharNumber}
                onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                placeholder="Enter Aadhar (12 digits)"
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
              <h3 className="text-gray-700 text-sm font-semibold mb-2">Amount (₹)</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {luggageTypes.map((type) => (
                  <input
                    key={`amount-${type.key}`}
                    type="text"
                    value={(formData.luggage[type.key] * type.rate).toFixed(0)}
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
        </div>
      </div>
    </div>
  );
}