import React from 'react';
import { Luggage, ShieldCheck, Clock, MapPin } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-orange-50 flex flex-col lg:flex-row">
      {/* Left side - Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-8 lg:px-16 py-12 lg:py-16">
        <div className="max-w-xl w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <ShieldCheck className="w-4 h-4" />
            Railway Authorized Service
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Store your Luggage{' '}
            <span className="text-orange-500">Safely</span> at the Railway Station
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
            Travel freely without carrying heavy bags. Secure, affordable and railway-authorized cloakroom service available 24/7.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mb-10">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">24/7 Available</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Fully Insured</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">All Major Stations</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
              <Luggage className="w-5 h-5" />
              Check-In Luggage
            </button>
            <button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-base sm:text-lg transition-all hover:shadow-md flex items-center justify-center gap-2">
              Check-Out Luggage
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">500+</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">Stations</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">1M+</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">Happy Users</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">4.9★</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Modern Image Grid */}
      <div className="hidden lg:flex lg:w-1/2 relative p-8 items-center justify-center max-h-175 mt-12">
        <div className="w-full h-full max-w-2xl max-h-7xl grid grid-cols-12 grid-rows-12 gap-4">
          {/* Large featured image - Top Left */}
          <div className="col-span-7 row-span-7 rounded-3xl overflow-hidden shadow-2xl group relative">
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img 
              src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80" 
              alt="Train station platform" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Top right - Medium */}
          <div className="col-span-5 row-span-4 rounded-2xl overflow-hidden shadow-xl group relative">
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img 
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80" 
              alt="Modern train" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Middle right - Small accent */}
          <div className="col-span-5 row-span-3 rounded-2xl overflow-hidden shadow-lg group relative">
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" 
              alt="Luggage storage" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Bottom left - Tall */}
          <div className="col-span-4 row-span-5 rounded-2xl overflow-hidden shadow-xl group relative">
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img 
              src="https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?w=500&q=80" 
              alt="Railway station entrance" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Bottom middle - Wide */}
          <div className="col-span-5 row-span-5 rounded-2xl overflow-hidden shadow-xl group relative">
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img 
              src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=700&q=80" 
              alt="Traveler with luggage" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Bottom right accent - Small */}
          <div className="col-span-3 row-span-5 rounded-2xl overflow-hidden shadow-lg group relative">
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent opacity-300"></div>
            <img 
              src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=400&q=80" 
              alt="Luggage detail" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-orange-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}