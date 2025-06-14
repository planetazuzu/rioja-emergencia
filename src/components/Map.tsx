import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Centro de La Rioja (España)
const DEFAULT_CENTER: [number, number] = [42.4627, -2.445];
const DEFAULT_ZOOM = 9.3;

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState(localStorage.getItem('MAPBOX_TOKEN') || '');
  const [showError, setShowError] = useState(false);

  const handleSaveToken = () => {
    if (token && token.length > 20) {
      localStorage.setItem('MAPBOX_TOKEN', token);
      setShowError(false);
      window.location.reload();
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="relative w-full h-[500px] max-h-[70vh] rounded-lg border overflow-hidden bg-gray-100 flex flex-col">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        {/* Aquí se pueden añadir marcadores, círculos, capas, etc */}
      </MapContainer>
      <div className="absolute top-3 left-4 bg-white/80 px-3 py-1 rounded text-xs shadow text-gray-700 z-10">
        Arrastra o haz zoom para explorar La Rioja
      </div>
    </div>
  );
};

export default Map;
