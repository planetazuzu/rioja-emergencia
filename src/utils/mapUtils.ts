
import L from 'leaflet';
import { renderToString } from 'react-dom/server';

// Función para crear iconos personalizados para el mapa
export const createDivIcon = (iconComponent: React.ReactNode) => {
  const iconHTML = renderToString(iconComponent);
  console.log('Creating div icon with HTML:', iconHTML);
  
  return L.divIcon({
    html: iconHTML,
    className: '', // Usar la clase por defecto de Leaflet para mayor compatibilidad
    iconSize: [36, 36],
    iconAnchor: [18, 36], // La punta del marcador estará en la coordenada
  });
};

// Fix para los iconos por defecto de Leaflet
export const initializeLeafletIcons = () => {
  console.log('Initializing Leaflet icons...');
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};
