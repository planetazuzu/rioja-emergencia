
import React from 'react';
import { useMapEvents } from 'react-leaflet';

interface MapClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
}

export const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      // Evita crear una emergencia si se hace clic en un marcador o popup existente
      if ((e.originalEvent.target as HTMLElement).closest('.leaflet-marker-icon, .leaflet-popup-content')) {
        return;
      }
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};
