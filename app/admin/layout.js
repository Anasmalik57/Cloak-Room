"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { Users, UserPlus, UserMinus, FileText, LogOut, Clock, Package, Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const navSections = [
  {
    title: 'Dashboard',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: Clock }
    ]
  },
  {
    title: 'Customers',
    items: [
      { name: 'Check in Customer', href: '/admin/checkinCustomer', icon: UserPlus },
      { name: 'Check out Customers', href: '/admin/checkoutCustomer', icon: UserMinus }
    ]
  },
  {
    title: 'Reports',
    items: [
      { name: 'Check in Reports', href: '/admin/checkin-reports', icon: FileText },
      { name: 'Check out Reports', href: '/admin/checkout-reports', icon: FileText }
    ]
  }
];

export default function AdminSidebar({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get all navigation items flattened
  const allNavItems = navSections.flatMap(section => section.items);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 fixed top-0 left-0 bg-linear-to-br from-blue-600 via-blue-600 to-blue-500 text-white flex-col h-screen print:hidden shadow-xl z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" />
            Cloak Room
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto h-[calc(100vh-180px)]">
          {navSections.map((section, index) => (
            <div key={index} className="space-y-2">
              {/* Section Title */}
              {section.title === 'Dashboard' ? null : (
                <div className="flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-100">
                  {section.title}
                </div>
              )}
              {/* Section Items */}
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-white/20 backdrop-blur-sm text-white shadow-md scale-105'
                      : 'hover:bg-white/10 text-blue-100 hover:text-white hover:shadow-md hover:scale-[1.02]'
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/20 mt-auto absolute bottom-0 left-0 right-0 bg-linear-to-br from-blue-600 via-blue-600 to-blue-500">
          <button 
            onClick={() => router.push("/")} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 text-blue-100 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>

      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-linear-to-r from-blue-600 to-blue-500 text-white z-50 shadow-lg print:hidden">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Package className="w-5 h-5" />
            Cloak Room
          </h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 print:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="fixed top-16 left-0 right-0 bg-linear-to-br from-blue-600 via-blue-600 to-blue-500 text-white max-h-[calc(100vh-8rem)] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="p-4 space-y-4">
              {navSections.map((section, index) => (
                <div key={index} className="space-y-2">
                  {section.title === 'Dashboard' ? null : (
                    <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-100">
                      {section.title}
                    </div>
                  )}
                  {section.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        pathname === item.href
                          ? 'bg-white/20 backdrop-blur-sm text-white shadow-md'
                          : 'hover:bg-white/10 text-blue-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
              ))}
              <div className="pt-4 border-t border-white/20">
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/");
                  }} 
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 text-blue-100"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Log out</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-linear-to-r from-blue-600 to-blue-500 text-white z-50 shadow-lg print:hidden border-t border-white/20">
        <div className="flex items-center justify-around px-2 py-3">
          {allNavItems.slice(0, 4).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                pathname === item.href
                  ? 'bg-white/20 text-white scale-105'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="text-[10px] font-medium text-center leading-tight max-w-[60px]">
                {item.name.split(' ').slice(0, 2).join(' ')}
              </span>
            </Link>
          ))}
          <button
            onClick={() => router.push("/")}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 text-blue-100 hover:bg-white/10"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen pt-16 pb-20 lg:pt-0 lg:pb-0">
        <div className="min-h-screen">
          {children}
        </div>
      </div>
    </>
  );
}