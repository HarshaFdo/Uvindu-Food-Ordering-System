import React, { useState, useEffect } from 'react';
import { Bell, Gift, Clock, ArrowRight, X, Megaphone, Star, Zap } from 'lucide-react';

const AdvertisementSection = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showNotice, setShowNotice] = useState(true);

  // Sample advertisements data - you can replace with API data
  const advertisements = [
    {
      id: 1,
      type: 'special',
      title: '🍛 Today\'s Special!',
      subtitle: 'Chicken Biriyani with Free Drink',
      description: 'Limited time offer - Only 50 portions available',
      price: 'Rs. 450.00',
      originalPrice: 'Rs. 550.00',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d6?w=300&h=200&fit=crop',
      gradient: 'from-red-500 to-orange-500',
      urgent: true
    },
    {
      id: 2,
      type: 'offer',
      title: '🎉 Weekend Special',
      subtitle: 'Buy 2 Get 1 Free',
      description: 'Valid for all rice dishes this weekend',
      discount: '33% OFF',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=200&fit=crop',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      id: 3,
      type: 'new',
      title: '✨ New Addition',
      subtitle: 'Kottu Roti Now Available',
      description: 'Authentic Sri Lankan street food experience',
      price: 'Starting Rs. 200.00',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  // Special notices data
  const notices = [
    {
      id: 1,
      type: 'urgent',
      icon: Bell,
      message: 'Delivery service temporarily unavailable in Block C due to maintenance',
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      id: 2,
      type: 'info',
      icon: Clock,
      message: 'Extended hours: Now open until 10 PM on weekdays!',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    }
  ];

  // Auto-rotate advertisements
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % advertisements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [advertisements.length]);

  const currentAd = advertisements[currentAdIndex];

  return (
    <div className="w-full space-y-6 my-12">
      {/* Special Notices Bar */}
      {showNotice && notices.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-xl shadow-lg">
          <div className="absolute inset-0 bg-black/5" />
          <div className="relative z-10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                  <Megaphone size={16} className="text-white" />
                </div>
                <div className="text-white">
                  <p className="font-semibold text-sm">Important Notice</p>
                  <p className="text-sm opacity-90">{notices[0].message}</p>
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
      )}

      {/* Main Advertisement Carousel */}
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
            <button className={`inline-flex items-center space-x-2 bg-gradient-to-r ${currentAd.gradient} text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group w-fit`}>
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
            <div className={`absolute inset-0 bg-gradient-to-t ${currentAd.gradient} opacity-20`} />
            
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