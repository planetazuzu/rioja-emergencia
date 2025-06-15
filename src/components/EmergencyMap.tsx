import React, { useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { findNearestEvacuationPoint, calculateAllETAs } from '../utils/calculations';
import { Emergency, ETA, MapLayer, EvacuationPoint } from '../types/emergency';
import { AddEvacuationPointDialog } from './AddEvacuationPointDialog';
import { MapControls } from './MapControls';
import { MapMarkers } from './MapMarkers';
import { MapClickHandler } from './MapClickHandler';
import { useToast } from "@/components/ui/use-toast";
import { initializeLeafletIcons } from '../utils/mapUtils';
import MapRoutes from './MapRoutes';
import MapCoverageCircles from './MapCoverageCircles';
import { useLandingPointLocation } from "./LandingPointLocationContext";
import { useEmergencyData } from '../hooks/useEmergencyData';

initializeLeafletIcons();

const EmergencyMap: React.FC = () => {
  const { 
    ambulances, 
    helicopter, 
    evacuationPoints,
    updateAmbulances,
    updateHelicopter,
    addEvacuationPoint 
  } = useEmergencyData();
  
  const [currentEmergency, setCurrentEmergency] = useState<Emergency | null>(null);
  const [etas, setEtas] = useState<ETA[]>([]);
  const [nearestEvacuationPoint, setNearestEvacuationPoint] = useState<EvacuationPoint | null>(null);
  const [mapLayers, setMapLayers] = useState<MapLayer[]>([
    { id: 'ambulances', name: 'Ambulancias', visible: true, type: 'ambulances' },
    { id: 'helicopter', name: 'Helicóptero', visible: true, type: 'helicopter' },
    { id: 'evacuation_points', name: 'Puntos de Evacuación', visible: true, type: 'evacuation_points' },
    { id: 'coverage_zones', name: 'Zonas de Cobertura', visible: false, type: 'coverage_zones' },
    { id: 'incidents', name: 'Incidentes', visible: true, type: 'incidents' },
  ]);

  const [showFilters, setShowFilters] = useState(false);
  const [ambulanceFilter, setAmbulanceFilter] = useState<'all' | 'SVB' | 'SVA' | 'available'>('all');
  const [isAddPointDialogOpen, setIsAddPointDialogOpen] = useState(false);
  const { toast } = useToast();
  const { setLatLng } = useLandingPointLocation();

  const handleEmergencyClick = (lat: number, lng: number) => {
    setLatLng(lat, lng);

    const emergency: Emergency = {
      id: `emergency-${Date.now()}`,
      lat,
      lng,
      address: `Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      description: 'Emergencia sanitaria',
      timestamp: new Date(),
      priority: 'high',
      requiresHelicopter: true,
      assignedResources: [],
    };

    setCurrentEmergency(emergency);

    const nearest = findNearestEvacuationPoint(lat, lng, evacuationPoints);
    setNearestEvacuationPoint(nearest);

    if (nearest && helicopter) {
      const calculatedETAs = calculateAllETAs(ambulances, helicopter, nearest.lat, nearest.lng);
      setEtas(calculatedETAs);
    }
  };

  const handleAssignResource = (resourceId: string) => {
    const isAmbulance = ambulances.some(a => a.id === resourceId);
    let resourceName = '';
    let isAssignedCurrently = false;

    if (currentEmergency) {
      isAssignedCurrently = currentEmergency.assignedResources.includes(resourceId);
    }
    
    setCurrentEmergency(prev => {
      if (!prev) return null;
      const newAssigned = isAssignedCurrently
        ? prev.assignedResources.filter(id => id !== resourceId)
        : [...prev.assignedResources, resourceId];
      return { ...prev, assignedResources: newAssigned };
    });

    if (isAmbulance) {
      const updatedAmbulances = ambulances.map(amb => {
        if (amb.id === resourceId) {
          resourceName = amb.name;
          return { ...amb, available: isAssignedCurrently };
        }
        return amb;
      });
      updateAmbulances(updatedAmbulances);
    } else if (helicopter && helicopter.id === resourceId) {
      resourceName = helicopter.name;
      const updatedHelicopter = { ...helicopter, available: isAssignedCurrently };
      updateHelicopter(updatedHelicopter);
    }

    toast({
      title: "Recurso actualizado",
      description: `${resourceName} ha sido ${isAssignedCurrently ? 'liberado' : 'asignado'} a la emergencia.`,
    });
  };

  const toggleLayer = (layerId: string) => {
    setMapLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    );
  };

  const getFilteredAmbulances = () => {
    switch (ambulanceFilter) {
      case 'SVB':
        return ambulances.filter(amb => amb.type === 'SVB');
      case 'SVA':
        return ambulances.filter(amb => amb.type === 'SVA');
      case 'available':
        return ambulances.filter(amb => amb.available);
      default:
        return ambulances;
    }
  };

  const isLayerVisible = (layerType: string) => {
    const layer = mapLayers.find(l => l.type === layerType);
    return layer ? layer.visible : true;
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
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
        onToggleFilters={() => setShowFilters(!showFilters)}
        onAmbulanceFilterChange={setAmbulanceFilter}
        onAssignResource={handleAssignResource}
      />

      <div className="flex-1 p-4 relative min-h-0 h-full min-h-[400px]">
        <MapContainer 
          center={[42.4627, -2.4450]} 
          zoom={10}
          style={{ height: "100%", width: "100%", borderRadius: '0.5rem', cursor: 'grab' }}
          scrollWheelZoom
          zoomControl={false}
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
  );
};

export default EmergencyMap;
