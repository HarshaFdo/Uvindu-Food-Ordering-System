import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeroImg from '../assets/hero.jpg';
import Footer from '../components/Footer';

const API_URL = "http://127.0.0.1:8000/api/meals/";

export default function HomePage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-x-hidden">
      {/* Orange Diagonal Background */}
      <div
        className="absolute"
        style={{
          top: "-100px",
          left: 0,
          width: "100%",
          height: "300px",
          background: "#f9b072",
          transform: "skewY(-30deg)",
          zIndex: 0,
        }}
      ></div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-8 pt-8">
        <div className="font-bold text-lg">[Uvindu Logo]</div>
        <a href="/register">
          <button className="bg-yellow-200 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded shadow">
            Sign In
          </button>
        </a>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full mt-4">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl px-2">
          <div className="flex-1 flex flex-col items-center md:items-start md:ml-14"> {/* added md:ml-8 to push text right */}
            <h1 className="text-6xl md:text-7xl font-extrabold leading-tight text-black mb-2 text-center md:text-left drop-shadow-md">
              Uvindu<br />Food<br />Cabin
            </h1>
          </div>
          <div className="flex-1 flex justify-center -ml-28 md:-ml-40">
            <img
              src={HeroImg}
              alt="restaurant"
              className="rounded-xl w-full max-w-md shadow-lg"
            />
          </div>
        </div>
        
        {/* Meals Grid */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
          {loading ? (
            <div className="col-span-full text-center py-4">Loading menu...</div>
          ) : meals.filter(item => item.availability).length === 0 ? (
            <div className="col-span-full text-center py-4">No available meals</div>
          ) : (
            meals
              .filter(item => item.availability)
              .map((item) => (
                <div key={item.id} className="flex items-center bg-green-100 rounded-xl p-3 shadow hover:shadow-lg transition">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-full mr-4 border-2 border-white"
                    />
                  )}
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-700">
                      Price<br />
                      Full: {item.full_price}<br />
                      Half: {item.half_price}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>


        {/* Order Banner */}
        <div className="mt-10 w-full bg-white bg-opacity-90 text-center py-6 rounded-lg shadow relative z-10 max-w-3xl">
          <div className="text-2xl font-bold">
            Place Your <span className="text-orange-500">Order</span> With <span className="text-green-600">Us</span>
          </div>
          <div className="text-gray-700 mt-1">
            Free Delivery Around University of Sabaragamuwa
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
