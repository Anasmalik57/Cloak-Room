"use client"
import React from 'react';
import Link from 'next/link';
import { Users, UserPlus, UserMinus, FileText, LogOut, Clock, Package } from 'lucide-react';
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
  const router = useRouter()
  const pathname = usePathname();

  return (
    <>
      <div className="w-64 fixed top-0 left-0 bg-linear-to-br from-blue-600 via-blue-600 to-blue-500 text-white flex flex-col h-screen print:hidden shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" />
            Cloak Room
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          {navSections.map((section, index) => (
            <div key={index} className="space-y-2">
              {/* Section Title */}
              {section.title === 'Dashboard' ? null : (
                <div className="flex items-center gap-3 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-100">
                  {/* <section.icon className="w-4 h-4" /> */}
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
        <div className="p-4 border-t border-white/20 mt-auto">
          <button onClick={()=> router.push("/")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 text-blue-100 hover:text-white">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-screen">
        {children}
      </div>
    </>
  );
}