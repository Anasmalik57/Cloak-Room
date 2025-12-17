"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

const luggageTypes = [
  { label: "One Unit", rate: 30, key: "oneUnit" },
  { label: "Two Unit", rate: 60, key: "twoUnit" },
  { label: "Three Unit", rate: 90, key: "threeUnit" },
  { label: "Locker", rate: 60, key: "locker" },
];

const demoRecords = [
  {
    tokenNo: "1245327",
    passengerName: "Vikrant Verma",
    passengerMobile: "1234567890",
    pnrNumber: "123",
    checkInTime: "12/02/2025 11:16:12",
    luggage: {
      oneUnit: 2,
      twoUnit: 1,
      threeUnit: 1,
      locker: 0,
    },
  },
  {
    tokenNo: "9876543",
    passengerName: "Priya Sharma",
    passengerMobile: "0987654321",
    pnrNumber: "456",
    checkInTime: "12/15/2025 09:30:00",
    luggage: {
      oneUnit: 1,
      twoUnit: 0,
      threeUnit: 2,
      locker: 1,
    },
  },
  {
    tokenNo: "5556667",
    passengerName: "Rahul Kumar",
    passengerMobile: "1122334455",
    pnrNumber: "789",
    checkInTime: "12/15/2025 10:30:22",
    luggage: {
      oneUnit: 4,
      twoUnit: 3,
      threeUnit: 2,
      locker: 0,
    },
  },
];

const formatDateTime = (date) => {
  const pad = (num) => num.toString().padStart(2, "0");
  return `${pad(date.getMonth() + 1)}/${pad(
    date.getDate()
  )}/${date.getFullYear()} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`;
};

