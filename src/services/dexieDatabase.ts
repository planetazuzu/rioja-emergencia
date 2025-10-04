
import Dexie, { Table } from 'dexie';
import { EvacuationPoint, Ambulance, Helicopter } from '../types/emergency';

// Interfaces para las tablas
export interface StoredEvacuationPoint extends EvacuationPoint {}
export interface StoredAmbulance extends Ambulance {}
export interface StoredHelicopter extends Helicopter {}
export interface StoredDraft {
  id: string;
  type: 'evacuation-point' | 'review-form';
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

export class EmergencyDatabase extends Dexie {
  evacuationPoints!: Table<StoredEvacuationPoint>;
  ambulances!: Table<StoredAmbulance>;
  helicopters!: Table<StoredHelicopter>;
  drafts!: Table<StoredDraft>;

  constructor() {
    super('EmergencyDatabase');
    this.version(1).stores({
      evacuationPoints: 'id, name, locality, lat, lng, status, isDaytimeOnly, createdBy',
      ambulances: 'id, name, type, lat, lng, available',
      helicopters: 'id, name, lat, lng, available',
      drafts: 'id, type, createdAt, updatedAt'
    });
  }
}

export const db = new EmergencyDatabase();

// Funciones helper para puntos de evacuación
export const saveEvacuationPointsToDexie = async (points: EvacuationPoint[]): Promise<void> => {
  try {
    await db.evacuationPoints.clear();
    await db.evacuationPoints.bulkAdd(points);
  } catch (error) {
    console.error("Error saving evacuation points to Dexie:", error);
  }
};

export const loadEvacuationPointsFromDexie = async (): Promise<EvacuationPoint[]> => {
  try {
    return await db.evacuationPoints.toArray();
  } catch (error) {
    console.error("Error loading evacuation points from Dexie:", error);
    return [];
  }
};

// Funciones helper para ambulancias
export const saveAmbulancesToDexie = async (ambulances: Ambulance[]): Promise<void> => {
  try {
    await db.ambulances.clear();
    await db.ambulances.bulkAdd(ambulances);
  } catch (error) {
    console.error("Error saving ambulances to Dexie:", error);
  }
};

export const loadAmbulancesFromDexie = async (): Promise<Ambulance[]> => {
  try {
    return await db.ambulances.toArray();
  } catch (error) {
    console.error("Error loading ambulances from Dexie:", error);
    return [];
  }
};

// Funciones helper para helicópteros
export const saveHelicopterToDexie = async (helicopter: Helicopter): Promise<void> => {
  try {
    await db.helicopters.clear();
    await db.helicopters.add(helicopter);
  } catch (error) {
    console.error("Error saving helicopter to Dexie:", error);
  }
};

export const loadHelicopterFromDexie = async (): Promise<Helicopter | null> => {
  try {
    const helicopters = await db.helicopters.toArray();
    return helicopters.length > 0 ? helicopters[0] : null;
  } catch (error) {
    console.error("Error loading helicopter from Dexie:", error);
    return null;
  }
};

// Funciones helper para borradores
export const saveDraftToDexie = async (type: 'evacuation-point' | 'review-form', data: any): Promise<string> => {
  try {
    const draft: StoredDraft = {
      id: crypto.randomUUID(),
      type,
      data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.drafts.add(draft);
    return draft.id;
  } catch (error) {
    console.error("Error saving draft to Dexie:", error);
    throw error;
  }
};

export const loadDraftsFromDexie = async (type?: 'evacuation-point' | 'review-form'): Promise<StoredDraft[]> => {
  try {
    if (type) {
      return await db.drafts.where('type').equals(type).toArray();
    }
    return await db.drafts.toArray();
  } catch (error) {
    console.error("Error loading drafts from Dexie:", error);
    return [];
  }
};

export const updateDraftInDexie = async (id: string, data: any): Promise<void> => {
  try {
    await db.drafts.update(id, { data, updatedAt: new Date() });
  } catch (error) {
    console.error("Error updating draft in Dexie:", error);
    throw error;
  }
};

export const deleteDraftFromDexie = async (id: string): Promise<void> => {
  try {
    await db.drafts.delete(id);
  } catch (error) {
    console.error("Error deleting draft from Dexie:", error);
    throw error;
  }
};

// Función para inicializar datos por defecto
export const initializeDefaultDataInDexie = async (): Promise<void> => {
  try {
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

    const defaultHelicopter: Helicopter = {
      id: 'heli-001',
      name: 'Helicóptero Sanitario La Rioja',
      lat: 42.46642,
      lng: -2.44184,
      base: 'Hospital San Pedro',
      available: true,
      speed: 180,
    };

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

    await saveAmbulancesToDexie(defaultAmbulances);
    await saveHelicopterToDexie(defaultHelicopter);
    await saveEvacuationPointsToDexie(defaultPoints);
  } catch (error) {
    console.error("Error initializing default data in Dexie:", error);
  }
};
