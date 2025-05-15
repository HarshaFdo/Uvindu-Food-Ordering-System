import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-gray-200 py-4 relative z-10">
        <div className="flex justify-center space-x-8 mb-2">
          <a href="/" className="hover:underline">Home</a>
          <a href="/about" className="hover:underline">About Us</a>
          <a href="/contact" className="hover:underline">Contact Us</a>
        </div>
        <div className="text-center text-gray-600 text-sm">
          Uvindu Food Cabin (PVT) Ltd.
        </div>
</footer>
  );
};

export default Footer;
