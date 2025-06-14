
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Ambulance as AmbulanceIcon, 
  Plane, 
  Clock, 
  Filter,
  Eye,
  EyeOff,
  AlertTriangle,
  Navigation
} from 'lucide-react';
import { mockAmbulances, mockHelicopter, mockEvacuationPoints } from '../data/mockData';
import { findNearestEvacuationPoint, calculateAllETAs, formatETA } from '../utils/calculations';
import { Ambulance, Helicopter, EvacuationPoint, Emergency, ETA, MapLayer } from '../types/emergency';

// Simulación de mapa básico (en una implementación real usarías Leaflet o Mapbox)
const MapContainer: React.FC<{
  children: React.ReactNode;
  center: [number, number];
  zoom: number;
  className?: string;
}> = ({ children, center, zoom, className = '' }) => {
  return (
    <div className={`bg-slate-100 border-2 border-slate-200 rounded-lg relative overflow-hidden ${className}`}>
      <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs text-gray-600">
        Mapa de La Rioja - Centro: {center[0].toFixed(4)}, {center[1].toFixed(4)} | Zoom: {zoom}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-60"></div>
      {children}
    </div>
  );
};

const MapMarker: React.FC<{
  lat: number;
  lng: number;
  children: React.ReactNode;
  className?: string;
}> = ({ lat, lng, children, className = '' }) => {
  // Convertir coordenadas a posición en el mapa (simulación)
  const baseLatRange = [42.0, 42.8]; // Rango aproximado de La Rioja
  const baseLngRange = [-3.0, -1.5];
  
  const x = ((lng - baseLngRange[0]) / (baseLngRange[1] - baseLngRange[0])) * 100;
  const y = ((baseLatRange[1] - lat) / (baseLatRange[1] - baseLatRange[0])) * 100;
  
  return (
    <div 
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${className}`}
      style={{ 
        left: `${Math.max(5, Math.min(95, x))}%`, 
        top: `${Math.max(5, Math.min(95, y))}%` 
      }}
    >
      {children}
    </div>
  );
};

const EmergencyMap: React.FC = () => {
  const [ambulances] = useState<Ambulance[]>(mockAmbulances);
  const [helicopter] = useState<Helicopter>(mockHelicopter);
  const [evacuationPoints] = useState<EvacuationPoint[]>(mockEvacuationPoints);
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

    // Calcular ETAs si hay punto de evacuación
    if (nearest) {
      const calculatedETAs = calculateAllETAs(ambulances, helicopter, nearest.lat, nearest.lng);
      setEtas(calculatedETAs);
    }
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

  // Simular un incidente de ejemplo
  useEffect(() => {
    const timer = setTimeout(() => {
      handleEmergencyClick(42.3500, -2.1000); // Coordenadas entre Calahorra y Arnedo
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Panel de control lateral */}
      <div className="w-full lg:w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-emergency-red flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Emergencias La Rioja
          </h1>
        </div>

        {/* Controles de capas */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Capas del Mapa</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {mapLayers.map(layer => (
              <div key={layer.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{layer.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLayer(layer.id)}
                >
                  {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>

          {showFilters && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Filtros Ambulancias</h3>
              <div className="space-y-1">
                {['all', 'SVB', 'SVA', 'available'].map(filter => (
                  <Button
                    key={filter}
                    variant={ambulanceFilter === filter ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setAmbulanceFilter(filter as typeof ambulanceFilter)}
                  >
                    {filter === 'all' ? 'Todas' : 
                     filter === 'available' ? 'Disponibles' : filter}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Información de emergencia actual */}
        {currentEmergency && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-emergency-red animate-pulse-emergency" />
              <h2 className="font-semibold text-emergency-red">Emergencia Activa</h2>
            </div>
            
            <Card className="p-3 bg-red-50 border-red-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{currentEmergency.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{currentEmergency.timestamp.toLocaleTimeString()}</span>
                </div>
                <Badge variant="destructive" className="w-fit">
                  Prioridad {currentEmergency.priority.toUpperCase()}
                </Badge>
              </div>
            </Card>
          </div>
        )}

        {/* Punto de evacuación recomendado */}
        {nearestEvacuationPoint && (
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-emergency-blue mb-3 flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Punto de Evacuación
            </h2>
            
            <Card className="p-3 bg-blue-50 border-blue-200">
              <div className="space-y-2">
                <h3 className="font-medium text-blue-900">{nearestEvacuationPoint.name}</h3>
                <p className="text-sm text-blue-700">{nearestEvacuationPoint.locality}</p>
                <p className="text-xs text-blue-600">{nearestEvacuationPoint.description}</p>
                <Badge variant="secondary" className="w-fit">
                  {nearestEvacuationPoint.status === 'available' ? 'Disponible' : 'No disponible'}
                </Badge>
              </div>
            </Card>
          </div>
        )}

        {/* ETAs */}
        {etas.length > 0 && (
          <div className="p-4">
            <h2 className="font-semibold text-emergency-orange mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tiempos de Llegada (ETA)
            </h2>
            
            <div className="space-y-2">
              {etas.map(eta => {
                const resource = eta.resourceType === 'ambulance' 
                  ? ambulances.find(amb => amb.id === eta.resourceId)
                  : helicopter;
                
                return (
                  <Card key={eta.resourceId} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {eta.resourceType === 'ambulance' ? (
                          <AmbulanceIcon className="h-4 w-4 text-emergency-red" />
                        ) : (
                          <Plane className="h-4 w-4 text-emergency-blue" />
                        )}
                        <div>
                          <p className="font-medium text-sm">
                            {eta.resourceType === 'ambulance' ? 
                              (resource as Ambulance)?.name : 
                              (resource as Helicopter)?.name}
                          </p>
                          <p className="text-xs text-gray-500">{eta.distance} km</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="font-bold">
                        {formatETA(eta.eta)}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mapa principal */}
      <div className="flex-1 p-4">
        <MapContainer 
          center={[42.4627, -2.4450]} 
          zoom={10}
          className="map-container"
        >
          {/* Ambulancias */}
          {isLayerVisible('ambulances') && getFilteredAmbulances().map(ambulance => (
            <MapMarker 
              key={ambulance.id}
              lat={ambulance.lat} 
              lng={ambulance.lng}
              className="cursor-pointer"
            >
              <div className="relative">
                <div className={`p-2 rounded-full ${ambulance.available ? 'bg-green-500' : 'bg-gray-400'} shadow-lg hover:scale-110 transition-transform`}>
                  <AmbulanceIcon className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white text-xs px-1 rounded border">
                  {ambulance.type}
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                  {ambulance.name}
                </div>
              </div>
            </MapMarker>
          ))}

          {/* Helicóptero */}
          {isLayerVisible('helicopter') && (
            <MapMarker lat={helicopter.lat} lng={helicopter.lng}>
              <div className="relative">
                <div className={`p-2 rounded-full ${helicopter.available ? 'bg-blue-500' : 'bg-gray-400'} shadow-lg hover:scale-110 transition-transform`}>
                  <Plane className="h-5 w-5 text-white" />
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                  {helicopter.name}
                </div>
              </div>
            </MapMarker>
          )}

          {/* Puntos de evacuación */}
          {isLayerVisible('evacuation_points') && evacuationPoints.map(point => (
            <MapMarker 
              key={point.id}
              lat={point.lat} 
              lng={point.lng}
            >
              <div className="relative">
                <div className={`p-2 rounded-full ${point.status === 'available' ? 'bg-orange-500' : 'bg-red-500'} shadow-lg hover:scale-110 transition-transform`}>
                  <Navigation className="h-4 w-4 text-white" />
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-10">
                  {point.name}
                </div>
              </div>
            </MapMarker>
          ))}

          {/* Emergencia actual */}
          {isLayerVisible('incidents') && currentEmergency && (
            <MapMarker lat={currentEmergency.lat} lng={currentEmergency.lng}>
              <div className="relative">
                <div className="p-3 rounded-full bg-red-600 shadow-lg animate-pulse-emergency">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  EMERGENCIA ACTIVA
                </div>
              </div>
            </MapMarker>
          )}

          {/* Punto de evacuación recomendado (resaltado) */}
          {nearestEvacuationPoint && (
            <MapMarker lat={nearestEvacuationPoint.lat} lng={nearestEvacuationPoint.lng}>
              <div className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-75 scale-150"></div>
            </MapMarker>
          )}
        </MapContainer>
        
        {/* Instrucciones */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>💡 Haz clic en cualquier punto del mapa para simular una emergencia</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;
