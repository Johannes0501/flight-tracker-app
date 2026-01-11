import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom Plane Icon
const planeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/7893/7893979.png',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

function App() {
  const [flights, setFlights] = useState([]);

  const fetchFlights = async () => {
    try {
      const response = await axios.get('https://ft-api-g0.datastrøm.com/api/flights');
      if (response.data && response.data.data) {
        setFlights(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  useEffect(() => {
    fetchFlights();
    const interval = setInterval(fetchFlights, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={5} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {flights.map((flight) => (
        <Marker 
          key={flight.icao24} 
          position={[flight.latitude || 0, flight.longitude || 0]}
          icon={planeIcon}
        >
          <Popup>
            <strong>{flight.callsign || 'N/A'}</strong><br />
            Country: {flight.origin_country}<br />
            Alt: {flight.baro_altitude}m<br />
            Vel: {flight.velocity}m/s
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default App;
