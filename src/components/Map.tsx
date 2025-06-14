
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const DEFAULT_CENTER: [number, number] = [-2.445, 42.4627]; // La Rioja, España

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState(localStorage.getItem('MAPBOX_TOKEN') || '');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!token || !mapContainer.current) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: DEFAULT_CENTER,
      zoom: 9.3,
      pitch: 0,
      attributionControl: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    setShowError(false);

    return () => {
      map.current?.remove();
    };
    // Solo al token/cambio inicial
    // eslint-disable-next-line
  }, [token]);

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
      {!token && (
        <div className="absolute inset-0 z-20 bg-white/90 flex flex-col items-center justify-center p-6">
          <div className="max-w-xs w-full text-center">
            <h2 className="text-lg font-bold mb-2">Mapbox Public Token</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Introduce tu Mapbox Public Token.<br />
              Puedes conseguirlo gratis en <a href="https://mapbox.com/" target="_blank" rel="noopener" className="underline text-blue-700">mapbox.com</a>.<br />
              Ve al dashboard &gt; Tokens &gt; copia el Public.</p>
            <input 
              type="text" 
              value={token} 
              onChange={e => setToken(e.target.value)} 
              placeholder="pk.eyJ...TuTokenAquí" 
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <button 
              onClick={handleSaveToken}
              className="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
            >
              Guardar y recargar mapa
            </button>
            {showError && (
              <div className="mt-2 text-red-600 text-sm">
                El token parece inválido.
              </div>
            )}
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-3 left-4 bg-white/80 px-3 py-1 rounded text-xs shadow text-gray-700 z-10">
        {token
          ? 'Arrastra o haz zoom para explorar La Rioja'
          : 'Introduce tu token para ver el mapa'}
      </div>
    </div>
  );
};

export default Map;
