"use client"
import React, { useState, useEffect } from 'react';
import { Users, Clock, Package, LogOut, UserPlus, UserMinus, FileText, Search, Bell, Moon, HelpCircle, Calendar, MoreVertical } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const API_BASE = "http://localhost:5000/api";

const timeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diff = now.getTime() - past.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
};

export default function AdminDashboard() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[now.getDay()];
    const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setCurrentDate(`${day}, ${date}`);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/checkins`);
        if (!response.ok) {
          throw new Error('Failed to fetch checkins');
        }
        const data = await response.json();
        setCheckins(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const checkedIn = checkins.filter(c => c.status === 'checkedIn');
  const checkedOut = checkins.filter(c => c.status === 'checkedOut');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todayCheckIns = checkedIn.filter(c => {
    const checkDate = new Date(c.checkInTime);
    return checkDate >= today && checkDate < tomorrow;
  }).length;

  const totalRevenue = checkedOut.reduce((sum, c) => sum + (c.amount?.totalAmount || 0), 0);

  const recentJoined = checkedIn
    .sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime))
    .slice(0, 3)
    .map(c => ({
      name: c.passengerName,
      mobile: `+91 ${c.passengerMobile}`,
      status: 'Checked In',
      avatar: c.passengerName.substring(0, 2).toUpperCase(),
      time: timeAgo(c.checkInTime)
    }));

  const recentCheckouts = checkedOut
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 4)
    .map(c => ({
      name: c.passengerName,
      amount: `₹${c.amount?.totalAmount || 0}`,
      date: new Date(c.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      avatar: c.passengerName.substring(0, 2).toUpperCase()
    }));

  const recentTransactions = checkedOut
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6)
    .map(c => ({
      name: c.passengerName,
      amount: `₹${c.amount?.totalAmount || 0}`,
      type: 'Check Out'
    }));

  const pieData = [
    { name: 'Check Ins', value: checkedIn.length, color: '#3B82F6' },
    { name: 'Check Outs', value: checkedOut.length, color: '#F59E0B' },
  ];

  const statCards = [
    { title: 'Total Customers', value: checkins.length.toString(), icon: Users, bgColor: 'bg-blue-500', iconColor: 'text-white' },
    { title: 'Check In Today', value: todayCheckIns.toString(), icon: UserPlus, bgColor: 'bg-green-500', iconColor: 'text-white' },
    { title: 'Ready for Check Out', value: checkedIn.length.toString(), icon: Clock, bgColor: 'bg-yellow-500', iconColor: 'text-white' },
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: Package, bgColor: 'bg-purple-500', iconColor: 'text-white' },
  ];

  const filteredJoined = recentJoined.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.mobile.includes(searchQuery) ||
    person.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.time.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCheckouts = recentCheckouts.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.amount.includes(searchQuery) ||
    item.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTransactions = recentTransactions.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.amount.includes(searchQuery) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center ml-64">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center ml-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="ml-64 flex-1">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">{currentDate}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dashboard..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                AD
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
              <div key={index} className={`${card.bgColor} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center shadow-md">
                    <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm opacity-90 mb-1">{card.title}</p>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Recently Joined */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Recently Joined ({filteredJoined.length})</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-1">Name</div>
                  <div className="flex items-center gap-1">Mobile</div>
                  <div className="flex items-center gap-1">Status</div>
                </div>
                
                {filteredJoined.length > 0 ? (
                  filteredJoined.map((person, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 items-center py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {person.avatar}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{person.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{person.mobile}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">{person.status} • {person.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No matches found</p>
                )}
              </div>
            </div>

            {/* Total Amount Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Revenue Breakdown</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">₹{totalRevenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">This Month</p>
                    </div>
                  </div>
                </div>
                
                <div className="ml-8 space-y-3">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded`} style={{ backgroundColor: entry.color }}></div>
                      <div>
                        <p className="text-xs text-gray-500">{entry.name}</p>
                        <p className="text-sm font-semibold text-gray-800">{entry.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-2 gap-6">
            {/* Recent Check Outs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Recent Check Outs ({filteredCheckouts.length})</h2>
                <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1">
                  See all
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100">
                  <div>Name</div>
                  <div>Amount</div>
                  <div>Date</div>
                </div>
                
                {filteredCheckouts.length > 0 ? (
                  filteredCheckouts.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 items-center py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-linear-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {item.avatar}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{item.amount}</span>
                      <span className="text-sm text-gray-600">{item.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No matches found</p>
                )}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Recent Transactions ({filteredTransactions.length})</h2>
                <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1">
                  See all
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100">
                  <div>Name</div>
                  <div className="text-right">Amount</div>
                </div>
                
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 items-center py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-linear-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {item.name.split(' ')[0][0]}{item.name.split(' ')[1]?.[0] || ''}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 text-right">{item.amount} <span className="text-xs text-gray-500">({item.type})</span></span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No matches found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}