const generateToken = () => Math.floor(Math.random() * 9000000) + 1000000;

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

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const now = new Date();
    setFormData((prev) => ({
      ...prev,
      checkOutTime: formatDateTime(now),
      // tokenNo: generateToken().toString(),
    }));
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") return;

    const matchedRecord = demoRecords.find(
      (record) =>
        record.tokenNo.includes(searchQuery) ||
        record.pnrNumber.includes(searchQuery) ||
        record.passengerName.toLowerCase().includes(searchQuery.toLowerCase())
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
    }
  }, [searchQuery]);

  useEffect(() => {
    // Populate on tokenNo, pnrNumber, or passengerName change if matches demo
    if (
      formData.tokenNo &&
      demoRecords.some((r) => r.tokenNo === formData.tokenNo)
    ) {
      const matched = demoRecords.find((r) => r.tokenNo === formData.tokenNo);
      if (
        matched &&
        formData.passengerName === "" &&
        formData.passengerMobile === "" &&
        formData.pnrNumber === "" &&
        formData.checkInTime === ""
      ) {
        setFormData((prev) => ({
          ...prev,
          passengerName: matched.passengerName,
          passengerMobile: matched.passengerMobile,
          pnrNumber: matched.pnrNumber,
          checkInTime: matched.checkInTime,
          luggage: { ...matched.luggage },
        }));
      }
    }
    // Similar for pnrNumber and passengerName
    if (
      formData.pnrNumber &&
      demoRecords.some((r) => r.pnrNumber === formData.pnrNumber)
    ) {
      const matched = demoRecords.find(
        (r) => r.pnrNumber === formData.pnrNumber
      );
      if (
        matched &&
        (formData.tokenNo === "" || formData.passengerName === "")
      ) {
        setFormData((prev) => ({
          ...prev,
          tokenNo: matched.tokenNo,
          passengerName: matched.passengerName,
          passengerMobile: matched.passengerMobile,
          checkInTime: matched.checkInTime,
          luggage: { ...matched.luggage },
        }));
      }
    }
    if (
      formData.passengerName &&
      demoRecords.some(
        (r) =>
          r.passengerName.toLowerCase() === formData.passengerName.toLowerCase()
      )
    ) {
      const matched = demoRecords.find(
        (r) =>
          r.passengerName.toLowerCase() === formData.passengerName.toLowerCase()
      );
      if (matched && (formData.tokenNo === "" || formData.pnrNumber === "")) {
        setFormData((prev) => ({
          ...prev,
          tokenNo: matched.tokenNo,
          passengerMobile: matched.passengerMobile,
          pnrNumber: matched.pnrNumber,
          checkInTime: matched.checkInTime,
          luggage: { ...matched.luggage },
        }));
      }
    }
  }, [formData.tokenNo, formData.pnrNumber, formData.passengerName]);

  const calculateBaseTotal = () => {
    return luggageTypes.reduce((total, type) => {
      return total + formData.luggage[type.key] * type.rate;
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
    return hours > 0 ? Math.ceil(hours / 24) : 0;
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
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
    // Reset form if needed
    setFormData({
      checkOutTime: formatDateTime(new Date()),
      tokenNo: generateToken().toString(),
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
  };

  const handleUpdate = () => {
    console.log("Update clicked", formData);
    setTimeout(() => {
      alert("Check-out data updated successfully!");

     setFormData({
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
  })
    }, 1000);
  };

  const hours = calculateHours();
  const multiplier = getMultiplier();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-gray-800 to-slate-900 p-6 flex items-center justify-center flex-1 ml-64">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
        {/* Header with Search */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Check Out</h1>

          {/* Search Bar */}
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Token, PNR, or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 rounded-full text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
            />
          </div>
        </div>

        {/* Form Grid */}
        <div className="space-y-6">
          {/* Row 1 - Check Out Time & Token No */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Check Out Time
              </label>
              <input
                type="text"
                value={formData.checkOutTime}
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
                onChange={(e) => handleInputChange("tokenNo", e.target.value)}
                placeholder="Enter Token No"
                className="w-full px-4 py-3 bg-white/5 rounded-xl text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
          </div>

          {/* Row 2 - Passenger Name & Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Passenger Name
              </label>
              <input
                type="text"
                value={formData.passengerName}
                onChange={(e) =>
                  handleInputChange("passengerName", e.target.value)
                }
                placeholder="Enter full name"
                className="w-full px-4 py-3 bg-white/5 rounded-xl text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Passenger Mobile
              </label>
              <input
                type="tel"
                value={formData.passengerMobile}
                onChange={(e) =>
                  handleInputChange("passengerMobile", e.target.value)
                }
                placeholder="Enter mobile number"
                className="w-full px-4 py-3 bg-white/5 rounded-xl text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
          </div>

          {/* Row 3 - PNR Number & Check In Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                PNR Number
              </label>
              <input
                type="text"
                value={formData.pnrNumber}
                onChange={(e) => handleInputChange("pnrNumber", e.target.value)}
                placeholder="Enter PNR"
                className="w-full px-4 py-3 bg-white/5 rounded-xl text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Check In Time
              </label>
              <input
                type="text"
                value={formData.checkInTime}
                onChange={(e) =>
                  handleInputChange("checkInTime", e.target.value)
                }
                placeholder="MM/DD/YYYY HH:MM:SS"
                className="w-full px-4 py-3 bg-white/5 rounded-xl text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-white/10"
              />
            </div>
          </div>

          {/* Luggage Type Section */}
          <div className="pt-4">
            <h2 className="text-white text-lg font-bold mb-4">
              Luggage Details
            </h2>

            {/* Luggage Type Headers & Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
              <h3 className="text-gray-300 text-sm font-semibold mb-2">
                Rate (₹)
              </h3>
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
              <h3 className="text-gray-300 text-sm font-semibold mb-2">
                Amount (₹) {multiplier > 1 && `(x${multiplier})`}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Update
            </button>
          </div>

          {/* Footer Hint */}
          {hours > 0 && (
            <p className="text-gray-400 text-sm">
              Total duration: {hours.toFixed(2)} hours (Charged as {multiplier}{" "}
              days)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
