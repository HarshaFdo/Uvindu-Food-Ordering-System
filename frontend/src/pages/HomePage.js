import React, { useEffect, useState } from 'react';
import { ChefHat, Clock, Star, ArrowRight, Utensils, Heart } from 'lucide-react';
import axios from 'axios';
import Footer from '../components/Footer';
import AdvertisementSection from '../components/AdvertisementSection';
const API_URL = "http://127.0.0.1:8000/api/meals/";


export default function HomePage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [addmeals, setAddMeals] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    const res = await axios.get('http://localhost:8000/api/additional-meals/');
    setAddMeals(res.data);
  };

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setMeals(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch meals:", err);
        setLoading(false);
      });

    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main diagonal gradient */}
        <div 
          className="absolute w-full h-96 bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-200 opacity-80 transform -skew-y-12 origin-top-left animate-pulse"
          style={{
            top: '-100px',
            left: '-50px',
            animationDuration: '4s'
          }}
        />
        
        {/* Floating food icons */}
        <div className="absolute top-20 right-20 text-orange-200 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <ChefHat size={40} />
        </div>
        <div className="absolute top-40 left-1/4 text-yellow-200 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
          <Utensils size={30} />
        </div>
        <div className="absolute bottom-40 right-1/3 text-orange-200 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}>
          <Heart size={25} />
        </div>
      </div>

      {/* Header with glass morphism */}
      <header className={`relative z-20 backdrop-blur-md bg-white/70 border-b border-white/20 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="flex justify-between items-center px-8 py-4">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <ChefHat className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Uvindu Food Cabin
            </span>
          </div>
          <a href="/register">
            <button className="relative px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group overflow-hidden">
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-orange-100 rounded-full px-4 py-2 text-orange-600 font-medium">
                  <Star className="fill-current" size={16} />
                  <span>Premium Quality Food</span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                  <span className="block bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">
                    Uvindu
                  </span>
                  <span className="block bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Food
                  </span>
                  <span className="block bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                    Cabin
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Experience authentic flavors crafted with love, delivered fresh to your doorstep around University of Sabaragamuwa.
                </p>
              </div>

              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock size={20} className="text-orange-500" />
                  <span className="font-medium">Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <ChefHat size={20} className="text-green-500" />
                  <span className="font-medium">Fresh Made</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className={`relative transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&crop=center"
                  alt="Uvindu Food Cabin Restaurant"
                  className="relative rounded-3xl shadow-2xl w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className={`text-center mb-12 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Our Delicious Menu
            </h2>
            <p className="text-gray-600 text-lg">Freshly prepared with authentic flavors</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
              </div>
              <span className="ml-4 text-gray-600 font-medium">Loading delicious menu...</span>
            </div>
          ) : meals.filter(item => item.availability).length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Utensils size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-xl">No available meals at the moment</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {meals
                .filter(item => item.availability)
                .map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-white/20 transform hover:-translate-y-2 transition-all duration-500 cursor-pointer ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: `${800 + index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      {item.image && (
                        <div className="relative mb-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-full mx-auto shadow-lg ring-4 ring-white group-hover:ring-orange-200 transition-all duration-300"
                          />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center space-y-3">
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                          {item.name}
                        </h3>
                        
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Full:</span>
                            <span className="font-semibold text-orange-600">Rs. {item.full_price}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Half:</span>
                            <span className="font-semibold text-orange-600">Rs. {item.half_price}</span>
                          </div>
                        </div>
                        <a href='/register'>
                        <button className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-medium py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          Add to Cart
                        </button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Menu Grid */}
        <div className="max-w-6xl mx-auto px-8 py-0">
          <div className={`text-center mb-12 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Additional Meals
            </h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
              </div>
              <span className="ml-4 text-gray-600 font-medium">Loading delicious menu...</span>
            </div>
          ) : addmeals.filter(item => item.availability).length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Utensils size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-xl">No available meals at the moment</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {addmeals
                .filter(item => item.availability)
                .map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-white/20 transform hover:-translate-y-2 transition-all duration-500 cursor-pointer ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: `${800 + index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      {item.image && (
                        <div className="relative mb-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-full mx-auto shadow-lg ring-4 ring-white group-hover:ring-orange-200 transition-all duration-300"
                          />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center space-y-3">
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                          {item.name}
                        </h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-orange-600">Rs. {item.price}</span>
                          </div>
                        </div>
                        <a href='/register'>
                        <button className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-medium py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          Add to Cart
                        </button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-8 py-0">
          <AdvertisementSection />
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 p-8 text-center shadow-2xl transition-all duration-1000 delay-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Place Your <span className="text-yellow-200">Order</span> With <span className="text-green-200">Us</span>
              </h2>
              <p className="text-white/90 text-lg font-medium">
                🚚 Free Delivery Around University of Sabaragamuwa
              </p>
              <a href='/register'>
              <button className="inline-flex items-center space-x-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group">
                <span>Order Now</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button></a>
            </div>
          </div>
        </div>

        
      </main>

      <Footer />
      
    </div>
  );
}