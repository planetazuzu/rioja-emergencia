
import React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { AddEvacuationPointDialog } from './AddEvacuationPointDialog';
import { MapControls } from './MapControls';
import { MapMarkers } from './MapMarkers';
import { MapClickHandler } from './MapClickHandler';
import MapRoutes from './MapRoutes';
import MapCoverageCircles from './MapCoverageCircles';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { initializeLeafletIcons } from '../utils/mapUtils';

initializeLeafletIcons();

export const EmergencyMapLayout = ({
  ambulances,
  helicopter,
  evacuationPoints,
  currentEmergency,
  nearestEvacuationPoint,
  etas,
  mapLayers,
  showFilters,
  ambulanceFilter,
  isAddPointDialogOpen,
  setIsAddPointDialogOpen,
  handleEmergencyClick,
  handleAssignResource,
  toggleLayer,
  setShowFilters,
  setAmbulanceFilter,
  addEvacuationPoint,
  isLayerVisible,
  getFilteredAmbulances,
}) => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <SidebarProvider>
        <div className="flex w-full h-full">
          <MapControls
            currentEmergency={currentEmergency}
            nearestEvacuationPoint={nearestEvacuationPoint}
            etas={etas}
            ambulances={ambulances}
            helicopter={helicopter}
            mapLayers={mapLayers}
            showFilters={showFilters}
            ambulanceFilter={ambulanceFilter}
            onAddPointClick={() => setIsAddPointDialogOpen(true)}
            onToggleLayer={toggleLayer}
            onToggleFilters={() => setShowFilters((prev: boolean) => !prev)}
            onAmbulanceFilterChange={setAmbulanceFilter}
            onAssignResource={handleAssignResource}
            collapsible="offcanvas"
          />
          
          <SidebarInset className="flex-1 flex flex-col">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
              <SidebarTrigger className="-ml-1" />
              <div className="text-lg font-semibold">Mapa de Emergencias</div>
            </header>
            
            <div className="flex-1 relative">
              <MapContainer
                center={[42.4627, -2.4450]}
                zoom={10}
                style={{
                  height: "100%",
                  width: "100%",
                  cursor: 'grab',
                }}
                scrollWheelZoom
                zoomControl={false}
                className="leaflet-container"
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="topright" />
                <MapClickHandler onMapClick={handleEmergencyClick} />

                <MapMarkers
                  ambulances={ambulances}
                  helicopter={helicopter}
                  evacuationPoints={evacuationPoints}
                  currentEmergency={currentEmergency}
                  nearestEvacuationPoint={nearestEvacuationPoint}
                  isLayerVisible={isLayerVisible}
                  getFilteredAmbulances={getFilteredAmbulances}
                />
                <MapCoverageCircles
                  ambulances={ambulances}
                  showCoverage={isLayerVisible('coverage_zones')}
                  getFilteredAmbulances={getFilteredAmbulances}
                />
                <MapRoutes
                  currentEmergency={currentEmergency}
                  ambulances={ambulances}
                  helicopter={helicopter}
                />
              </MapContainer>
              
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md text-sm text-foreground pointer-events-none">
                <p>💡 Haz clic en el mapa para simular una emergencia</p>
              </div>
            </div>
          </SidebarInset>
        </div>
        
        <AddEvacuationPointDialog
          open={isAddPointDialogOpen}
          onOpenChange={setIsAddPointDialogOpen}
          onSave={addEvacuationPoint}
        />
      </SidebarProvider>
    </div>
  );
};
