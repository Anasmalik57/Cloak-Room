"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Assuming Next.js App Router; adjust if Pages Router
import { User, Lock, LogIn, Fingerprint } from 'lucide-react';
import { showToast } from 'nextjs-toast-notify';

const images = [
  { colSpan: 7, rowSpan: 7, rounded: '3xl', shadow: '2xl', src: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80', alt: 'Train station platform' },
  { colSpan: 5, rowSpan: 4, rounded: '2xl', shadow: 'xl', src: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', alt: 'Modern train' },
  { colSpan: 5, rowSpan: 3, rounded: '2xl', shadow: 'lg', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', alt: 'Luggage storage' },
  { colSpan: 4, rowSpan: 5, rounded: '2xl', shadow: 'xl', src: 'https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?w=500&q=80', alt: 'Railway station entrance' },
  { colSpan: 5, rowSpan: 5, rounded: '2xl', shadow: 'xl', src: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=700&q=80', alt: 'Traveler with luggage' },
  { colSpan: 3, rowSpan: 5, rounded: '2xl', shadow: 'lg', src: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=400&q=80', alt: 'Luggage detail' },
];

const formFields = [
  { name: 'username', type: 'text', icon: User, placeholder: 'admin@mail.com', label: 'Email Address' },
  { name: 'password', type: 'password', icon: Lock, placeholder: 'Enter your password', label: 'Password' },
];

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.username === 'admin@mail.com' && formData.password === 'adminpass@57') {
      // alert('Login Successful!');
      showToast.success("Login Successful!", {
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceInDown",
        icon: '',
        sound: true,
      });
      router.push('/admin/dashboard');
    } else {
      // alert('Invalid Email or Password');
      showToast.error("Invalid Email or Password", {
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceInDown",
        icon: '',
        sound: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-orange-50 flex">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Fingerprint className="w-4 h-4" />
              Secure Admin Access
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
              Admin <span className="text-orange-500">Login</span>
            </h1>
            <p className="text-gray-600 text-base">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <div>
              {/* Form Fields */}
              {formFields.map((field, index) => (
                <div key={field.name} className={`mb-${index === 0 ? '6' : '8'}`}>
                  <label className="block text-gray-800 font-semibold mb-2 text-sm">
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <field.icon className="w-5 h-5" />
                    </div>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white text-gray-900 transition-all placeholder:text-gray-400"
                      placeholder={field.placeholder}
                    />
                  </div>
                </div>
              ))}

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 group"
              >
                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Login to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Modern Image Grid */}
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