
import { useState } from 'react';
import { findNearestEvacuationPoint, calculateAllETAs } from '../utils/calculations';
import { useToast } from "@/components/ui/use-toast";
import { useLandingPointLocation } from "../components/LandingPointLocationContext";
import { useEmergencyData } from './useEmergencyData';

export function useEmergencyMapState() {
  const { 
    ambulances, 
    helicopter, 
    evacuationPoints,
    updateAmbulances,
    updateHelicopter,
    addEvacuationPoint 
  } = useEmergencyData();
  const [currentEmergency, setCurrentEmergency] = useState(null);
  const [etas, setEtas] = useState([]);
  const [nearestEvacuationPoint, setNearestEvacuationPoint] = useState(null);
  const [mapLayers, setMapLayers] = useState([
    { id: 'ambulances', name: 'Ambulancias', visible: true, type: 'ambulances' },
    { id: 'helicopter', name: 'Helicóptero', visible: true, type: 'helicopter' },
    { id: 'evacuation_points', name: 'Puntos de Evacuación', visible: true, type: 'evacuation_points' },
    { id: 'coverage_zones', name: 'Zonas de Cobertura', visible: false, type: 'coverage_zones' },
    { id: 'incidents', name: 'Incidentes', visible: true, type: 'incidents' },
  ]);
  const [showFilters, setShowFilters] = useState(false);
  const [ambulanceFilter, setAmbulanceFilter] = useState('all');
  const [isAddPointDialogOpen, setIsAddPointDialogOpen] = useState(false);

  const { toast } = useToast();
  const { setLatLng } = useLandingPointLocation();

  const handleEmergencyClick = (lat, lng) => {
    setLatLng(lat, lng);
    const emergency = {
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

  const handleAssignResource = (resourceId) => {
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

  const toggleLayer = (layerId) => {
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

  const isLayerVisible = (layerType) => {
    const layer = mapLayers.find(l => l.type === layerType);
    return layer ? layer.visible : true;
  };

  return {
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
  };
}
