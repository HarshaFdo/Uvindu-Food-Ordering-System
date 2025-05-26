import React from 'react';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-2">Home</h3>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">About Us</h3>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Contact Us</h3>
            </div>
          </div>
          <p className="text-gray-400">Uvindu Food Cabin (PVT) Ltd.</p>
        </div>
      </footer>
  );
};

export default Footer;
