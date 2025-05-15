import React from 'react';
import HeroImg from '../assets/hero.jpg';
import Footer from '../components/Footer';

const menuItems = [
  {
    name: "Fried Rice",
    priceFull: "330.00",
    priceHalf: "230.00",
    image: "/images/fried_rice.jpg",
  },
  {
    name: "Rice & Curry",
    priceFull: "320.00",
    priceHalf: "230.00",
    image: "/images/rice_curry.jpg",
  },
  {
    name: "Sea Food",
    priceFull: "330.00",
    priceHalf: "230.00",
    image: "/images/sea_food.jpg",
  },
  {
    name: "Kotthu",
    priceFull: "330.00",
    priceHalf: "230.00",
    image: "/images/kotthu.jpg",
  },
  {
    name: "Mixed Rice",
    priceFull: "330.00",
    priceHalf: "230.00",
    image: "/images/mixed_rice.jpg",
  },
  {
    name: "Chicken Curry",
    price: "100.00",
    image: "/images/chicken_curry.jpg",
  },
  {
    name: "Boiled Egg",
    price: "100.00",
    image: "/images/boiled_egg.jpg",
  },
  {
    name: "Fish Curry",
    price: "100.00",
    image: "/images/fish_curry.jpg",
  },
  {
    name: "Fried Chicken",
    price: "100.00",
    image: "/images/fried_chicken.jpg",
  },
  {
    name: "Fried Egg",
    price: "100.00",
    image: "/images/fried_egg.jpg",
  },
  {
    name: "Fried Fish",
    price: "100.00",
    image: "/images/fried_fish.jpg",
  },
  {
    name: "Develed Chicken",
    price: "100.00",
    image: "/images/develed_chicken.jpg",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-x-hidden">
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
    
      <header className="relative z-10 flex justify-between items-center px-8 pt-8">
        <div className="font-bold text-lg">[Uvindu Logo]</div>
        <div>
          <a href="/register" className="mr-4 text-gray-700">register</a>
          <button className="bg-yellow-200 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded shadow">
            Sign In
          </button>
        </div>
      </header>

      
      <main className="relative z-10 flex flex-col items-center justify-center w-full mt-4">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl">
          
          <div className="flex-1 flex flex-col items-center md:items-start">
            <h1 className="text-6xl md:text-7xl font-extrabold leading-tight text-black mb-4 text-center md:text-left drop-shadow-md">
              Uvindu<br />Food<br />Cabin
            </h1>
          </div>
          
          <div className="flex-1 flex justify-center mb-4 md:mb-0">
            <img
              src={HeroImg} alt="restaurant"
              className="rounded-xl w-full max-w-md shadow-lg"
            />
          </div>
        </div>

        
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
          {menuItems.map((item, idx) => (
            <div key={idx} className="flex items-center bg-green-100 rounded-xl p-3 shadow hover:shadow-lg transition">
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 object-cover rounded-full mr-4 border-2 border-white"
              />
              <div>
                <div className="font-semibold">{item.name}</div>
                {item.priceFull ? (
                  <div className="text-xs text-gray-700">
                    Price<br />
                    Full: {item.priceFull}<br />
                    Half: {item.priceHalf}
                  </div>
                ) : (
                  <div className="text-xs text-gray-700">
                    Price<br />
                    {item.price}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        
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
