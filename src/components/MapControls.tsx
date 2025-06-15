
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPinPlus, Download } from 'lucide-react';
import { MapLayers } from './MapLayers';
import { EmergencyInfo } from './EmergencyInfo';
import { ETAList } from './ETAList';
import { Emergency, EvacuationPoint, ETA, Ambulance, Helicopter, MapLayer } from '../types/emergency';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MapControlsProps {
  currentEmergency: Emergency | null;
  nearestEvacuationPoint: EvacuationPoint | null;
  etas: ETA[];
  ambulances: Ambulance[];
  helicopter: Helicopter | null;
  mapLayers: MapLayer[];
  showFilters: boolean;
  ambulanceFilter: 'all' | 'SVB' | 'SVA' | 'available';
  onAddPointClick: () => void;
  onToggleLayer: (layerId: string) => void;
  onToggleFilters: () => void;
  onAmbulanceFilterChange: (filter: 'all' | 'SVB' | 'SVA' | 'available') => void;
  onAssignResource: (resourceId: string) => void;
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
  onAssignResource,
}) => {
  const { isInstallable, installApp } = usePWAInstall();

  return (
    <div className="w-full lg:w-96 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-emergency-red flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          Emergencias La Rioja
        </h1>
      </div>

      <Accordion type="multiple" defaultValue={['acciones', 'capas']} className="w-full">
        <AccordionItem value="acciones" className="border-b">
          <AccordionTrigger className="px-4 text-base font-semibold text-gray-800 hover:no-underline">
            Acciones
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={onAddPointClick}
              >
                <MapPinPlus className="h-4 w-4 mr-2" />
                Añadir Punto de Aterrizaje
              </Button>
              {isInstallable && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={installApp}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Instalar App
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="capas" className="border-b">
          <AccordionTrigger className="px-4 text-base font-semibold text-gray-800 hover:no-underline">
            Capas del Mapa
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <MapLayers
              mapLayers={mapLayers}
              showFilters={showFilters}
              ambulanceFilter={ambulanceFilter}
              onToggleLayer={onToggleLayer}
              onToggleFilters={onToggleFilters}
              onAmbulanceFilterChange={onAmbulanceFilterChange}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Información de emergencia */}
      <EmergencyInfo
        currentEmergency={currentEmergency}
        nearestEvacuationPoint={nearestEvacuationPoint}
      />

      <ETAList
        etas={etas}
        ambulances={ambulances}
        helicopter={helicopter}
        onAssignResource={onAssignResource}
        assignedResources={currentEmergency?.assignedResources || []}
      />
    </div>
  );
};
