import React, { useState, useEffect } from 'react';
import { Bell, Gift, Clock, ArrowRight, X, Megaphone, Star, Zap } from 'lucide-react';
import axios from 'axios';

const AdvertisementSection = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showNotice, setShowNotice] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const API_URL = 'http://localhost:8000/api/notifications/';

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
  try {
    setLoading(true);
    const res = await axios.get(API_URL);
    setNotifications(res.data);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    showSnackbar('Error loading notifications.', 'error');
  } finally {
    setLoading(false);
  }
};
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  

  const [advertisements, setAdvertisements] = useState([]);


  const currentAd = advertisements[currentAdIndex] || {};

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/advertisements/');
        const activeAds = res.data.filter(ad => ad.is_active);
        setAdvertisements(activeAds);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load advertisements', error);
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % advertisements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [advertisements.length]);



  if (loading || advertisements.length === 0) {
    return <div className="text-center py-10 text-gray-500">Loading advertisements...</div>;
  }

  return (
    <div className="w-full space-y-6 my-12">
      {/* Special Notices Bar */}
      {notifications.map((note) => (
        <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-xl shadow-lg">
          <div className="absolute inset-0 bg-black/5" />
          <div className="relative z-10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                  <Megaphone size={16} className="text-white" />
                </div>
                <div className="text-white">
                  <p className="font-semibold text-sm">{note.title}</p>
                  <p className="text-sm opacity-90">{note.content}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNotice(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-yellow-50 opacity-50" />
      
      {/* Advertisement Content */}
      <div className="relative z-10 grid md:grid-cols-2 gap-0">
        {/* Text Content */}
        <div className="p-8 flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            {currentAd.urgent && (
              <div className="inline-flex items-center space-x-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                <Zap size={14} />
                <span>Limited Time</span>
              </div>
            )}
            
            <h3 className="text-3xl font-bold text-gray-800">
              {currentAd.title}
            </h3>
            <p className="text-xl text-gray-600 font-medium">
              {currentAd.subtitle}
            </p>
            <p className="text-gray-500">
              {currentAd.description}
            </p>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            {currentAd.price && (
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-orange-600">
                  {currentAd.price}
                </span>
                {currentAd.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {currentAd.originalPrice}
                  </span>
                )}
              </div>
            )}
            
            {currentAd.discount && (
              <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                {currentAd.discount}
              </div>
            )}
          </div>

          {/* Action Button */}
          <button className={`inline-flex items-center space-x-2 bg-gradient-to-r ${currentAd.gradient || 'from-orange-400 to-red-400'} text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group w-fit`}>
            <span>Order Now</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Image */}
        <div className="relative h-64 md:h-auto">
          <img
            src={currentAd.image}
            alt={currentAd.title}
            className="w-full h-full object-cover"
          />

          <div className={`absolute inset-0 bg-gradient-to-t ${currentAd.gradient || 'from-orange-400 to-red-400'} opacity-20`} />
          
          {/* Floating Elements */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <Star className="text-yellow-500 fill-current" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {advertisements.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentAdIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentAdIndex 
                ? 'bg-orange-500 w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>

    </div>
  );
};

export default AdvertisementSection;