
import { useState, useEffect } from 'react';
import { Ambulance, Helicopter, EvacuationPoint } from '../types/emergency';
import { 
  loadAmbulancesFromLocal, 
  loadHelicopterFromLocal, 
  loadEvacuationPointsFromLocal,
  saveEvacuationPointsToLocal,
  saveAmbulancesToLocal,
  saveHelicopterToLocal,
  initializeDefaultData 
} from '../utils/localStorage';
import { useToast } from "@/components/ui/use-toast";

export function useEmergencyData() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [helicopter, setHelicopter] = useState<Helicopter | null>(null);
  const [evacuationPoints, setEvacuationPoints] = useState<EvacuationPoint[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    initializeDefaultData();
    
    const loadedAmbulances = loadAmbulancesFromLocal();
    const loadedHelicopter = loadHelicopterFromLocal();
    const loadedPoints = loadEvacuationPointsFromLocal();

    setAmbulances(loadedAmbulances);
    setHelicopter(loadedHelicopter);
    setEvacuationPoints(loadedPoints);
  }, []);

  const updateAmbulances = (updatedAmbulances: Ambulance[]) => {
    setAmbulances(updatedAmbulances);
    saveAmbulancesToLocal(updatedAmbulances);
  };

  const updateHelicopter = (updatedHelicopter: Helicopter | null) => {
    setHelicopter(updatedHelicopter);
    if(updatedHelicopter) {
      saveHelicopterToLocal(updatedHelicopter);
    }
  };

  const addEvacuationPoint = (pointData: Omit<EvacuationPoint, 'id'>) => {
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

  return {
    ambulances,
    helicopter,
    evacuationPoints,
    updateAmbulances,
    updateHelicopter,
    addEvacuationPoint,
  };
}
