
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  Ambulance as AmbulanceIcon, 
  Plane, 
  Navigation,
  AlertTriangle,
} from 'lucide-react';
import { Ambulance, Helicopter, EvacuationPoint, Emergency } from '../types/emergency';
import { createDivIcon } from '../utils/mapUtils';

interface MapMarkersProps {
  ambulances: Ambulance[];
  helicopter: Helicopter | null;
  evacuationPoints: EvacuationPoint[];
  currentEmergency: Emergency | null;
  nearestEvacuationPoint: EvacuationPoint | null;
  isLayerVisible: (layerType: string) => boolean;
  getFilteredAmbulances: () => Ambulance[];
}

// Helper function to adjust ambulance positions to avoid overlap
const getAdjustedAmbulances = (ambulancesToAdjust: Ambulance[]) => {
  const ambulancesByLocation: Map<string, Ambulance[]> = new Map();

  ambulancesToAdjust.forEach(ambulance => {
    // Group ambulances by location, using toFixed to handle floating point inaccuracies
    const key = `${ambulance.lat.toFixed(5)},${ambulance.lng.toFixed(5)}`;
    if (!ambulancesByLocation.has(key)) {
      ambulancesByLocation.set(key, []);
    }
    ambulancesByLocation.get(key)!.push(ambulance);
  });

  const adjusted: (Ambulance & { renderLat: number; renderLng: number })[] = [];

  ambulancesByLocation.forEach(group => {
    if (group.length > 1) {
      // If multiple ambulances are at the same location, spread them in a circle
      const angleStep = (2 * Math.PI) / group.length;
      const offsetDistance = 0.00015; // ~16.5 meters offset

      group.forEach((ambulance, index) => {
        const angle = index * angleStep;
        const newLat = ambulance.lat + offsetDistance * Math.cos(angle);
        const newLng = ambulance.lng + offsetDistance * Math.sin(angle);
        
        adjusted.push({ ...ambulance, renderLat: newLat, renderLng: newLng });
      });
    } else {
      // If only one ambulance, use its original position
      const ambulance = group[0];
      adjusted.push({ ...ambulance, renderLat: ambulance.lat, renderLng: ambulance.lng });
    }
  });
  
  return adjusted;
};


export const MapMarkers: React.FC<MapMarkersProps> = ({
  ambulances,
  helicopter,
  evacuationPoints,
  currentEmergency,
  nearestEvacuationPoint,
  isLayerVisible,
  getFilteredAmbulances,
}) => {
  console.log('MapMarkers render:', {
    ambulancesCount: ambulances.length,
    helicopter: helicopter?.name,
    evacuationPointsCount: evacuationPoints.length,
    currentEmergency: currentEmergency?.id,
    visibleLayers: {
      ambulances: isLayerVisible('ambulances'),
      helicopter: isLayerVisible('helicopter'),
      evacuation_points: isLayerVisible('evacuation_points'),
      incidents: isLayerVisible('incidents')
    }
  });

  const getAmbulanceColor = (ambulance: Ambulance) => {
    if (!ambulance.available) return 'bg-gray-400';
    return ambulance.type === 'SVA' ? 'bg-red-500' : 'bg-green-500';
  };

  const filteredAmbulances = getFilteredAmbulances();
  const adjustedAmbulances = getAdjustedAmbulances(filteredAmbulances);

  return (
    <>
      {/* Ambulancias */}
      {isLayerVisible('ambulances') && adjustedAmbulances.map(ambulance => {
        return (
          <Marker 
            key={ambulance.id}
            position={[ambulance.renderLat, ambulance.renderLng]}
            icon={createDivIcon(
              <div className={`p-2 rounded-full ${getAmbulanceColor(ambulance)} shadow-lg border-2 border-white`}>
                <AmbulanceIcon className="h-5 w-5 text-white" />
              </div>
            )}
          >
            <Popup>
              <b>{ambulance.name}</b> ({ambulance.type})<br />
              Base: {ambulance.base}<br />
              Estado: {ambulance.available ? 'Disponible' : 'No disponible'}<br />
              <span className={`inline-block w-3 h-3 rounded-full mr-1 ${ambulance.type === 'SVA' ? 'bg-red-500' : 'bg-green-500'}`}></span>
              {ambulance.type === 'SVA' ? 'Soporte Vital Avanzado' : 'Soporte Vital Básico'}
            </Popup>
          </Marker>
        );
      })}

      {/* Helicóptero */}
      {isLayerVisible('helicopter') && helicopter && (
        <Marker 
          position={[helicopter.lat, helicopter.lng]}
          icon={createDivIcon(
            <div className={`p-2 rounded-full ${helicopter.available ? 'bg-blue-500' : 'bg-gray-400'} shadow-lg border-2 border-white`}>
              <Plane className="h-5 w-5 text-white" />
            </div>
          )}
        >
          <Popup>
            <b>{helicopter.name}</b><br />
            Base: {helicopter.base}<br />
            Estado: {helicopter.available ? 'Disponible' : 'No disponible'}
          </Popup>
        </Marker>
      )}

      {/* Puntos de evacuación */}
      {isLayerVisible('evacuation_points') && evacuationPoints.map(point => (
        <Marker 
          key={point.id}
          position={[point.lat, point.lng]}
          icon={createDivIcon(
            <div className={`p-2 rounded-full ${point.status === 'available' ? 'bg-orange-500' : 'bg-red-500'} shadow-lg border-2 border-white`}>
              <Navigation className="h-4 w-4 text-white" />
            </div>
          )}
        >
          <Popup>
            <b>{point.name}</b> ({point.locality})<br />
            Estado: {point.status === 'available' ? 'Disponible' : 'No disponible'}<br />
            <i>{point.description}</i>
          </Popup>
        </Marker>
      ))}

      {/* Emergencia actual */}
      {isLayerVisible('incidents') && currentEmergency && (
        <Marker 
          position={[currentEmergency.lat, currentEmergency.lng]}
          icon={createDivIcon(
            <div className="relative">
              <div className="p-3 rounded-full bg-red-600 shadow-lg animate-pulse-emergency border-2 border-white">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
        >
          <Popup>
            <b>EMERGENCIA ACTIVA</b><br />
            {currentEmergency.address}<br />
            Prioridad: {currentEmergency.priority.toUpperCase()}
          </Popup>
        </Marker>
      )}
      
      {/* Resaltado del punto de evacuación */}
      {nearestEvacuationPoint && (
         <Marker
            position={[nearestEvacuationPoint.lat, nearestEvacuationPoint.lng]}
            icon={L.divIcon({
                className: 'bg-transparent border-0',
                html: `<div class="rounded-full bg-yellow-400 animate-ping opacity-75" style="width:48px; height:48px; transform: translate(-12px, -24px);"></div>`
            })}
        />
      )}
    </>
  );
};
