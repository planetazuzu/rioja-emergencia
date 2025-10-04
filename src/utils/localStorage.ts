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
  // Se fuerza la recarga de datos por defecto para asegurar que el listado está completo y corregir posibles datos corruptos en localStorage.

  const defaultAmbulances: Ambulance[] = [
    { id: 'amb-001', name: 'Arnedo SVB', type: 'SVB', lat: 42.228403, lng: -2.103743, base: 'Avda. de Benidorm, 57', schedule: '24 h', available: true },
    { id: 'amb-002', name: 'Calahorra SVB', type: 'SVB', lat: 42.303073, lng: -1.959470, base: 'C/ Severo Ochoa s/n', schedule: '24 h', available: true },
    { id: 'amb-003', name: 'Calahorra SVA', type: 'SVA', lat: 42.303173, lng: -1.959570, base: 'C/ Severo Ochoa s/n', schedule: '24 h', available: true },
    { id: 'amb-004', name: 'Alfaro SVB', type: 'SVB', lat: 42.177454, lng: -1.748113, base: 'Travesía de La Ermita nº1', schedule: '24 h', available: true },
    { id: 'amb-005', name: 'Cervera del Río Alhama SVB', type: 'SVB', lat: 41.995335, lng: -1.997730, base: 'Avda. de la Constitución, s/n', schedule: '24 h', available: true },
    { id: 'amb-006', name: 'Nájera SVB', type: 'SVB', lat: 42.418640, lng: -2.734210, base: 'Avda. de La Rioja, 7', schedule: '24 h', available: true },
    { id: 'amb-007', name: 'Santo Domingo de la Calzada SVB', type: 'SVB', lat: 42.441264, lng: -2.954866, base: 'C/ Winnenden, esquina Camino Lechares', schedule: '24 h', available: true },
    { id: 'amb-008', name: 'Haro SVB', type: 'SVB', lat: 42.574701, lng: -2.849061, base: 'Centro de Salud Haro', schedule: '24 h', available: true },
    { id: 'amb-009', name: 'Haro SVA', type: 'SVA', lat: 42.574801, lng: -2.849161, base: 'Centro de Salud Haro', schedule: '24 h', available: true },
    { id: 'amb-010', name: 'Villamediana de Iregua SVB', type: 'SVB', lat: 42.427027, lng: -2.402913, base: 'C. Gonzalo de Berceo, 14', schedule: '24 h', available: true },
    { id: 'amb-011', name: 'Ribafrecha SVB', type: 'SVB', lat: 42.343565, lng: -2.359059, base: 'Uriemo, 3 BAJO', schedule: '24 h', available: true },
    { id: 'amb-012', name: 'CARPA Logroño SVB (1)', type: 'SVB', lat: 42.465834, lng: -2.440869, base: 'C. Obispo Lepe, S/N', schedule: '24 h', available: true },
    { id: 'amb-013', name: 'CARPA Logroño SVB (2)', type: 'SVB', lat: 42.465934, lng: -2.440969, base: 'C. Obispo Lepe, S/N', schedule: '24 h', available: true },
    { id: 'amb-014', name: 'CARPA Logroño SVA', type: 'SVA', lat: 42.466034, lng: -2.441069, base: 'C. Obispo Lepe, S/N', schedule: '24 h', available: true },
    { id: 'amb-015', name: 'Logroño Cascajos SVB', type: 'SVB', lat: 42.458877, lng: -2.454585, base: 'C/ Pedregales, 19-21', schedule: '12 h (día)', available: true },
    { id: 'amb-016', name: 'Logroño Siete Infantes SVA', type: 'SVA', lat: 42.465214, lng: -2.432666, base: 'C/ Siete Infantes de Lara, 2', schedule: '12 h (día)', available: true },
    { id: 'amb-017', name: 'Villanueva de Cameros SVB', type: 'SVB', lat: 42.151920, lng: -2.726340, base: 'CR N-111, 292', schedule: '24 h', available: true },
    { id: 'amb-018', name: 'Cenicero SVB', type: 'SVB', lat: 42.515223, lng: -2.662323, base: 'Av. Pepe Blanco, 16', schedule: '12 h (día)', available: true },
  ];
  saveAmbulancesToLocal(defaultAmbulances);

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
};

// Funciones legacy para mantener compatibilidad (deprecated)
export const saveCustomPointsToLocal = saveEvacuationPointsToLocal;
export const loadCustomPointsFromLocal = loadEvacuationPointsFromLocal;
