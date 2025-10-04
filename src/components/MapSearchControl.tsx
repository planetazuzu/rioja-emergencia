
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';
import { Search } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// Hack para que los tipos de leaflet-geosearch funcionen correctamente.
const searchControl = (props: any) => new (GeoSearchControl as any)(props);

const geosearchStyles = `
  .leaflet-control-geosearch.bar {
    border: 1px solid hsl(var(--input));
    border-radius: var(--radius);
    background-color: hsl(var(--background));
    height: 40px;
    box-shadow: none;
    display: flex;
    align-items: center;
    margin-top: 10px;
    margin-left: 10px;
    z-index: 1001;
  }
  .leaflet-control-geosearch.bar .glass {
    border: none;
    border-radius: var(--radius) 0 0 var(--radius);
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .leaflet-control-geosearch.bar .glass .geosearch-icon {
    width: 100%;
    height: 100%;
    background-image: none; /* Eliminar icono por defecto */
  }
  .leaflet-control-geosearch.bar form {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .leaflet-control-geosearch.bar form input {
    height: 100%;
    width: 180px;
    padding: 0 8px;
    border: none;
    background-color: transparent;
    color: hsl(var(--foreground));
    font-size: 0.875rem; /* text-sm */
    outline: none;
  }
  .leaflet-control-geosearch.bar form input::placeholder {
    color: hsl(var(--muted-foreground));
  }
  .leaflet-control-geosearch .results {
    background-color: hsl(var(--popover));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); /* shadow-md */
    margin-top: 4px;
    margin-left: 10px;
    z-index: 1001;
  }
  .leaflet-control-geosearch .results > * {
    padding: 8px 12px;
    border-bottom: 1px solid hsl(var(--border));
    color: hsl(var(--popover-foreground));
    cursor: pointer;
  }
  .leaflet-control-geosearch .results > *:last-child {
    border-bottom: none;
  }
  .leaflet-control-geosearch .results > *:hover {
    background-color: hsl(var(--accent));
  }
  .leaflet-control-geosearch .results .active {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
`;

const MapSearchControl = () => {
  const map = useMap();

  useEffect(() => {
    // Inyectar estilos para el buscador en el <head> del documento
    const styleElement = document.createElement('style');
    styleElement.innerHTML = geosearchStyles;
    document.head.appendChild(styleElement);

    const provider = new OpenStreetMapProvider();

    const searchIconHTML = renderToString(
        <Search className="h-5 w-5 text-muted-foreground" />
    );

    const control = searchControl({
      provider: provider,
      style: 'bar',
      showMarker: true,
      showPopup: false,
      marker: {
        icon: new L.Icon.Default(),
        draggable: false,
      },
      searchLabel: 'Buscar dirección...',
      keepResult: true,
      autoClose: true,
    });

    map.addControl(control);

    // Reemplazar el icono de lupa por defecto con un icono de Lucide
    const glassEl = document.querySelector('.leaflet-control-geosearch.bar .glass .geosearch-icon');
    if (glassEl) {
      glassEl.innerHTML = searchIconHTML;
    }

    return () => {
      map.removeControl(control);
      document.head.removeChild(styleElement);
    };
  }, [map]);

  return null;
};

export default MapSearchControl;

