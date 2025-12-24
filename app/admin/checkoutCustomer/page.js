"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";
import { showToast } from "nextjs-toast-notify";

const luggageTypes = [
  { label: "One Unit", rate: 30, key: "oneUnit" },
  { label: "Two Unit", rate: 60, key: "twoUnit" },
  { label: "Three Unit", rate: 90, key: "threeUnit" },
  { label: "Locker", rate: 60, key: "locker" },
];


const formatDateTime = (date) => {
  const d = new Date(date);
  const pad = (num) => num.toString().padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(
    d.getDate()
  )}/${d.getFullYear()} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}:${pad(d.getSeconds())}`;
};

export default function CheckOutForm() {
  const [formData, setFormData] = useState({
    checkOutTime: "",
    tokenNo: "",
    passengerName: "",
    passengerMobile: "",
    pnrNumber: "",
    checkInTime: "",
    luggage: {
      oneUnit: 0,
      twoUnit: 0,
      threeUnit: 0,
      locker: 0,
    },
  });

  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPopulated, setIsPopulated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    setFormData((prev) => ({
      ...prev,
      checkOutTime: formatDateTime(now),
    }));
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(`${API_BASE}/checkins`);
        if (!response.ok) {
          throw new Error('Failed to fetch check-ins');
        }
        const checkins = await response.json();
        const checkedInRecords = checkins
          .filter((c) => c.status === 'checkedIn')
          .map((c) => ({
            tokenNo: c.tokenNo,
            passengerName: c.passengerName,
            passengerMobile: c.passengerMobile,
            pnrNumber: c.pnrNumber,
            checkInTime: formatDateTime(c.checkInTime),
            luggage: c.luggage,
          }));
        setRecords(checkedInRecords);
      } catch (err) {
        console.error('Error fetching records:', err);
        setError(err.message);
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "" || records.length === 0) return;

    const matchedRecord = records.find(
      (record) =>
        record.tokenNo.includes(searchQuery) ||
        record.pnrNumber.includes(searchQuery) ||
        record.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.passengerMobile.includes(searchQuery)
    );

    if (matchedRecord) {
      setFormData((prev) => ({
        ...prev,
        tokenNo: matchedRecord.tokenNo,
        passengerName: matchedRecord.passengerName,
        passengerMobile: matchedRecord.passengerMobile,
        pnrNumber: matchedRecord.pnrNumber,
        checkInTime: matchedRecord.checkInTime,
        luggage: { ...matchedRecord.luggage },
      }));
      setIsPopulated(true);
      setError('');
    } else {
      setError('No matching record found');
    }
  }, [searchQuery, records]);

  useEffect(() => {
    if (records.length === 0) return;

    // Auto-populate on tokenNo change
    if (
      formData.tokenNo &&
      records.some((r) => r.tokenNo === formData.tokenNo)
    ) {
      const matched = records.find((r) => r.tokenNo === formData.tokenNo);
      if (
        matched &&
        (formData.passengerName === "" ||
         formData.passengerMobile === "" ||
         formData.pnrNumber === "" ||
         formData.checkInTime === "")
      ) {
        setFormData((prev) => ({
          ...prev,
          passengerName: matched.passengerName,
          passengerMobile: matched.passengerMobile,
          pnrNumber: matched.pnrNumber,
          checkInTime: matched.checkInTime,
          luggage: { ...matched.luggage },
        }));
        setIsPopulated(true);
        setError('');
      }
    }

    // Auto-populate on pnrNumber change
    if (
      formData.pnrNumber &&
      records.some((r) => r.pnrNumber === formData.pnrNumber)
    ) {
      const matched = records.find(
        (r) => r.pnrNumber === formData.pnrNumber
      );
      if (
        matched &&
        (formData.tokenNo === "" ||
         formData.passengerName === "" ||
         formData.passengerMobile === "" ||
         formData.checkInTime === "")
      ) {
        setFormData((prev) => ({
          ...prev,
          tokenNo: matched.tokenNo,
          passengerName: matched.passengerName,
          passengerMobile: matched.passengerMobile,
          checkInTime: matched.checkInTime,
          luggage: { ...matched.luggage },
        }));
        setIsPopulated(true);
        setError('');
      }
    }

    // Auto-populate on passengerName change
    if (
      formData.passengerName &&
      records.some(
        (r) =>
          r.passengerName.toLowerCase() === formData.passengerName.toLowerCase()
      )
    ) {
      const matched = records.find(
        (r) =>
          r.passengerName.toLowerCase() === formData.passengerName.toLowerCase()
      );
      if (
        matched &&
        (formData.tokenNo === "" ||
         formData.pnrNumber === "" ||
         formData.passengerMobile === "" ||
         formData.checkInTime === "")
      ) {
        setFormData((prev) => ({
          ...prev,
          tokenNo: matched.tokenNo,
          passengerMobile: matched.passengerMobile,
          pnrNumber: matched.pnrNumber,
          checkInTime: matched.checkInTime,
          luggage: { ...matched.luggage },
        }));
        setIsPopulated(true);
        setError('');
      }
    }

      // Auto-populate on passengerMobile change
  if (
    formData.passengerMobile &&
    records.some((r) => r.passengerMobile === formData.passengerMobile)
  ) {
    const matched = records.find(
      (r) => r.passengerMobile === formData.passengerMobile
    );
    if (
      matched &&
      (formData.tokenNo === "" ||
       formData.passengerName === "" ||
       formData.pnrNumber === "" ||
       formData.checkInTime === "")
    ) {
      setFormData((prev) => ({
        ...prev,
        tokenNo: matched.tokenNo,
        passengerName: matched.passengerName,
        pnrNumber: matched.pnrNumber,
        checkInTime: matched.checkInTime,
        luggage: { ...matched.luggage },
      }));
      setIsPopulated(true);
      setError('');
    }
  }

  }, [formData.tokenNo, formData.pnrNumber, formData.passengerName, formData.passengerMobile, records]);

  const calculateBaseTotal = () => {
    return luggageTypes.reduce((total, type) => {
      return total + formData.luggage[type.key] * type.rate;
    }, 0);
  };

  const calculateHours = () => {
    if (!formData.checkInTime || !formData.checkOutTime) return 0;
    const inTime = new Date(
      formData.checkInTime.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$1-$2T$4:$5:$6')
    );
    const outTime = new Date(
      formData.checkOutTime.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$1-$2T$4:$5:$6')
    );
    const diffMs = outTime.getTime() - inTime.getTime();
    return diffMs > 0 ? diffMs / (1000 * 60 * 60) : 0;
  };

  const getMultiplier = () => {
    const hours = calculateHours();
    return hours > 0 ? Math.ceil(hours / 24) : 1; // At least 1 day
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
    setFormData((prev) => ({
      ...prev,
      luggage: { ...prev.luggage, [key]: numValue },
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsPopulated(false); // Allow repopulate
    setError('');
  };

  const handleCancel = () => {
    const now = new Date();
    setFormData({
      checkOutTime: formatDateTime(now),
      tokenNo: "",
      passengerName: "",
      passengerMobile: "",
      pnrNumber: "",
      checkInTime: "",
      luggage: {
        oneUnit: 0,
        twoUnit: 0,
        threeUnit: 0,
        locker: 0,
      },
    });
    setSearchQuery("");
    setIsPopulated(false);
    setError('');
  };

  const handleUpdate = async () => {
    if (!formData.tokenNo || getTotalUnits() === 0) {
      setError('Token and luggage required');
      return;
    }

    const multiplier = getMultiplier();
    if (multiplier === 0) {
      setError('Invalid check-in time');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const finalAmount = {
        oneUnitAmount: formData.luggage.oneUnit * 30 * multiplier,
        twoUnitAmount: formData.luggage.twoUnit * 60 * multiplier,
        threeUnitAmount: formData.luggage.threeUnit * 90 * multiplier,
        lockerAmount: formData.luggage.locker * 60 * multiplier,
        totalAmount: calculateTotal(),
      };

      const response = await fetch(`${API_BASE}/checkouts/token/${formData.tokenNo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: finalAmount }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update checkout');
      }

      const updated = await response.json();
      console.log('Checkout updated successfully:', updated);
      // alert("Check-out data updated successfully!");
      showToast.success("Check-out data updated successfully!", {
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceInDown",
        icon: '',
        sound: true,
      });
      // router.push("/admin/checkout-reports")
      router.push(`/report/${updated.tokenNo}`)

      handleCancel();
    } catch (err) {
      console.error('Error updating checkout:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hours = calculateHours();
  const multiplier = getMultiplier();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-gray-800 to-slate-900 p-3 sm:p-4 md:p-6 flex items-center justify-center flex-1">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-white/20">
        {/* Header with Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Check Out</h1>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search by Token, PNR, or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white/5 rounded-full text-white text-sm sm:text-base placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Form Grid */}
        <div className="space-y-4 sm:space-y-6">
          {/* Row 1 - Check Out Time & Token No */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-2">
                Check Out Time
              </label>
              <input
                type="text"
                value={formData.checkOutTime}
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
                onChange={(e) => handleInputChange("tokenNo", e.target.value)}
                placeholder="Enter Token No"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 rounded-xl text-white text-sm sm:text-base placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
          </div>

          {/* Row 2 - Passenger Name & Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-2">
                Passenger Name
              </label>
              <input
                type="text"
                value={formData.passengerName}
                onChange={(e) =>
                  handleInputChange("passengerName", e.target.value)
                }
                placeholder="Enter full name"
                readOnly={isPopulated}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 rounded-xl text-white text-sm sm:text-base placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-2">
                Passenger Mobile
              </label>
              <input
                type="tel"
                value={formData.passengerMobile}
                onChange={(e) =>
                  handleInputChange("passengerMobile", e.target.value)
                }
                placeholder="Enter mobile number"
                readOnly={isPopulated}
                maxLength={10}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 rounded-xl text-white text-sm sm:text-base placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
          </div>

          {/* Row 3 - PNR Number & Check In Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-2">
                PNR Number
              </label>
              <input
                type="text"
                value={formData.pnrNumber}
                onChange={(e) => handleInputChange("pnrNumber", e.target.value)}
                placeholder="Enter PNR"
                readOnly={isPopulated}
                maxLength={10}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 rounded-xl text-white text-sm sm:text-base placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-xs sm:text-sm font-semibold mb-2">
                Check In Time
              </label>
              <input
                type="text"
                value={formData.checkInTime}
                readOnly
                placeholder="MM/DD/YYYY HH:MM:SS"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 rounded-xl text-white text-sm sm:text-base placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
          </div>

          {/* Luggage Type Section */}
          <div className="pt-2 sm:pt-4">
            <h2 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">
              Luggage Details
            </h2>

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
                    onChange={(e) =>
                      handleLuggageChange(type.key, e.target.value)
                    }
                    placeholder="0"
                    readOnly={isPopulated}
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
              <h3 className="text-gray-300 text-xs sm:text-sm font-semibold mb-2">
                Rate (₹)
              </h3>
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
              <h3 className="text-gray-300 text-xs sm:text-sm font-semibold mb-2">
                Amount (₹) {multiplier > 1 && `(x${multiplier})`}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {luggageTypes.map((type) => (
                  <input
                    key={`amount-${type.key}`}
                    type="text"
                    value={(
                      formData.luggage[type.key] *
                      type.rate *
                      multiplier
                    ).toFixed(0)}
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
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-white/10 border border-white/20 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-white/20 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>

          {/* Footer Hint */}
          {hours > 0 && (
            <p className="text-gray-400 text-xs sm:text-sm">
              Total duration: {hours.toFixed(2)} hours (Charged as {multiplier}{" "}
              days)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}