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
  SidebarRail,
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
    <SidebarProvider>
      <div className="relative w-full h-screen min-h-screen bg-gray-50 flex flex-row">
        {/* SidebarTrigger (visible sólo en mobile/tablet) */}
        <div className="absolute top-2 left-2 z-[1100] lg:hidden">
          <SidebarTrigger />
        </div>
        {/* Sidebar colapsable */}
        <div className="relative z-[10] h-full">
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
            collapsible="icon"
          />
          <SidebarRail />
        </div>
        {/* Contenedor mapa - DEBE OCUPAR TODO EL ESPACIO DISPONIBLE */}
        <div
          className="flex-1 min-w-0 min-h-0 relative h-screen min-h-screen bg-gradient-to-br from-blue-100/10 to-blue-200/20"
          style={{ boxSizing: 'border-box', border: '2px solid #3b82f6' }} // Borde azul para depuración, puedes quitarlo después
        >
          <MapContainer
            center={[42.4627, -2.4450]}
            zoom={10}
            style={{
              height: "100%",
              width: "100%",
              minHeight: "100%",
              borderRadius: '0.5rem',
              cursor: 'grab',
              background: "#cffafe", // Fondo azul muy claro para depuración
            }}
            scrollWheelZoom
            zoomControl={false}
            className="leaflet-container" // Para ayudar en depuración y consistencia
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
          <AddEvacuationPointDialog
            open={isAddPointDialogOpen}
            onOpenChange={setIsAddPointDialogOpen}
            onSave={addEvacuationPoint}
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md text-sm text-foreground pointer-events-none">
            <p>💡 Haz clic en el mapa para simular una emergencia</p>
          </div>
        </div>
      </div>
      {/* CSS global height fix */}
      <style>
        {`
          html, body, #root {
            height: 100% !important;
            min-height: 100vh !important;
            box-sizing: border-box;
          }
          .leaflet-container {
            min-height: 100% !important;
            height: 100% !important;
            background: #bae6fd !important;
          }
        `}
      </style>
    </SidebarProvider>
  );
};
