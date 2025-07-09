import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import axios from 'axios';
import Footer from '../components/Footer';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position);
    }
  }, [position, map]);
  return null;
}

const DeliveryMap = () => {
  const [deliveryPosition, setDeliveryPosition] = useState([6.71426, 80.78663]);

  useEffect(() => {
    const fetchDeliveryPosition = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/delivery-location/latest/');
        const { latitude, longitude } = res.data;
        setDeliveryPosition([latitude, longitude]);
      } catch (error) {
        console.error('Error fetching delivery location:', error);
      }
    };

    fetchDeliveryPosition();
    const interval = setInterval(fetchDeliveryPosition, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-orange-50 to-yellow-50 min-h-screen">
      {/* Header Card */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-2xl">📍</span>
          </div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Delivery Boy Location
          </h2>
        </div>
        <p className="text-gray-600 text-center mt-2 font-medium">Track your delivery in real-time</p>
      </div>

      {/* Map Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/30 hover:scale-[1.01] transition-all duration-500 group">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Gradient overlay for modern feel */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/10 to-transparent z-10 pointer-events-none"></div>
          
          <MapContainer
            center={deliveryPosition}
            zoom={15}
            scrollWheelZoom={true}
            className="h-[70vh] w-full rounded-2xl shadow-inner"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={deliveryPosition} />
            <Recenter position={deliveryPosition} />
          </MapContainer>
        </div>

        {/* Status Footer */}
        <div className="mt-4 flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
            <span className="text-blue-700 font-semibold">Location Updates</span>
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Refreshes every 10s
          </div>
        </div>
      </div>
    </div><Footer/></div>
  );
};

export default DeliveryMap;