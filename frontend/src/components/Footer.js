import React from 'react';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-8">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left Side - Contact Info & Links */}
          <div className="space-y-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Uvindu Food Cabin
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Serving authentic Sri Lankan cuisine with love and tradition. 
                Your favorite meals, delivered fresh to your doorstep.
              </p>
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-orange-400 mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/menu" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      Menu
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      About Us
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-lg text-orange-400 mb-4">Services</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/delivery" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      Delivery
                    </a>
                  </li>
                  <li>
                    <a href="/catering" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      Catering
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-lg text-orange-400 mb-4">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Phone size={16} className="text-orange-400" />
                    <span className="text-sm">+94 XX XXX XXXX</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Mail size={16} className="text-orange-400" />
                    <span className="text-sm">info@uvindufood.lk</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Clock size={16} className="text-orange-400" />
                    <span className="text-sm">7 AM - 10 PM Daily</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Google Map */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="text-orange-400" size={24} />
              <h3 className="font-bold text-xl text-white">Find Us Here</h3>
            </div>
            
            <div className="relative group">
              {/* Map Container with Modern Styling */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent z-10 pointer-events-none"></div>
                <iframe 
                  width="100%" 
                  height="400" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0" 
                  src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=Uvindu%20food+(Uvindu)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                  className="w-full h-full rounded-2xl transition-all duration-500 group-hover:scale-105"
                  title="Uvindu Food Cabin Location"
                />
              </div>
              
              {/* Location Badge */}
              <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-800 font-medium text-sm">We're Here!</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700">
              <p className="text-gray-300 text-center">
                <MapPin className="inline mr-2 text-orange-400" size={16} />
                Near University of Sabaragamuwa, Belihuloya
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-center md:text-left">
              <p>&copy; 2024 Uvindu Food Cabin (PVT) Ltd. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Delivery Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-orange-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-orange-300 font-medium">🚚 Free Delivery Around University of Sabaragamuwa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;