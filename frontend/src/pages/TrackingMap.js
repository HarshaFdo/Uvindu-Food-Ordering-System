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

const TrackingMap = () => {
  const [position, setPosition] = useState([6.71426, 80.78663]);

  useEffect(() => {
    const sendPositionToBackend = async (coords) => {
      try {
        await axios.post('http://localhost:8000/api/delivery-location/update/', {
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      } catch (error) {
        console.error('Error sending location:', error);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = pos.coords;
        const newPos = [coords.latitude, coords.longitude];
        setPosition(newPos);
        sendPositionToBackend(coords);
      },
      (err) => {
        console.error('Geolocation error:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div>
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      {/* Header Card */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-2xl">🚴</span>
          </div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Live Delivery Tracking
          </h2>
        </div>
        <p className="text-gray-600 text-center mt-2 font-medium">Your order is on its way!</p>
      </div>

      {/* Map Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/30 hover:scale-[1.01] transition-all duration-500 group">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Gradient overlay for modern feel */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/10 to-transparent z-10 pointer-events-none"></div>
          
          <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom={true}
            className="h-[70vh] w-full rounded-2xl shadow-inner"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={position} />
            <Recenter position={position} />
          </MapContainer>
        </div>

        {/* Status Footer */}
        <div className="mt-4 flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
            <span className="text-green-700 font-semibold">Tracking Active</span>
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Updated in real-time
          </div>
        </div>
      </div>
      
    </div><Footer /></div>
  );
};

export default TrackingMap;