"use client";
import React, { useState, useEffect } from "react";
import { Search, Edit2, Trash2, PrinterIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";


const formatDate = (date) => {
  const d = new Date(date);
  const pad = (num) => num.toString().padStart(2, '0');
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
};

const formatTime = (date) => {
  const d = new Date(date);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours.toString().padStart(2, '0')} ${ampm}`;
};

const formatTotalTime = (checkInTime, checkOutTime) => {
  const inTime = new Date(checkInTime);
  const outTime = new Date(checkOutTime);
  const diffMs = outTime.getTime() - inTime.getTime();
  if (diffMs < 0) return '00 : 00 : 00';
  const diffSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;
  return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
};

const tableColumns = [
  { label: "Name", key: "name" },
  { label: "Phone Number", key: "phone" },
  { label: "Check In Time", key: "checkInTime" },
  { label: "Check Out Time", key: "checkOutTime" },
  { label: "Total Time", key: "totalTime" },
  { label: "Price", key: "price" },
  { label: "Actions", key: "actions" },
];

export default function CheckOutListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/checkouts`);
        if (!response.ok) {
          throw new Error('Failed to fetch checkouts');
        }
        const checkouts = await response.json();
        
        // Map backend data to component format
        const mappedData = checkouts.map((checkout) => ({
          id: checkout._id,
          token: checkout.tokenNo,
          name: checkout.passengerName,
          phone: `+91 ${checkout.passengerMobile}`,
          checkInTime: `${formatDate(checkout.checkInTime)} : ${formatTime(checkout.checkInTime)}`,
          checkOutTime: `${formatDate(checkout.updatedAt)} : ${formatTime(checkout.updatedAt)}`,
          totalTime: formatTotalTime(checkout.checkInTime, checkout.updatedAt),
          price: `${checkout.amount.totalAmount} Rs (${calculateDays(checkout.checkInTime, checkout.updatedAt)} Day${calculateDays(checkout.checkInTime, checkout.updatedAt) > 1 ? 's' : ''})`,
          avatar: checkout.passengerName.substring(0, 2).toUpperCase(),
          rawCheckIn: checkout.checkInTime,
          rawCheckOut: checkout.updatedAt
        }));
        
        setData(mappedData);
        console.log('Fetched checkouts:', mappedData);
      } catch (err) {
        console.error('Error fetching checkouts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckouts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this checkout?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/checkouts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete checkout');
      }
      
      // Refetch data after delete
      const fetchResponse = await fetch(`${API_BASE}/checkouts`);
      const checkouts = await fetchResponse.json();
      const mappedData = checkouts.map((checkout) => ({
        id: checkout._id,
        token: checkout.tokenNo,
        name: checkout.passengerName,
        phone: `+91 ${checkout.passengerMobile}`,
        checkInTime: `${formatDate(checkout.checkInTime)} : ${formatTime(checkout.checkInTime)}`,
        checkOutTime: `${formatDate(checkout.updatedAt)} : ${formatTime(checkout.updatedAt)}`,
        totalTime: formatTotalTime(checkout.checkInTime, checkout.updatedAt),
        price: `${checkout.amount.totalAmount} Rs (${calculateDays(checkout.checkInTime, checkout.updatedAt)} Day${calculateDays(checkout.checkInTime, checkout.updatedAt) > 1 ? 's' : ''})`,
        avatar: checkout.passengerName.substring(0, 2).toUpperCase(),
        rawCheckIn: checkout.checkInTime,
        rawCheckOut: checkout.updatedAt
      }));
      setData(mappedData);
    } catch (err) {
      console.error('Error deleting checkout:', err);
      alert('Failed to delete checkout');
    }
  };

  const handleEdit = (token) => {
    router.push(`/admin/checkout-reports/${token}`);
  };

  // Filtered data
  const filteredCustomers = data.filter((customer) => {
    const q = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(q) ||
      customer.phone.toLowerCase().includes(q) ||
      customer.checkInTime.toLowerCase().includes(q) ||
      customer.checkOutTime.toLowerCase().includes(q) ||
      customer.token.toLowerCase().includes(q)
    );
  });

  // Calculate Days Function
  const calculateDays = (checkInTime, checkOutTime) => {
    const inTime = new Date(checkInTime);
    const outTime = new Date(checkOutTime);
    const diffMs = outTime.getTime() - inTime.getTime();
    if (diffMs <= 0) return 1; // minimum 1 day
    const hours = diffMs / (1000 * 60 * 60);
    return Math.ceil(hours / 24);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-8 flex-1 ml-64 flex items-center justify-center">
        <p className="text-gray-600">Loading checkouts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-8 flex-1 ml-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-8 print:p-0 flex-1 ml-64 print:ml-0">
      {/* Top Filter Bar */}
      <div className="mb-8 flex items-center gap-4 print:hidden">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, token, or time..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-full text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-lg border border-gray-200"
          />
        </div>

        {/* Action Buttons */}
        <button
          onClick={() => {
            const text = filteredCustomers
              .map(
                (c) =>
                  `${c.name} | ${c.phone} | ${c.token} | ${c.checkInTime} | ${c.checkOutTime} | ${c.totalTime} | ${c.price}`
              )
              .join("\n");
            navigator.clipboard.writeText(text);
          }}
          className="px-6 py-3.5 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all hover:scale-105"
        >
          Copy
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3.5 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all hover:scale-105"
        >
          Print
        </button>
      </div>

      {/* Customers Table */}
      <div className="bg-white backdrop-blur-sm rounded-3xl print:rounded-none shadow-xl overflow-hidden border border-gray-200">
        {/* Table Header */}
        <div className="bg-linear-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200 ">
          <div className="grid grid-cols-7 gap-4">
            {tableColumns.map((col, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider print:text-[10px] ${
                  col.key === "actions" ? "justify-center" : ""
                }`}
              >
                {col.label}
                {col.key !== "actions" && (
                  <svg
                    className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-500 transition-colors print:hidden"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.token}
              className="px-6 py-4 hover:bg-linear-to-r hover:from-orange-50 hover:to-gray-50 transition-all group"
            >
              <div className="grid grid-cols-7 gap-4 items-center">
                {/* Name with Avatar */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 print:hidden bg-linear-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                    {customer.avatar}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {customer.name}
                  </span>
                </div>

                {/* Phone */}
                <div className="text-sm text-gray-600 font-medium">
                  {customer.phone}
                </div>

                {/* Check In Time */}
                <div className="text-sm text-gray-600 font-medium">
                  {customer.checkInTime}
                </div>

                {/* Check Out Time */}
                <div className="text-sm text-gray-600 font-medium">
                  {customer.checkOutTime}
                </div>

                {/* Total Time */}
                <div className="text-sm font-bold text-orange-600">
                  {customer.totalTime}
                </div>

                {/* Price */}
                <div className="text-sm font-semibold text-gray-800">
                  {customer.price}
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-2">
                  {/* Edit */}
                  <button onClick={() => handleEdit(customer.token)}
                    className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:shadow-xl transition-all hover:scale-110 shadow-md"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {/* Print */}
                  <button onClick={() => router.push(`/report/${customer.token}`)}
                    className="w-10 h-10 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white hover:shadow-xl transition-all hover:scale-110 shadow-md"
                  >
                    <PrinterIcon className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="w-10 h-10 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white hover:shadow-xl transition-all hover:scale-110 shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredCustomers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 text-lg">No customers found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}