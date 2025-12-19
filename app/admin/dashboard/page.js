"use client"
import React, { useState, useEffect } from 'react';
import { Users, Clock, Package, UserPlus, Search, Bell, Moon, HelpCircle, Calendar, MoreVertical } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { API_BASE } from '@/lib/api';
import { useRouter } from 'next/navigation';


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
  const router = useRouter()

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
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center px-4">
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
      <div className="flex-1 w-full">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">{currentDate}</span>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dashboard..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 sm:pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
              </div>
              
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-md cursor-pointer hover:shadow-lg transition-shadow shrink-0">
                AD
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
            {statCards.map((card, index) => (
              <div key={index} className={`${card.bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="bg-white/20 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-md shrink-0">
                    <card.icon className={`w-5 h-5 sm:w-7 sm:h-7 ${card.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm opacity-90 mb-1">{card.title}</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 lg:mb-8">
            {/* Recently Joined */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-800">Recently Joined ({filteredJoined.length})</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="hidden sm:grid grid-cols-3 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-1">Name</div>
                  <div className="flex items-center gap-1">Mobile</div>
                  <div className="flex items-center gap-1">Status</div>
                </div>
                
                {filteredJoined.length > 0 ? (
                  filteredJoined.map((person, index) => (
                    <div 
                      onClick={() => router.push("/admin/checkin-reports")} 
                      key={index} 
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start sm:items-center py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {person.avatar}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700 block">{person.name}</span>
                          <span className="text-xs text-gray-600 sm:hidden">{person.mobile}</span>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">{person.mobile}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">{person.status} • {person.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4 text-sm">No matches found</p>
                )}
              </div>
            </div>

            {/* Total Amount Breakdown */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-800">Revenue Breakdown</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
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
                      <p className="text-xl sm:text-2xl font-bold text-gray-800">₹{totalRevenue.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm text-gray-600">This Month</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Recent Check Outs */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-800">Recent Check Outs ({filteredCheckouts.length})</h2>
                <button 
                  onClick={() => router.push("/admin/checkout-reports")} 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 cursor-pointer bg-blue-500 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1"
                >
                  See all
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="hidden sm:grid grid-cols-3 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100">
                  <div>Name</div>
                  <div>Amount</div>
                  <div>Date</div>
                </div>
                
                {filteredCheckouts.length > 0 ? (
                  filteredCheckouts.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-start sm:items-center py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-linear-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {item.avatar}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 sm:block">{item.amount}</span>
                      <span className="text-xs sm:text-sm text-gray-600">{item.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4 text-sm">No matches found</p>
                )}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-800">Recent Transactions ({filteredTransactions.length})</h2>
                <button 
                  onClick={() => router.push("/admin/checkin-reports")} 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 cursor-pointer bg-blue-500 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1"
                >
                  See all
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="hidden sm:grid grid-cols-2 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100">
                  <div>Name</div>
                  <div className="text-right">Amount</div>
                </div>
                
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 items-center py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-linear-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0">
                          {item.name.split(' ')[0][0]}{item.name.split(' ')[1]?.[0] || ''}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-800 text-right">
                        {item.amount} <span className="text-xs text-gray-500 hidden sm:inline">({item.type})</span>
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4 text-sm">No matches found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}