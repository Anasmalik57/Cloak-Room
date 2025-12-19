"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Edit2,
  Users,
  UserPlus,
  UserMinus,
  PrinterIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

const formatDateTime = (date) => {
  const d = new Date(date);
  const pad = (num) => num.toString().padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export default function CheckInListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // asc | desc
  const router = useRouter();

  useEffect(() => {
    const fetchCheckins = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/checkins`);
        if (!response.ok) {
          throw new Error("Failed to fetch checkins");
        }
        const checkins = await response.json();

        // Map backend data to component format
        const mappedData = checkins.map((checkin) => ({
          pnr: checkin.pnrNumber.replace("PNR", ""),
          token: checkin.tokenNo,
          name: checkin.passengerName,
          phone: checkin.passengerMobile,
          pnrNumber: checkin.pnrNumber,
          adhara: checkin.aadharNumber,
          checkIn: formatDateTime(checkin.checkInTime),
          luggage: checkin.luggage,
          status: checkin.status,
          avatar: checkin.passengerName.charAt(0).toUpperCase(), // Generate avatar initial
        }));

        setData(mappedData);
      } catch (err) {
        console.error("Error fetching checkins:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckins();
  }, []);

  const handleEdit = (token) => {
    router.push(`/admin/checkin-reports/${token}`);
  };

  const filteredCustomers = data
    .filter((customer) => customer.status === "checkedIn")
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

  // Compute stats
  const totalCustomers = data.length;
  const checkInCustomers = data.filter((c) => c.status === "checkedIn").length;
  const checkOutCustomers = data.filter(
    (c) => c.status === "checkedOut"
  ).length;

  const statsData = [
    { title: "Total Customers", value: totalCustomers.toString(), icon: Users },
    {
      title: "Check In Customers",
      value: checkInCustomers.toString(),
      icon: UserPlus,
    },
    {
      title: "Check Out Customers",
      value: checkOutCustomers.toString(),
      icon: UserMinus,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-8 flex-1  flex items-center justify-center">
        <p className="text-gray-600">Loading check-ins...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-8 flex-1  flex items-center justify-center">
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 p-8 flex-1  print:ml-0">
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
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-full text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-lg border border-gray-200"
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
              key={customer.token}
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
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(customer.token)}
                    className="w-10 h-10 bg-linear-to-br cursor-pointer from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:shadow-xl transition-all hover:scale-110 shadow-md"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => router.push(`/checkin-reciepts/${customer.token}`)}
                    className="w-10 h-10 bg-linear-to-br cursor-pointer from-green-500 to-green-600 rounded-full flex items-center justify-center text-white hover:shadow-xl transition-all hover:scale-110 shadow-md"
                  >
                    <PrinterIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredCustomers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 text-lg">
                No customers found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
