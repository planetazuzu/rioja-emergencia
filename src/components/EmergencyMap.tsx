import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { findNearestEvacuationPoint, calculateAllETAs } from '../utils/calculations';
import { Ambulance, Helicopter, EvacuationPoint, Emergency, ETA, MapLayer } from '../types/emergency';
import { AddEvacuationPointDialog } from './AddEvacuationPointDialog';
import { MapControls } from './MapControls';
import { MapMarkers } from './MapMarkers';
import { MapClickHandler } from './MapClickHandler';
import { useToast } from "@/hooks/use-toast";
import { initializeLeafletIcons } from '../utils/mapUtils';
import { MapRoutes } from './MapRoutes';
import { 
  loadAmbulancesFromLocal, 
  loadHelicopterFromLocal, 
  loadEvacuationPointsFromLocal,
  saveEvacuationPointsToLocal,
  saveAmbulancesToLocal,
  saveHelicopterToLocal,
  initializeDefaultData 
} from '../utils/localStorage';

// Inicializar iconos de Leaflet
initializeLeafletIcons();

const EmergencyMap: React.FC = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [helicopter, setHelicopter] = useState<Helicopter | null>(null);
  const [evacuationPoints, setEvacuationPoints] = useState<EvacuationPoint[]>([]);
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

  // Cargar datos desde localStorage al inicializar
  useEffect(() => {
    initializeDefaultData();
    
    const loadedAmbulances = loadAmbulancesFromLocal();
    const loadedHelicopter = loadHelicopterFromLocal();
    const loadedPoints = loadEvacuationPointsFromLocal();

    setAmbulances(loadedAmbulances);
    setHelicopter(loadedHelicopter);
    setEvacuationPoints(loadedPoints);

    console.log('Datos cargados desde localStorage:', {
      ambulances: loadedAmbulances.length,
      helicopter: loadedHelicopter ? 1 : 0,
      evacuationPoints: loadedPoints.length
    });
  }, []);

  const handleEmergencyClick = (lat: number, lng: number) => {
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

    // Encontrar punto de evacuación más cercano
    const nearest = findNearestEvacuationPoint(lat, lng, evacuationPoints);
    setNearestEvacuationPoint(nearest);

    // Calcular ETAs si hay punto de evacuación y helicóptero
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
    
    // Cambiar asignación en la emergencia actual
    setCurrentEmergency(prev => {
      if (!prev) return null;
      const newAssigned = isAssignedCurrently
        ? prev.assignedResources.filter(id => id !== resourceId)
        : [...prev.assignedResources, resourceId];
      return { ...prev, assignedResources: newAssigned };
    });

    // Cambiar disponibilidad en la lista de recursos
    if (isAmbulance) {
      const updatedAmbulances = ambulances.map(amb => {
        if (amb.id === resourceId) {
          resourceName = amb.name;
          return { ...amb, available: isAssignedCurrently }; // Si estaba asignado, ahora está disponible
        }
        return amb;
      });
      setAmbulances(updatedAmbulances);
      saveAmbulancesToLocal(updatedAmbulances);
    } else if (helicopter && helicopter.id === resourceId) {
      resourceName = helicopter.name;
      const updatedHelicopter = { ...helicopter, available: isAssignedCurrently };
      setHelicopter(updatedHelicopter);
      saveHelicopterToLocal(updatedHelicopter);
    }

    toast({
      title: "Recurso actualizado",
      description: `${resourceName} ha sido ${isAssignedCurrently ? 'liberado' : 'asignado'} a la emergencia.`,
    });
  };

  const handleSaveNewPoint = (pointData: Omit<EvacuationPoint, 'id'>) => {
    const newPoint: EvacuationPoint = {
      ...pointData,
      id: `eva-custom-${Date.now()}`,
    };

    const updatedPoints = [...evacuationPoints, newPoint];
    setEvacuationPoints(updatedPoints);
    saveEvacuationPointsToLocal(updatedPoints);

    toast({
      title: "Punto de aterrizaje guardado",
      description: `${newPoint.name} ha sido guardado en la memoria del dispositivo.`,
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
    let filtered = ambulances;
    
    switch (ambulanceFilter) {
      case 'SVB':
        filtered = ambulances.filter(amb => amb.type === 'SVB');
        break;
      case 'SVA':
        filtered = ambulances.filter(amb => amb.type === 'SVA');
        break;
      case 'available':
        filtered = ambulances.filter(amb => amb.available);
        break;
      default:
        filtered = ambulances;
    }
    
    return filtered;
  };

  const isLayerVisible = (layerType: string) => {
    const layer = mapLayers.find(l => l.type === layerType);
    return layer ? layer.visible : true;
  };

  // No simular incidente automático, esperar interacción del usuario
  
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Panel de control lateral */}
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

      {/* Mapa principal */}
      <div className="flex-1 p-4 relative min-h-0">
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

          <MapRoutes 
            currentEmergency={currentEmergency}
            ambulances={ambulances}
            helicopter={helicopter}
          />
        </MapContainer>
        
        <AddEvacuationPointDialog
          open={isAddPointDialogOpen}
          onOpenChange={setIsAddPointDialogOpen}
          onSave={handleSaveNewPoint}
        />

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-white/80 px-4 py-2 rounded-lg shadow-md text-sm text-gray-700 pointer-events-none">
          <p>💡 Haz clic en el mapa para simular una emergencia</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;
