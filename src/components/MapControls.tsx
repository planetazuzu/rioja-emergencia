
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPinPlus } from 'lucide-react';
import { MapLayers } from './MapLayers';
import { EmergencyInfo } from './EmergencyInfo';
import { ETAList } from './ETAList';
import { Emergency, EvacuationPoint, ETA, Ambulance, Helicopter, MapLayer } from '../types/emergency';

interface MapControlsProps {
  currentEmergency: Emergency | null;
  nearestEvacuationPoint: EvacuationPoint | null;
  etas: ETA[];
  ambulances: Ambulance[];
  helicopter: Helicopter;
  mapLayers: MapLayer[];
  showFilters: boolean;
  ambulanceFilter: 'all' | 'SVB' | 'SVA' | 'available';
  onAddPointClick: () => void;
  onToggleLayer: (layerId: string) => void;
  onToggleFilters: () => void;
  onAmbulanceFilterChange: (filter: 'all' | 'SVB' | 'SVA' | 'available') => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  currentEmergency,
  nearestEvacuationPoint,
  etas,
  ambulances,
  helicopter,
  mapLayers,
  showFilters,
  ambulanceFilter,
  onAddPointClick,
  onToggleLayer,
  onToggleFilters,
  onAmbulanceFilterChange,
}) => {
  return (
    <div className="w-full lg:w-96 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-emergency-red flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          Emergencias La Rioja
        </h1>
      </div>

      {/* Acciones */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800 mb-3">Acciones</h2>
        <Button
          variant="outline"
          className="w-full"
          onClick={onAddPointClick}
        >
          <MapPinPlus className="h-4 w-4 mr-2" />
          Añadir Punto de Aterrizaje
        </Button>
      </div>

      {/* Controles de capas */}
      <MapLayers
        mapLayers={mapLayers}
        showFilters={showFilters}
        ambulanceFilter={ambulanceFilter}
        onToggleLayer={onToggleLayer}
        onToggleFilters={onToggleFilters}
        onAmbulanceFilterChange={onAmbulanceFilterChange}
      />

      {/* Información de emergencia */}
      <EmergencyInfo
        currentEmergency={currentEmergency}
        nearestEvacuationPoint={nearestEvacuationPoint}
      />

      {/* ETAs */}
      <ETAList
        etas={etas}
        ambulances={ambulances}
        helicopter={helicopter}
      />
    </div>
  );
};
