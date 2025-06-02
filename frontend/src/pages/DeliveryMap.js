import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import axios from 'axios';

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
  const [deliveryPosition, setDeliveryPosition] = useState([6.71426, 80.78663]); // Default if no data

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

    const interval = setInterval(fetchDeliveryPosition, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '1rem', maxWidth: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ textAlign: 'center', fontSize: '1.4rem', marginBottom: '1rem' }}>
        📍 Delivery Boy Location
      </h2>
      <div
        style={{
          width: '100%',
          height: '60vh',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <MapContainer
          center={deliveryPosition}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={deliveryPosition} />
          <Recenter position={deliveryPosition} />
        </MapContainer>
      </div>
    </div>
  );
};

export default DeliveryMap;
