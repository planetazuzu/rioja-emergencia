import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Ambulance, MapPinPlus, Download } from 'lucide-react';
import { MapLayers } from './MapLayers';
import { EmergencyInfo } from './EmergencyInfo';
import { ETAList } from './ETAList';
import { Emergency, EvacuationPoint, ETA, Ambulance as AmbulanceType, Helicopter, MapLayer } from '../types/emergency';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from "@/components/ui/sidebar";
interface MapControlsProps {
  currentEmergency: Emergency | null;
  nearestEvacuationPoint: EvacuationPoint | null;
  etas: ETA[];
  ambulances: AmbulanceType[];
  helicopter: Helicopter | null;
  mapLayers: MapLayer[];
  showFilters: boolean;
  ambulanceFilter: 'all' | 'SVB' | 'SVA' | 'available';
  onAddPointClick: () => void;
  onToggleLayer: (layerId: string) => void;
  onToggleFilters: () => void;
  onAmbulanceFilterChange: (filter: 'all' | 'SVB' | 'SVA' | 'available') => void;
  onAssignResource: (resourceId: string) => void;
  onClearEmergency: () => void;
  collapsible?: "icon" | "offcanvas" | "none";
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
  onClearEmergency,
  collapsible = "offcanvas"
}) => {
  const {
    isInstallable,
    installApp
  } = usePWAInstall();
  return <Sidebar collapsible={collapsible}>
      <SidebarHeader className="p-4 border-b">
        <h1 className="text-xl font-bold text-emergency-red flex items-center gap-2">
          <Ambulance className="h-6 w-6" />
          
          Emergencias La Rioja
        </h1>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel>Acciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2 px-2">
              <Button variant="outline" className="w-full" onClick={onAddPointClick}>
                <MapPinPlus className="h-4 w-4 mr-2" />
                Añadir Punto de Aterrizaje
              </Button>
              {isInstallable && <Button variant="outline" className="w-full" onClick={installApp}>
                  <Download className="h-4 w-4 mr-2" />
                  Instalar App
                </Button>}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Capas del Mapa</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2">
              <MapLayers mapLayers={mapLayers} showFilters={showFilters} ambulanceFilter={ambulanceFilter} onToggleLayer={onToggleLayer} onToggleFilters={onToggleFilters} onAmbulanceFilterChange={onAmbulanceFilterChange} />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-2 space-y-4">
          <EmergencyInfo currentEmergency={currentEmergency} nearestEvacuationPoint={nearestEvacuationPoint} onClearEmergency={onClearEmergency} />

          <ETAList etas={etas} ambulances={ambulances} helicopter={helicopter} onAssignResource={onAssignResource} assignedResources={currentEmergency?.assignedResources || []} />
        </div>
      </SidebarContent>
    </Sidebar>;
};