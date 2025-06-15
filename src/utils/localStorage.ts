
import { EvacuationPoint, Ambulance, Helicopter } from '../types/emergency';

// Claves de almacenamiento
const EVACUATION_POINTS_KEY = 'emergency-evacuation-points';
const AMBULANCES_KEY = 'emergency-ambulances';
const HELICOPTER_KEY = 'emergency-helicopter';

// Funciones para puntos de evacuación
export const saveEvacuationPointsToLocal = (points: EvacuationPoint[]): void => {
  try {
    const data = JSON.stringify(points);
    localStorage.setItem(EVACUATION_POINTS_KEY, data);
  } catch (error) {
    console.error("Error saving evacuation points to local storage:", error);
  }
};

export const loadEvacuationPointsFromLocal = (): EvacuationPoint[] => {
  try {
    const data = localStorage.getItem(EVACUATION_POINTS_KEY);
    if (data) {
      return JSON.parse(data) as EvacuationPoint[];
    }
    return [];
  } catch (error) {
    console.error("Error loading evacuation points from local storage:", error);
    return [];
  }
};

// Funciones para ambulancias
export const saveAmbulancesToLocal = (ambulances: Ambulance[]): void => {
  try {
    const data = JSON.stringify(ambulances);
    localStorage.setItem(AMBULANCES_KEY, data);
  } catch (error) {
    console.error("Error saving ambulances to local storage:", error);
  }
};

export const loadAmbulancesFromLocal = (): Ambulance[] => {
  try {
    const data = localStorage.getItem(AMBULANCES_KEY);
    if (data) {
      return JSON.parse(data) as Ambulance[];
    }
    return [];
  } catch (error) {
    console.error("Error loading ambulances from local storage:", error);
    return [];
  }
};

// Funciones para helicóptero
export const saveHelicopterToLocal = (helicopter: Helicopter): void => {
  try {
    const data = JSON.stringify(helicopter);
    localStorage.setItem(HELICOPTER_KEY, data);
  } catch (error) {
    console.error("Error saving helicopter to local storage:", error);
  }
};

export const loadHelicopterFromLocal = (): Helicopter | null => {
  try {
    const data = localStorage.getItem(HELICOPTER_KEY);
    if (data) {
      return JSON.parse(data) as Helicopter;
    }
    return null;
  } catch (error) {
    console.error("Error loading helicopter from local storage:", error);
    return null;
  }
};

// Función para inicializar datos por defecto
export const initializeDefaultData = (): void => {
  // Solo inicializar si no hay datos existentes
  const existingAmbulances = loadAmbulancesFromLocal();
  const existingHelicopter = loadHelicopterFromLocal();
  const existingPoints = loadEvacuationPointsFromLocal();

  if (existingAmbulances.length === 0) {
    const defaultAmbulances: Ambulance[] = [
      {
        id: 'amb-001',
        name: 'Arnedo SVB',
        type: 'SVB',
        lat: 42.228403,
        lng: -2.103743,
        base: 'Avda. de Benidorm, 57',
        schedule: '24 h',
        available: true,
      },
      {
        id: 'amb-002',
        name: 'Calahorra SVB',
        type: 'SVB',
        lat: 42.303073,
        lng: -1.959470,
        base: 'C/ Severo Ochoa s/n',
        schedule: '24 h',
        available: true,
      },
      {
        id: 'amb-003',
        name: 'Logroño CARPA SVA',
        type: 'SVA',
        lat: 42.465834,
        lng: -2.440869,
        base: 'C. Obispo Lepe, S/N',
        schedule: '24 h',
        available: true,
      },
    ];
    saveAmbulancesToLocal(defaultAmbulances);
  }

  if (!existingHelicopter) {
    const defaultHelicopter: Helicopter = {
      id: 'heli-001',
      name: 'Helicóptero Sanitario La Rioja',
      lat: 42.46642,
      lng: -2.44184,
      base: 'Hospital San Pedro',
      available: true,
      speed: 180,
    };
    saveHelicopterToLocal(defaultHelicopter);
  }

  if (existingPoints.length === 0) {
    const defaultPoints: EvacuationPoint[] = [
      {
        id: 'eva-001',
        name: 'Helisuperficie Hospital San Pedro',
        locality: 'Logroño',
        lat: 42.46642,
        lng: -2.44184,
        description: 'Helisuperficie principal del hospital',
        status: 'available',
        restrictions: 'Ninguna',
        isDaytimeOnly: false,
        createdBy: 'System',
        photos: [],
      },
      {
        id: 'eva-002',
        name: 'Campo de Fútbol Quel',
        locality: 'Quel',
        lat: 42.2262,
        lng: -2.0744,
        description: 'Campo de fútbol municipal, fácil acceso',
        status: 'available',
        restrictions: 'Uso diurno preferente',
        isDaytimeOnly: true,
        createdBy: 'System',
        photos: [],
      },
    ];
    saveEvacuationPointsToLocal(defaultPoints);
  }
};

// Funciones legacy para mantener compatibilidad (deprecated)
export const saveCustomPointsToLocal = saveEvacuationPointsToLocal;
export const loadCustomPointsFromLocal = loadEvacuationPointsFromLocal;
