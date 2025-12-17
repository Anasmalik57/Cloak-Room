"use client";
import { Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav
      className={`bg-white shadow-sm ${
        pathname.startsWith("/admin") ? "hidden" : ""
      }  `}
    >
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Package className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-gray-900">Cloak Room</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-orange-500 font-semibold text-lg hover:text-orange-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/luggage/check-in"
              className="text-gray-900 font-semibold text-lg hover:text-orange-500 transition-colors"
            >
              Check-In
            </Link>
            <Link
              href="/luggage/check-out"
              className="text-gray-900 font-semibold text-lg hover:text-orange-500 transition-colors"
            >
              Check-Out
            </Link>
          </div>

          {/* Contact Button */}
          <Link
            href="/auth/login"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors shadow-md"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
