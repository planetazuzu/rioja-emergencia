
import { useState, useEffect } from 'react';
import { Ambulance, Helicopter, EvacuationPoint } from '../types/emergency';
import { 
  loadAmbulancesFromDexie, 
  loadHelicopterFromDexie, 
  loadEvacuationPointsFromDexie,
  saveEvacuationPointsToDexie,
  saveAmbulancesToDexie,
  saveHelicopterToDexie,
  initializeDefaultDataInDexie 
} from '../services/dexieDatabase';
import { useToast } from "@/components/ui/use-toast";

export function useEmergencyData() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [helicopter, setHelicopter] = useState<Helicopter | null>(null);
  const [evacuationPoints, setEvacuationPoints] = useState<EvacuationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeDefaultDataInDexie();
        
        const loadedAmbulances = await loadAmbulancesFromDexie();
        const loadedHelicopter = await loadHelicopterFromDexie();
        const loadedPoints = await loadEvacuationPointsFromDexie();

        setAmbulances(loadedAmbulances);
        setHelicopter(loadedHelicopter);
        setEvacuationPoints(loadedPoints);
      } catch (error) {
        console.error('Error loading data from Dexie:', error);
        toast({
          variant: "destructive",
          title: "Error cargando datos",
          description: "No se pudieron cargar los datos desde la base de datos local."
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const updateAmbulances = async (updatedAmbulances: Ambulance[]) => {
    try {
      setAmbulances(updatedAmbulances);
      await saveAmbulancesToDexie(updatedAmbulances);
    } catch (error) {
      console.error('Error updating ambulances:', error);
      toast({
        variant: "destructive",
        title: "Error guardando ambulancias",
        description: "No se pudieron guardar los cambios."
      });
    }
  };

  const updateHelicopter = async (updatedHelicopter: Helicopter | null) => {
    try {
      setHelicopter(updatedHelicopter);
      if(updatedHelicopter) {
        await saveHelicopterToDexie(updatedHelicopter);
      }
    } catch (error) {
      console.error('Error updating helicopter:', error);
      toast({
        variant: "destructive",
        title: "Error guardando helicóptero",
        description: "No se pudieron guardar los cambios."
      });
    }
  };

  const addEvacuationPoint = async (pointData: Omit<EvacuationPoint, 'id'>) => {
    try {
      const newPoint: EvacuationPoint = {
        ...pointData,
        id: `eva-custom-${Date.now()}`,
      };

      const updatedPoints = [...evacuationPoints, newPoint];
      setEvacuationPoints(updatedPoints);
      await saveEvacuationPointsToDexie(updatedPoints);

      toast({
        title: "Punto de aterrizaje guardado",
        description: `${newPoint.name} ha sido guardado en la base de datos local.`,
      });
    } catch (error) {
      console.error('Error adding evacuation point:', error);
      toast({
        variant: "destructive",
        title: "Error guardando punto",
        description: "No se pudo guardar el punto de aterrizaje."
      });
    }
  };

  return {
    ambulances,
    helicopter,
    evacuationPoints,
    loading,
    updateAmbulances,
    updateHelicopter,
    addEvacuationPoint,
  };
}
