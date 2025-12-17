"use client";
import React, { useState } from "react";
import { Search, Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const customersData = [
  { token: "1245327", name: "Arjun Khanna", phone: "+91 8765432109", checkInTime: "10-06-2025 : 04 AM", checkOutTime: "10-06-2025 : 01 PM", totalTime: "09 :00 : 00", price: "42 Rs", avatar: "AK", },
  { token: "9876543", name: "Meera Joshi", phone: "+91 8654321098", checkInTime: "10-06-2025 : 06 AM", checkOutTime: "11-06-2025 : 06 AM", totalTime: "24 :00 : 00", price: "88 Rs", avatar: "MJ", },
  { token: "5556667", name: "Nitin Chawla", phone: "+91 8543210987", checkInTime: "11-06-2025 : 09 AM", checkOutTime: "11-06-2025 : 05 PM", totalTime: "08 :00 : 00", price: "36 Rs", avatar: "NC", },
  { token: "1122334", name: "Ritika Bansal", phone: "+91 8432109876", checkInTime: "12-06-2025 : 07 AM", checkOutTime: "13-06-2025 : 07 AM", totalTime: "24 :00 : 00", price: "92 Rs", avatar: "RB", },
  { token: "4455667", name: "Imran Khan", phone: "+91 8321098765", checkInTime: "13-06-2025 : 10 AM", checkOutTime: "13-06-2025 : 08 PM", totalTime: "10 :00 : 00", price: "48 Rs", avatar: "IK", },
  { token: "7788990", name: "Tanvi Kulkarni", phone: "+91 8210987654", checkInTime: "14-06-2025 : 05 AM", checkOutTime: "15-06-2025 : 05 AM", totalTime: "24 :00 : 00", price: "90 Rs", avatar: "TK", },
  { token: "3344556", name: "Sahil Oberoi", phone: "+91 8109876543", checkInTime: "15-06-2025 : 08 AM", checkOutTime: "15-06-2025 : 06 PM", totalTime: "10 :00 : 00", price: "46 Rs", avatar: "SO", },
  { token: "6677889", name: "Ayesha Farooq", phone: "+91 8098765432", checkInTime: "16-06-2025 : 06 AM", checkOutTime: "17-06-2025 : 06 AM", totalTime: "24 :00 : 00", price: "96 Rs", avatar: "AF", },
  { token: "9900112", name: "Manoj Tripathi", phone: "+91 7987654321", checkInTime: "17-06-2025 : 11 AM", checkOutTime: "17-06-2025 : 09 PM", totalTime: "10 :00 : 00", price: "52 Rs", avatar: "MT", },
  { token: "2233445", name: "Kavya Shetty", phone: "+91 7876543210", checkInTime: "18-06-2025 : 07 AM", checkOutTime: "19-06-2025 : 07 AM", totalTime: "24 :00 : 00", price: "99 Rs", avatar: "KS", },
  { token: "5566778", name: "Rohan Dutta", phone: "+91 7765432109", checkInTime: "19-06-2025 : 09 AM", checkOutTime: "19-06-2025 : 04 PM", totalTime: "07 :00 : 00", price: "34 Rs", avatar: "RD", },
  { token: "8899001", name: "Shalini Gupta", phone: "+91 7654321098", checkInTime: "20-06-2025 : 05 AM", checkOutTime: "21-06-2025 : 05 AM", totalTime: "24 :00 : 00", price: "102 Rs", avatar: "SG", },
];

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
  const [data, setData] = useState(customersData);
  const router = useRouter();

  const handleDelete = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    setData(updated);
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

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-8 flex-1 ml-64 print:ml-0">
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
            className="w-full pl-12 pr-4 py-3.5 bg-white backdrop-blur-sm rounded-full text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-lg border border-gray-200"
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
      <div className="bg-white backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        {/* Table Header */}
        <div className="bg-linear-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
          <div className="grid grid-cols-7 gap-4">
            {tableColumns.map((col, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-wider ${
                  col.key === "actions" ? "justify-center" : ""
                }`}
              >
                {col.label}
                {col.key !== "actions" && (
                  <svg
                    className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-500 transition-colors"
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
          {filteredCustomers.map((customer, index) => (
            <div
              key={customer.token}
              className="px-6 py-4 hover:bg-linear-to-r hover:from-orange-50 hover:to-gray-50 transition-all group"
            >
              <div className="grid grid-cols-7 gap-4 items-center">
                {/* Name with Avatar */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
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
                  <button
                    onClick={() => handleEdit(customer.token)}
                    className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:shadow-xl transition-all hover:scale-110 shadow-md"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(index)}
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