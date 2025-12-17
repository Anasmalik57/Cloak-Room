"use client";
import React, { useState } from "react";
import {
  Search,
  Filter,
  Edit2,
  Users,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { useRouter } from "next/navigation";

const statsData = [
  { title: "Total Customers", value: "12", icon: Users },
  { title: "Check In Customers", value: "9", icon: UserPlus },
  { title: "Check Out Customers", value: "3", icon: UserMinus },
];

const customersData =  [
  {
    pnr: "10234",
    token: '1245327',
    name: 'Rahul Sharma',
    phone: '9876543210',
    pnrNumber: 'PNR10234',
    adhara: '123456789012',
    checkIn: '01/05/2025 10:30:00',
    luggage: {
      oneUnit: 2,
      twoUnit: 1,
      threeUnit: 0,
      locker: 0,
    }
  },
  {
    pnr: "20456",
    token: '9876543',
    name: 'Neha Verma',
    phone: '9123456789',
    pnrNumber: 'PNR20456',
    adhara: '987654321098',
    checkIn: '01/06/2025 09:15:45',
    luggage: {
      oneUnit: 1,
      twoUnit: 0,
      threeUnit: 2,
      locker: 1,
    }
  },
  {
    pnr: "30987",
    token: '5556667',
    name: 'Amit Patel',
    phone: '9988776655',
    pnrNumber: 'PNR30987',
    adhara: '456789123456',
    checkIn: '01/07/2025 14:20:30',
    luggage: {
      oneUnit: 0,
      twoUnit: 3,
      threeUnit: 1,
      locker: 0,
    }
  },
  {
    pnr: "45678",
    token: '1122334',
    name: 'Pooja Singh',
    phone: '9012345678',
    pnrNumber: 'PNR45678',
    adhara: '789123456789',
    checkIn: '01/08/2025 08:45:12',
    luggage: {
      oneUnit: 3,
      twoUnit: 0,
      threeUnit: 0,
      locker: 2,
    }
  },
  {
    pnr: "56789",
    token: '4455667',
    name: 'Karan Mehta',
    phone: '8899776655',
    pnrNumber: 'PNR56789',
    adhara: '321654987012',
    checkIn: '01/09/2025 11:10:22',
    luggage: {
      oneUnit: 1,
      twoUnit: 2,
      threeUnit: 1,
      locker: 0,
    }
  },
  {
    pnr: "67890",
    token: '7788990',
    name: 'Sneha Iyer',
    phone: '9345678901',
    pnrNumber: 'PNR67890',
    adhara: '654987321098',
    checkIn: '01/10/2025 07:55:00',
    luggage: {
      oneUnit: 0,
      twoUnit: 1,
      threeUnit: 3,
      locker: 1,
    }
  },
  {
    pnr: "78901",
    token: '3344556',
    name: 'Vikas Kumar',
    phone: '9567890123',
    pnrNumber: 'PNR78901',
    adhara: '012345678901',
    checkIn: '01/11/2025 13:40:15',
    luggage: {
      oneUnit: 2,
      twoUnit: 0,
      threeUnit: 2,
      locker: 0,
    }
  },
  {
    pnr: "89012",
    token: '6677889',
    name: 'Anjali Rao',
    phone: '9789012345',
    pnrNumber: 'PNR89012',
    adhara: '345678901234',
    checkIn: '01/12/2025 16:25:50',
    luggage: {
      oneUnit: 4,
      twoUnit: 1,
      threeUnit: 0,
      locker: 0,
    }
  },
  {
    pnr: "90123",
    token: '9900112',
    name: 'Rohit Malhotra',
    phone: '9900123456',
    pnrNumber: 'PNR90123',
    adhara: '678901234567',
    checkIn: '01/13/2025 12:00:00',
    luggage: {
      oneUnit: 0,
      twoUnit: 2,
      threeUnit: 0,
      locker: 3,
    }
  },
];

const tableColumns = [
  { label: "Name", key: "name" },
  { label: "Phone Number", key: "phone" },
  { label: "PNR No", key: "pnr" },
  { label: "Aadhar No", key: "adhara" },
  { label: "Check In", key: "checkIn" },
  { label: "Actions", key: "actions" },
];

export default function CheckInListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data] = useState(customersData);
  const [sortOrder, setSortOrder] = useState("asc"); // asc | desc
  const router = useRouter();

  const handleEdit = (token) => {
    router.push(`/admin/checkin-reports/${token}`);
  };

  const filteredCustomers = data
    .filter((customer) => {
      const q = searchQuery.toLowerCase();
      return (
        customer.name.toLowerCase().includes(q) ||
        customer.phone.toLowerCase().includes(q) ||
        customer.pnr.toLowerCase().includes(q) ||
        customer.adhara.toLowerCase().includes(q) ||
        customer.checkIn.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.checkIn);
      const dateB = new Date(b.checkIn);

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
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
            placeholder="Search by name, phone, PNR, Aadhar, or date..."
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
                  `${c.name} | ${c.phone} | ${c.pnr} | ${c.adhara} | ${c.checkIn}`
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

        {/* Date Filter */}
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="ml-auto px-6 py-3.5 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
        >
          Date {sortOrder === "asc" ? "↑" : "↓"}
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8 print:hidden">
        {statsData.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105 border border-gray-200"
          >
            <div className="flex items-center gap-5">
              <div className="bg-linear-to-br from-orange-400 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                <card.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  {card.title}
                </p>
                <p className="text-4xl font-bold text-gray-800 tracking-tight">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customers Table */}
      <div className="bg-white backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        {/* Table Header */}
        <div className="bg-linear-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
          <div className="grid grid-cols-6 gap-4">
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
              key={customer.pnr}
              className="px-6 py-4 hover:bg-linear-to-r hover:from-orange-50 hover:to-gray-50 transition-all group"
            >
              <div className="grid grid-cols-6 gap-4 items-center">
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

                {/* PNR */}
                <div className="text-sm font-semibold text-gray-800">
                  {customer.pnr}
                </div>

                {/* Aadhar */}
                <div className="text-sm text-gray-600 font-medium">
                  {customer.adhara}
                </div>

                {/* Check In */}
                <div className="text-sm text-gray-600 font-medium">
                  {customer.checkIn}
                </div>

                {/* Actions */}
                <div className="flex justify-center">
                  <button 
                    onClick={() => handleEdit(customer.token)}
                    className="w-10 h-10 bg-linear-to-br cursor-pointer from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:shadow-xl transition-all hover:scale-110 group-hover:rotate-12 shadow-md"
                  >
                    <Edit2 className="w-4 h-4" />
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